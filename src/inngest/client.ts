import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({
    id: "spendix", name: "Spendix",
    retryFunction: async (attempt: number) => ({
        delay: Math.pow(2, attempt) * 100,
        maxAttempts: 2
    })
});
