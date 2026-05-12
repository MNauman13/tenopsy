import { db } from "@/config/db";
import { chapterContentSlides, coursesTable } from "@/config/schema";
import { HeroPageCourse } from "@/data/Dummy";
import { currentUser } from "@clerk/nextjs/server";
import { getClientIp, rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Define the courses that anyone can access without logging in
const PUBLIC_COURSE_IDS = [
    '69975e2a-fc91-4d3d-afa5-43e595655c33',
    '7ce88fbf-ab85-4ca3-b01b-314d8e79b90d',
    '56e56b13-ee31-4d51-99c2-84d48185e47c'
];

// 60 reads per minute per IP
const LIMIT = 60;
const WINDOW_MS = 60 * 1000;

export async function GET(req: NextRequest) {
    const ip = getClientIp(req);
    const rl = rateLimit(`course-read:${ip}`, LIMIT, WINDOW_MS);
    if (!rl.success) {
        return NextResponse.json(
            { error: "Too many requests. Slow down." },
            { status: 429, headers: rateLimitHeaders(rl, LIMIT) }
        );
    }

    const courseId = req.nextUrl.searchParams.get('courseId');
    const user = await currentUser();

    // 1. Handle Logged-Out Users
    if (!user) {
        if (courseId) {
            // If they are asking for a specific course, check if it's public
            if (PUBLIC_COURSE_IDS.includes(courseId)) {
                // It's public! Do not return 401. Let the code continue below to fetch the DB.
                console.log(`Allowing public access to course: ${courseId}`);
            } else {
                // It's a private course, block them.
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        } else {
            // No courseId and no user, return dummy data
            return NextResponse.json(HeroPageCourse);
        }
    }

    // 2. Handle Fetching All User Courses (Dashboard View)
    if (!courseId) {
        const email = user?.primaryEmailAddress?.emailAddress;
        
        if (!email) {
            return NextResponse.json({ error: "User email missing" }, { status: 400 });
        }

        const userCourses = await db.select().from(coursesTable)
            .where(eq(coursesTable.userId, email))
            .orderBy(desc(coursesTable.id));

        return NextResponse.json(userCourses);
    }

    // 3. Fetch the Specific Course Data (For both logged-in users AND public viewers)
    const courses = await db.select().from(coursesTable)
        .where(eq(coursesTable.courseId, courseId));

    if (!courses.length) {
        // For public demo courses not yet in this DB (e.g. fresh deployment),
        // fall back to the in-memory dummy data so the page always renders.
        if (PUBLIC_COURSE_IDS.includes(courseId!)) {
            const demoCourse = HeroPageCourse.find(c => c.courseId === courseId);
            if (demoCourse) {
                return NextResponse.json({ ...demoCourse, chapterContentSlides: [] });
            }
        }
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const chapterContentSlide = await db.select().from(chapterContentSlides)
        .where(eq(chapterContentSlides.courseId, courseId));

    return NextResponse.json({
        ...courses[0],
        chapterContentSlides: chapterContentSlide
    });
}