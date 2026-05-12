import React, { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@/type/CourseType";
import { Player } from "@remotion/player";
import { Dot, Loader2 } from "lucide-react";
import { CourseComposition } from "./ChapterVideo";

type Props = {
    course: Course | undefined;
    durationsBySlideId: Record<string, number> | null;
    isAuthenticated: boolean;
};

function CourseChapters({ course, durationsBySlideId, isAuthenticated }: Props) {
    const slides = course?.chapterContentSlides ?? [];

    const getChapterDurationInFrames = useCallback(
        (chapterId: string) => {
            const safeFallback = 30;
            if (!course) return safeFallback;

            const chapterSlides = slides.filter((s) => s.chapterId === chapterId);
            if (chapterSlides.length === 0) return safeFallback;

            const total = chapterSlides.reduce((sum, s) => {
                const d = durationsBySlideId?.[s.slideId];
                const safe = Number.isFinite(d as number) && (d as number) > 0 ? (d as number) : safeFallback;
                return sum + safe;
            }, 0);

            const GAP_FRAMES = 30;
            const gaps = Math.max(0, chapterSlides.length - 1) * GAP_FRAMES;
            return Math.max(1, Math.floor(total + gaps));
        },
        [course, slides, durationsBySlideId]
    );

    return (
        <div className="max-w-6xl -mt-5 p-10 border rounded-3xl shadow w-full bg-background/80 backdrop-blur">
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-2xl">Course Chapters</h2>
                <h2 className="text-sm text-muted-foreground">
                    {slides.length > 0 ? "Chapters and Short Preview" : "Chapter Overview"}
                </h2>
            </div>

            <div className="mt-6 space-y-6">
                {course?.courseLayout?.chapters.map((chapter, index) => {
                    const chapterSlides = slides.filter((s) => s.chapterId === chapter.chapterId);
                    const durationInFrames = getChapterDurationInFrames(chapter.chapterId);

                    return (
                        <Card key={chapter.chapterId ?? index}>
                            <CardHeader>
                                <div className="flex gap-3 items-center">
                                    <div className="p-2 bg-primary/40 h-10 w-10 rounded-2xl flex items-center justify-center font-semibold">
                                        {index + 1}
                                    </div>
                                    <CardTitle className="md:text-xl text-base">{chapter.chapterTitle}</CardTitle>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-start">
                                    {/* Topics list */}
                                    <div className="space-y-3">
                                        {chapter.subContent.map((content, i) => (
                                            <div key={i} className="flex gap-2 items-start">
                                                <Dot className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                                <p className="text-sm md:text-base">{content}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Chapter video or placeholder */}
                                    <div className="sticky top-24">
                                        <div className="rounded-xl overflow-hidden border bg-black">
                                            {chapterSlides.length > 0 ? (
                                                <Player
                                                    component={CourseComposition}
                                                    inputProps={{
                                                        // @ts-ignore
                                                        slides: chapterSlides,
                                                        durationsBySlideId: durationsBySlideId ?? {},
                                                    }}
                                                    durationInFrames={durationInFrames}
                                                    compositionWidth={1280}
                                                    compositionHeight={720}
                                                    fps={30}
                                                    controls
                                                    style={{ width: "100%", aspectRatio: "16 / 9" }}
                                                />
                                            ) : (
                                                <div className="aspect-video flex flex-col items-center justify-center gap-3 px-6 text-center">
                                                    {isAuthenticated ? (
                                                        <>
                                                            <Loader2 className="h-7 w-7 text-white/40 animate-spin" />
                                                            <p className="text-white/50 text-xs">Generating chapter video…</p>
                                                        </>
                                                    ) : (
                                                        <p className="text-white/40 text-xs leading-relaxed">
                                                            Sign in to generate a full<br />video for this chapter
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <p className="mt-2 text-xs text-muted-foreground text-center">
                                            {chapterSlides.length > 0 ? "Short chapter preview" : "Chapter preview"}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

export default CourseChapters;
