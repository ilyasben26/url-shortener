'use server';

import { notFound } from "next/navigation";
import { db } from "./db";
import { urlAccessLogs, urls } from "./db/schema";
import { eq, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

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

interface LogAccessHeaders {
    userAgent: string;
    ipAddress: string;
    referer: string;
}

export async function logAccess(code: string, headers: LogAccessHeaders) {
    try {
        // Find the corresponding URL
        const url = await db.select().from(urls).where(eq(urls.shortCode, code)).limit(1);

        if (!url || url.length === 0) {
            console.error('Short URL not found');
            return;
        }

        // Increment the visits count by 1
        await db.update(urls)
            .set({
                visits: sql`${urls.visits} + 1`,
            })
            .where(eq(urls.shortCode, code));

        // Extract visitor info
        const userAgent = headers.userAgent;
        const ipAddress = headers.ipAddress;
        const referer = headers.referer;

        // You might also need to use an IP-to-location service for country, city, and region
        const country = 'Unknown';  // Replace with actual geolocation logic
        const city = 'Unknown';  // Replace with actual geolocation logic
        const region = 'Unknown';  // Replace with actual geolocation logic

        // Insert access log into url_access_logs
        await db.insert(urlAccessLogs).values({
            urlId: url[0]!.id,
            userAgent: userAgent,
            ipAddress: ipAddress,
            referrer: referer,
            country: country,
            city: city,
            region: region,
        });

    } catch (error) {
        console.error('Error logging access:', error);
        // Handle the error, possibly notify
    }
}
