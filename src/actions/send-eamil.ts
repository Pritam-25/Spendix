import { Resend } from 'resend';
import { EmailTemplateProps } from '../../emails/my-email';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
    to: string;
    subject: string;
    react:any
}

export async function sendEmail({ to, subject, react }: SendEmailParams) {
    try {
        const data = await resend.emails.send({
            from: "Finance App <onboarding@resend.dev>",
            to, 
            subject, 
            react, 
        });

        return { success: true, data };
    } catch (error) {
        console.error("Failed to send email", error);
        return { success: false, error };
    }
}