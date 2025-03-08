"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { RecurringInterval } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { serializeTransaction } from "./serialize";
import { request } from "@arcjet/next";
import aj from "@/app/api/arcjet/route";
import { TransactionFormType } from "@/app/lib/schema";

export async function createTransaction(data: TransactionFormType) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        //* Debugging: Check if request object is received
        const req = await request();

        //  Check rate limit
        const decision = await aj.protect(req, {
            userId,
            requested: 1, // specify how many tokens to consume
        });



        if (decision.isDenied()) {

            if (decision.reason.isRateLimit()) {
                const { remaining, reset } = decision.reason;
                console.error({
                    code: "RATE_LIMIT_EXCEEDED",
                    details: {
                        remaining,
                        resetInSeconds: reset,
                    },
                });

                throw new Error("Too many requests. Please try again later.");
            }

            throw new Error("Request blocked by Arcjet.");
        }


        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const account = await prisma.account.findUnique({
            where: {
                id: data.accountId,
                userId: user.id,
            },
        });

        if (!account) {
            throw new Error("Account not found");
        }

        // Calculate balance change
        const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
        const newBalance = Number(account.balance) + Number(balanceChange);

        // Function to calculate next recurring date
        function calculateNextRecurringDate(startDate: Date, interval: RecurringInterval) {
            const date = new Date(startDate);

            switch (interval) {
                case RecurringInterval.DAILY:
                    date.setDate(date.getDate() + 1);
                    break;
                case RecurringInterval.WEEKLY:
                    date.setDate(date.getDate() + 7);
                    break;
                case RecurringInterval.MONTHLY:
                    date.setMonth(date.getMonth() + 1);
                    break;
                case RecurringInterval.YEARLY:
                    date.setFullYear(date.getFullYear() + 1);
                    break;
                default:
                    break;
            }

            return date;
        }

        const transaction = await prisma.$transaction(async (tx) => {
            const newTransaction = await tx.transaction.create({
                data: {
                    ...data,
                    userId: user.id,
                    nextRecurringDate:
                        data.isRecurring && data.recurringInterval
                            ? calculateNextRecurringDate(data.date, data.recurringInterval)
                            : null,
                },
            });

            // Update account balance
            await tx.account.update({
                where: { id: data.accountId },
                data: { balance: newBalance },
            });

            return newTransaction;
        });

        revalidatePath("/dashboard");
        revalidatePath(`/account/${transaction.accountId}`);

        return { success: true, data: serializeTransaction(transaction) };
    } catch (error) {
        console.error("Error in createTransaction:", error);
        throw new Error((error as Error).message);
    }
}


// *  <====  Scan Receipt with gemini api ===>
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function scanRecipt(file: File) {
    try {
        const geminiApiKey = process.env.GEMINI_API_KEY;

        if (!geminiApiKey) {
            console.error("Gemini API key is missing");
            throw new Error("Gemini API key is not defined.");
        }

        // Debug log
        console.log("Starting receipt scan with file:", {
            name: file.name,
            type: file.type,
            size: file.size
        });

        const genAI = new GoogleGenerativeAI(geminiApiKey);
        // Using the free model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Convert file to base64 and create parts array
        const arrayBuffer = await file.arrayBuffer();
        const base64String = Buffer.from(arrayBuffer).toString('base64');

        // Create a data URL for the image
        // const dataUrl = `data:${file.type};base64,${base64String}`;

        const prompt = `
        Analyze this receipt image and extract the following information:
        - Total amount (number only, found after "Total" or "Amount Due")
        - Date (in YYYY-MM-DD format)
        - Brief description of purchase
        - Store/merchant name
        - Category (choose one: housing, transportation, groceries, utilities, entertainment, food, shopping, healthcare, education, personal, travel, insurance, gifts, bills, other-expense)

        Format the response as JSON:
        {
          "amount": number,
          "date": "YYYY-MM-DD",
          "description": "string",
          "merchantName": "string",
          "category": "string"
        }

        If you can't read the receipt, return: {}
        `;

        // Debug log
        console.log("Sending request to Gemini API");

        // Create parts array with prompt and image
        const parts = [
            { text: prompt },
            {
                inlineData: {
                    mimeType: file.type,
                    data: base64String
                }
            }
        ];

        try {
            const result = await model.generateContent(parts);
            const response = await result.response;
            const text = response.text();

            // Debug log
            console.log("Received response from Gemini API:", text);

            // Clean and parse the response
            const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
            const data = JSON.parse(cleanedText);

            // Validate the parsed data
            if (Object.keys(data).length === 0) {
                throw new Error("No receipt data could be extracted from the image");
            }

            // Debug log
            console.log("Parsed receipt data:", data);

            // Return with fallback values
            return {
                amount: parseFloat(data.amount) || 0,
                date: data.date ? new Date(data.date) : new Date(),
                description: data.description || "",
                category: data.category || "other-expense",
                merchantName: data.merchantName || ""
            };

        } catch (parseError) {
            console.error("Error processing receipt:", parseError);
            throw new Error("Could not process receipt image. Please try again with a clearer image.");
        }

    } catch (error) {
        console.error("Receipt scanning error:", error);
        if (error instanceof Error) {
            if (error.message.includes('429')) {
                throw new Error("Too many requests. Please try again later.");
            }
            if (error.message.includes('413')) {
                throw new Error("Image file is too large. Please use a smaller image.");
            }
            throw new Error(error.message);
        }
        throw new Error("Failed to scan receipt. Please try again.");
    }
}