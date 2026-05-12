import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { getClientIp, rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// 10 user-sync calls per minute per IP
const LIMIT = 10;
const WINDOW_MS = 60 * 1000;

export async function POST(req: NextRequest) {
    const ip = getClientIp(req);
    const rl = rateLimit(`user-sync:${ip}`, LIMIT, WINDOW_MS);
    if (!rl.success) {
        return NextResponse.json(
            { error: "Too many requests." },
            { status: 429, headers: rateLimitHeaders(rl, LIMIT) }
        );
    }

    const user = await currentUser();

    // If user already exists in DB:
    const users = await db.select().from(usersTable)
    .where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress as string))

    // If not then create a new user in DB
    if (users?.length == 0) {
        const newUser = await db.insert(usersTable).values({
            email: user?.primaryEmailAddress?.emailAddress as string,
            name: user?.fullName as string
        }).returning();

        return NextResponse.json(newUser[0])
    }

    return NextResponse.json(users[0])
}