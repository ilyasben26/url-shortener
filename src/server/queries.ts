import { db } from "./db";
import { urls } from "./db/schema";
import { eq, sql } from "drizzle-orm";

// TODO: implement error handling

export async function getMyUrls() {
    //const user = auth();
    //if (!user.userId) throw new Error("Unauthorized");

    const myurls = await db.query.urls.findMany();

    return myurls;
}

export async function getURLfromCode(code: string) {

    // find the url where shortCode = shortCode

    const urlRecord = await db.select()
        .from(urls)
        .where(eq(urls.shortCode, code))
        .limit(1);

    if (urlRecord.length === 0) {
        return null;
    }

    return urlRecord[0]?.originalUrl;
}

export async function logAccess(code: string) {

    // increment the visits count by 1
    await db.update(urls)
        .set({
            visits: sql`${urls.visits} + 1`,
        })
        .where(eq(urls.shortCode, code));

    // TODO: Grab visitor info like IP, device type and other metrics and put them in log table

}
