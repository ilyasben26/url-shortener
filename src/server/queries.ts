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


export async function getGeolocation(ipAddress: string) {
    try {
        const token = process.env.IP_INFO_TOKEN;
        if (!token) {
            throw new Error('IPInfo API token is missing. Set it in your environment variables.');
        }

        const response = await fetch(`https://ipinfo.io/${ipAddress}?token=${token}`);

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data = await response.json();

        return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            country: data.country || 'Unknown',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            city: data.city || 'Unknown',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            region: data.region || 'Unknown'
        };
    } catch (error) {
        console.error('Error fetching geolocation data:', error);
        return {
            country: 'Unknown',
            city: 'Unknown',
            region: 'Unknown'
        };
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

        const existingLog = await db.select()
            .from(urlAccessLogs)
            .where(eq(urlAccessLogs.ipAddress, ipAddress))
            .limit(1);

        let country = null;
        let city = null;
        let region = null;

        if (existingLog.length > 0) {
            // TODO: If yes, use the country, city, and region from there
            country = existingLog[0]!.country;
            city = existingLog[0]!.city;
            region = existingLog[0]!.region;
        } else {
            const geoInfo = await getGeolocation(ipAddress);
            if (geoInfo) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                country = geoInfo.country;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                city = geoInfo.city;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                region = geoInfo.region;
            }
        }


        // Insert access log into url_access_logs
        await db.insert(urlAccessLogs).values({
            urlId: url[0]!.id,
            userAgent: userAgent,
            ipAddress: ipAddress,
            referrer: referer,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            country: country,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            city: city,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            region: region,
        });

    } catch (error) {
        console.error('Error logging access:', error);
        // Handle the error, possibly notify
    }
}

// TODO: create an analytics object
/*
    KPIs:
    - Total visits (froms urls table)
    - Total unique visits (count from url_access_logs via unique IPs)
    
    Graphs:
    - Country map with counts for each country
    - Country count into pie chart
    - Devices pie chart

    {  
        "original_url":
        "KPI": {
            "total_visits":
            "total_unique_visits":
        }
        "country_visits": {
            "DE": 
            "FR":
            ...
        }
        "device_visits": {
            "Mac": 
            "IOS":
            ...
        }

    }
*/

// 
export async function getAnalytics(code: string) {
    try {
        // check if the code exists
        const urlRecord = await db.select()
            .from(urls)
            .where(eq(urls.shortCode, code))
            .limit(1);

        if (urlRecord.length === 0) {
            notFound();
        }

        // check if it belongs to the user
        const user = auth();
        if (!user.userId) throw new Error("Unauthorized");
        if (urlRecord[0]?.userId != user.userId) notFound();

        // fetch the total vists
        const total_visits = urlRecord[0].visits;
        const unique_visits = await db
            .select({ uniqueIPs: sql`COUNT(DISTINCT ip_address)` })
            .from(urlAccessLogs)
            .where(eq(urlAccessLogs.urlId, urlRecord[0].id));
        const total_unique_visits = unique_visits[0]?.uniqueIPs || 0;

        // fetch country visits
        const country_visits = await db
            .select({ country: urlAccessLogs.country, count: sql`COUNT(*)` })
            .from(urlAccessLogs)
            .where(eq(urlAccessLogs.urlId, urlRecord[0].id))
            .groupBy(urlAccessLogs.country);

        const countryVisitMap: Record<string, number> = {};
        country_visits.forEach((row: { country: string | null, count: unknown }) => {
            const country = row.country ?? "Unknown";
            const count = typeof row.count === "number" ? row.count : 0;
            countryVisitMap[country] = count;
        });

        const device_visits = await db
            .select({ userAgent: urlAccessLogs.userAgent })
            .from(urlAccessLogs)
            .where(eq(urlAccessLogs.urlId, urlRecord[0].id));


        const deviceVisitMap: Record<string, number> = {};
        device_visits.forEach((row: { userAgent: string | null }) => {
            const userAgent = row.userAgent ?? "Unknown";
            deviceVisitMap[userAgent] = (deviceVisitMap[userAgent] ?? 0) + 1;
        });

        const analytics = {
            original_url: urlRecord[0].originalUrl,
            KPI: {
                total_visits,
                total_unique_visits
            },
            country_visits: countryVisitMap,
            device_visits: deviceVisitMap
        };


        return analytics;
    } catch (error) {
        console.error('Error fetching code', error);
        // show a 404 Not found
        notFound();
    }

}