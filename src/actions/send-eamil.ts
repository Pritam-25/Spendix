import { Resend } from 'resend';
import { ReactElement } from 'react';


interface SendEmailParams {
    to: string;
    subject: string;
    react: ReactElement;
}

export async function sendEmail({ to, subject, react }: SendEmailParams) {

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY is not set");
        return { success: false, error: "Email service not configured" };
    }

    try {
        console.log(`Attempting to send email to ${to}`);
        const data = await resend.emails.send({
            from: "Spendix <onboarding@resend.dev>",
            to: [to],
            subject,
            react,
        });

        console.log("Email sent successfully:", data);
        return { success: true, data };
    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to send email" };
    }
}