import React, { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@/type/CourseType";
import { Player } from "@remotion/player";
import { Dot } from "lucide-react";
import { CourseComposition } from "./ChapterVideo";

type Props = {
    course: Course | undefined;
    durationsBySlideId: Record<string, number> | null;
};

function CourseChapters({ course, durationsBySlideId }: Props) {
    const slides = course?.chapterContentSlides ?? [];

    const getChapterDurationInFrames = useCallback(
        (chapterId: string) => {
            // ✅ Always return a non-zero positive integer
            const safeFallback = 30; // frames (1s at 30fps) – change to 30*30 if you want 30 seconds

            if (!course) return safeFallback;

            const chapterSlides = slides.filter((s) => s.chapterId === chapterId);

            // If there are no slides yet, still return non-zero
            if (chapterSlides.length === 0) return safeFallback;

            const total = chapterSlides.reduce((sum, s) => {
                const d = durationsBySlideId?.[s.slideId];
                // guard against undefined / 0 / NaN / negative
                const safe = Number.isFinite(d as number) && (d as number) > 0 ? (d as number) : safeFallback;
                return sum + safe;
            }, 0);

            return Math.max(1, Math.floor(total)); // ✅ Remotion expects >= 1
        },
        [course, slides, durationsBySlideId]
    );

    return (
        <div className="max-w-6xl -mt-5 p-10 border rounded-3xl shadow w-full bg-background/80 backdrop-blur">
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-2xl">Course preview</h2>
                <h2 className="text-sm text-muted-foreground">Chapters and Short Preview</h2>
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
                                    <div className="space-y-3">
                                        {chapter.subContent.map((content, i) => (
                                            <div key={i} className="flex gap-2 items-start">
                                                <Dot className="h-5 w-5 text-primary mt-0.5" />
                                                <p className="text-sm md:text-base">{content}</p>
                                            </div>
                                        ))}
                                    </div>

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
                                                    durationInFrames={durationInFrames} // ✅ always >= 1
                                                    compositionWidth={1280}
                                                    compositionHeight={720}
                                                    fps={30}
                                                    controls
                                                    style={{ width: "100%", aspectRatio: "16 / 9" }}
                                                />
                                            ) : (
                                                <div className="aspect-video flex items-center justify-center text-sm text-muted-foreground">
                                                    No slides generated for this chapter yet
                                                </div>
                                            )}
                                        </div>

                                        <p className="mt-2 text-xs text-muted-foreground text-center">Short chapter preview</p>
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
