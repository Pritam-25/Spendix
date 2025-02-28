import arcjet, {
    tokenBucket,
} from "@arcjet/next";

const aj = arcjet({
    key: process.env.ARCJET_KEY || "", // Get your site key from https://app.arcjet.com
    characteristics: ["userId"], // Track requests by IP
    rules: [
        // Create a token bucket rate limit. Other algorithms are supported.
        tokenBucket({
            mode: "LIVE",
            refillRate: 2, // Refill 10 tokens per interval
            interval: 3600, // Refill every 1 hour 
            capacity: 2, // Bucket capacity of 10 tokens
        }),
    ],
});


export default aj;