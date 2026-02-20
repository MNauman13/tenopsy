import { db } from "@/config/db";
import { chapterContentSlides, coursesTable } from "@/config/schema";
import { HeroPageCourse } from "@/data/Dummy";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const courseId = await req.nextUrl.searchParams.get('courseId');
    const user = await currentUser();

    if (!user) {
        if (courseId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        return NextResponse.json(HeroPageCourse)
    }

    if (!courseId) {
        const userCourses = await db.select().from(coursesTable)
            .where(eq(coursesTable.userId, user?.primaryEmailAddress?.emailAddress as string))
            .orderBy(desc(coursesTable.id))

        return NextResponse.json(userCourses);
    }

    const courses = await db.select().from(coursesTable)
        .where(eq(coursesTable.courseId, courseId as string));

    if (!courses.length) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const chapterContentSlide = await db.select().from(chapterContentSlides)
        .where(eq(chapterContentSlides.courseId, courseId as string));


    return NextResponse.json({
        ...courses[0],
        chapterContentSlides: chapterContentSlide
    });
}