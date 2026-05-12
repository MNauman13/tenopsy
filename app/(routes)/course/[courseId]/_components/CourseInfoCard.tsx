"use client"
import { Course } from '@/type/CourseType'
import { BookOpen, ChartNoAxesColumnIncreasing, Loader2, Play, Sparkles } from 'lucide-react'
import React, { useMemo } from 'react'
import { Player } from '@remotion/player'
import { CourseComposition } from './ChapterVideo'
import { SignInButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

type Props = {
    course: Course | undefined
    durationsBySlideId: Record<string, number> | null
    isAuthenticated: boolean
}

function CourseInfoCard({ course, durationsBySlideId, isAuthenticated }: Props) {
    const fps = 30
    const slides = course?.chapterContentSlides ?? []
    const hasSlides = slides.length > 0

    const durationInFrames = useMemo(() => {
        if (!durationsBySlideId || !hasSlides) return 0
        const total = slides.reduce((sum, slide) => sum + (durationsBySlideId[slide.slideId] ?? fps * 6), 0)
        const gaps = Math.max(0, slides.length - 1) * Math.round(1 * fps)
        return total + gaps
    }, [durationsBySlideId, slides, fps, hasSlides])

    if (!course) {
        return (
            <div className='w-full p-20 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-800 to-emerald-950 flex items-center justify-center'>
                <Loader2 className='h-8 w-8 text-white animate-spin' />
            </div>
        )
    }

    return (
        <div className='w-full'>
            <div className='p-10 md:p-16 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8
                bg-gradient-to-br from-slate-950 via-slate-800 to-emerald-950'>

                {/* Course info */}
                <div className='flex flex-col justify-center'>
                    <h2 className='flex gap-2 p-1 px-2 border rounded-2xl inline-flex text-white border-gray-200/70 w-fit'>
                        <Sparkles className='h-4 w-4' /> Course Preview
                    </h2>
                    <h2 className='text-3xl md:text-4xl font-bold mt-4 text-white leading-tight'>
                        {course.courseName}
                    </h2>
                    <p className='text-base text-slate-300 mt-3'>
                        {course.courseLayout?.courseDescription}
                    </p>
                    <div className='mt-5 flex gap-3 flex-wrap text-white'>
                        <span className='px-3 py-1.5 border rounded-full flex gap-2 items-center text-sm'>
                            <ChartNoAxesColumnIncreasing className='h-4 w-4 text-sky-400' />
                            {course.courseLayout?.level}
                        </span>
                        <span className='px-3 py-1.5 border rounded-full flex gap-2 items-center text-sm'>
                            <BookOpen className='h-4 w-4 text-green-400' />
                            {course.courseLayout?.totalChapters} Chapters
                        </span>
                    </div>
                </div>

                {/* Video panel */}
                <div className='border-2 border-white/10 rounded-xl overflow-hidden bg-black'>
                    {hasSlides && durationsBySlideId && durationInFrames > 0 ? (
                        <Player
                            component={CourseComposition}
                            inputProps={{
                                // @ts-ignore
                                slides,
                                durationsBySlideId,
                            }}
                            durationInFrames={durationInFrames}
                            compositionWidth={1280}
                            compositionHeight={720}
                            fps={fps}
                            controls
                            style={{ width: '100%', aspectRatio: '16/9' }}
                        />
                    ) : (
                        <div className='aspect-video flex flex-col items-center justify-center gap-4 px-8 text-center'>
                            {isAuthenticated ? (
                                <>
                                    <Loader2 className='h-10 w-10 text-white/40 animate-spin' />
                                    <p className='text-white/60 text-sm'>Generating your video course…</p>
                                </>
                            ) : (
                                <>
                                    <div className='h-16 w-16 rounded-full bg-white/10 flex items-center justify-center'>
                                        <Play className='h-7 w-7 text-white/60 ml-1' />
                                    </div>
                                    <div>
                                        <p className='text-white font-semibold'>See this come to life</p>
                                        <p className='text-white/50 text-sm mt-1'>
                                            Sign in and create your own AI video course in minutes
                                        </p>
                                    </div>
                                    <SignInButton mode='modal'>
                                        <Button size='sm' className='mt-1 rounded-full px-6'>
                                            Get Started Free
                                        </Button>
                                    </SignInButton>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CourseInfoCard
