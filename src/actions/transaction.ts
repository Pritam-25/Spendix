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


// *  <====  Scan Recipt with gemini api ===>
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";


export async function scanRecipt(file: any) {
    try {
        const geminiApiKey = process.env.GEMINI_API_KEY;

        if (!geminiApiKey) {
            throw new Error("Gemini API key is not defined.");
        }
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


        const prompt = `
        Analyze this receipt image and extract the following information in JSON format:
        - Total amount (just the number)
        - Date (in ISO format)
        - Description or items purchased (brief summary)
        - Merchant/store name
        - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
        
        Only respond with valid JSON in this exact format:
        {
          "amount": number,
          "date": "ISO date string",
          "description": "string",
          "merchantName": "string",
          "category": "string"
        }
  
        If its not a recipt, return an empty object
      `;

        const image = {
            inlineData: {
                data: Buffer.from(fs.readFileSync(file)).toString("base64"),
                mimeType: file.type,
            },
        };

        const result = await model.generateContent([prompt, image]);

        const text = result.response.text();
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

        console.log(cleanedText);


        try {
            const data = JSON.parse(cleanedText);
            return {
                amount: parseFloat(data.amount),
                date: new Date(data.date),
                description: data.description,
                category: data.category,
                merchantNmae: data.merchantName
            }
        } catch (parseError) {
            console.error("Error parsing JSON response: ", parseError);
            throw new Error("Invalid response format from Gemini")
        }

    } catch (error) {
        throw new Error("Failed to scan receipt")
    }
}