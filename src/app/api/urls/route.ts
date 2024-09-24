import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { urls } from "~/server/db/schema";

// TODO: figure out error handling properly

export async function GET() {
    try {
        const fetchedUrls = await db
            .select()
            .from(urls)
            .orderBy(desc(urls.createdAt))
            .limit(5);
        return NextResponse.json(fetchedUrls);

    } catch (error) {
        console.error('Error fetching URLs', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}