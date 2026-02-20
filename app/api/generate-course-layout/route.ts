import { db } from "@/config/db";
import { client } from "@/config/openai";
import { coursesTable } from "@/config/schema";
import { Course_config_prompt } from "@/data/Prompt";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userInput, courseId, type } = await req.json()
    const user = await currentUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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
    const JSONResult = JSON.parse(rawResult)

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
