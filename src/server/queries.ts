import { notFound } from "next/navigation";
import { db } from "./db";
import { urls } from "./db/schema";
import { eq, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

// TODO: implement error handling

export async function getMyUrls() {
    try {
        const user = auth();
        if (!user.userId) throw new Error("Unauthorized");
        const myurls = await db.select()
            .from(urls)
            .where(eq(urls.userId, user.userId));
        return myurls;

    } catch (error) {
        console.error('Error fetching URLs:', error);
        // Log error to monitoring service (like Sentry) if needed
        // Sentry.captureException(error);

        throw new Error('Failed to fetch URLs. Please try again later.');
    }
}

export async function getURLfromCode(code: string) {
    try {

        const urlRecord = await db.select()
            .from(urls)
            .where(eq(urls.shortCode, code))
            .limit(1);

        if (urlRecord.length === 0) {
            return null;
        }

        return urlRecord[0]?.originalUrl;
    } catch (error) {
        console.error('Error fetching URL by code:', error);
        // show a 404 Not found
        notFound();
    }
}

export async function logAccess(code: string) {
    try {
        // Increment the visits count by 1
        await db.update(urls)
            .set({
                visits: sql`${urls.visits} + 1`,
            })
            .where(eq(urls.shortCode, code));

        // TODO: Grab visitor info like IP, device type, and other metrics and put them in log table
    } catch (error) {
        console.error('Error logging access:', error);
        // silent error
    }
}