import { db } from "@/config/db";
import { client } from "@/config/openai";
import { coursesTable } from "@/config/schema";
import { Course_config_prompt } from "@/data/Prompt";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getClientIp, rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// 5 course generations per 10 minutes per user
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(req: Request) {
    const { userInput, courseId, type } = await req.json()
    const user = await currentUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rateLimitKey = `generate-layout:${user.primaryEmailAddress?.emailAddress ?? getClientIp(req)}`;
    const rl = rateLimit(rateLimitKey, LIMIT, WINDOW_MS);
    if (!rl.success) {
        return NextResponse.json(
            { error: "Too many requests. Please wait before generating another course." },
            { status: 429, headers: rateLimitHeaders(rl, LIMIT) }
        );
    }

    // Extract and validate the email address
    const email = user.primaryEmailAddress?.emailAddress
    if (!email) {
        return NextResponse.json({ error: "User email address is missing" }, { status: 400 })
    }

    const {has} = await auth()

    const isPaidUser = has({ plan: 'monthly' })

    if (!isPaidUser) {
        const userCourses = await db.select().from(coursesTable)
            .where(eq(coursesTable.userId, user?.primaryEmailAddress?.emailAddress as string));

        if (userCourses?.length >= 2) {
            return NextResponse.json({ msg: 'max limit reached' });
        }
    }

    const response = await client.chat.completions.create({
        model: 'gpt-5-mini',
        messages: [
            { role: 'system', content: Course_config_prompt },
            { role: 'user', content: "Course Topic is" + userInput }
        ]
    })

    const rawResult = response.choices[0].message?.content || ''
    let JSONResult
    try {
        JSONResult = JSON.parse(rawResult)
    } catch {
        return NextResponse.json({ error: "AI returned invalid JSON. Please try again." }, { status: 500 })
    }

    // Save to DB
    const courseResult = await db.insert(coursesTable).values({
        courseId: courseId,
        courseName: JSONResult.courseName,
        userInput: userInput,
        type: type,
        courseLayout: JSONResult,
        userId: email
    }).returning()

    return NextResponse.json(courseResult[0])
}
