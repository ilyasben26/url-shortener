import { type NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { urls } from "~/server/db/schema";
import { nanoid } from "nanoid";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

const urlSchema = z.object({
    url: z.string()
        .min(1, { message: "URL is required." })
        .url({ message: "invalid URL." })
});

export async function POST(request: NextRequest) {
    try {
        const { userId }: { userId: string | null } = auth()

        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const requestBody = await request.json();
        const parsedBody = urlSchema.parse(requestBody); // Validate the request body

        const { url } = parsedBody;

        const shortCode = nanoid(8);

        await db.insert(urls).values({
            originalUrl: url,
            shortCode: shortCode,
            userId: userId,
            updatedAt: null,
        });

        return NextResponse.json({ shortCode });
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Extract the first error message
            const message = error.issues[0]?.message;
            return NextResponse.json({ message }, { status: 400 });
        }
        // Log the error to Sentry
        // Sentry.captureException(error);

        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
