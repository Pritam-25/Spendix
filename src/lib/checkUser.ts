import { currentUser } from "@clerk/nextjs/server"
import prisma from "./prisma";

export const checkUser = async () => {
    const user = await currentUser();

    if (!user) {
        return null;
    }

    try {
        const loggedInUser = await prisma.user.findUnique({
            where: {
                clerkUserId: user.id
            }
        });

        // if user is login simple login the user
        if (loggedInUser)
            return loggedInUser;

        // if user is not present then create a new user
        const name = `${user.firstName} ${user.lastName}`

        const newUser = await prisma.user.create({
            data: {
                clerkUserId: user.id,
                name,
                imageUrl: user.imageUrl,
                email: user.emailAddresses[0].emailAddress,
            }
        })

        console.log(`email address is: ${newUser.email}`);

    } catch (error) {
        console.log((error as Error).message);
    }

}