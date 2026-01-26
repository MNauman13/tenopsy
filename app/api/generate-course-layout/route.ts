import { db } from "@/config/db";
import { client } from "@/config/openai";
import { coursesTable } from "@/config/schema";
import { Course_config_prompt } from "@/data/Prompt";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userInput, courseId, type } = await req.json()

    if (!userInput || !courseId || !type) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const user = await currentUser()
    const email = user?.primaryEmailAddress?.emailAddress

    if (!email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await client.chat.completions.create({
        model: 'gpt-5-mini',
        messages: [
            { role: 'system', content: Course_config_prompt },
            { role: 'user', content: "Course Topic is: " + userInput }
        ]
    })

    const rawResult = response.choices[0].message?.content || ''
    let JSONResult
    try {
        JSONResult = JSON.parse(rawResult)
    } catch {
        return NextResponse.json({ error: "Model returned invalid JSON" }, { status: 502 })
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
