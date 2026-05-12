"use client"
import Hero from "./_components/Hero";
import CourseList from "./_components/CourseList";
import LandingFeatures from "./_components/LandingFeatures";
import { useUser } from "@clerk/nextjs";

export default function Home() {
    const { user, isLoaded } = useUser();
    const isGuest = isLoaded && !user;

    return (
        <div className="relative overflow-hidden">
            <Hero />
            {isGuest ? <LandingFeatures /> : <CourseList />}

            {/* Background blobs */}
            <div className="pointer-events-none fixed -bottom-40 -left-40 h-[500px] w-[500px] bg-purple-400/20 blur-[120px] rounded-full" />
            <div className="pointer-events-none fixed top-20 left-1/3 h-[500px] w-[500px] bg-pink-400/20 blur-[120px] rounded-full" />
            <div className="pointer-events-none fixed bottom-[-200px] left-1/3 h-[500px] w-[500px] bg-blue-400/20 blur-[120px] rounded-full" />
            <div className="pointer-events-none fixed top-[200px] left-1/2 h-[500px] w-[500px] bg-sky-400/20 blur-[120px] rounded-full" />
        </div>
    );
}
