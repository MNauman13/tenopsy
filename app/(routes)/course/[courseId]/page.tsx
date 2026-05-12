"use client"
import React, { useEffect, useMemo, useState } from 'react'
import CourseInfoCard from './_components/CourseInfoCard'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { Course } from '@/type/CourseType'
import CourseChapters from './_components/CourseChapters'
import { toast } from 'sonner'
import { getAudioData } from '@remotion/media-utils'
import { useUser } from '@clerk/nextjs'

function CoursePreview() {

    const { courseId } = useParams();
    const { user, isLoaded } = useUser();
    const [courseDetail, setCourseDetail] = useState<Course>();

    // Wait for Clerk to finish loading before fetching — otherwise `user` is null
    // even for logged-in users, and the generation check silently skips.
    useEffect(() => {
        if (courseId && isLoaded) {
            GetCourseDetail();
        }
    }, [courseId, isLoaded])

    const GetCourseDetail = async () => {
        const loadingToast = toast.loading('Fetching Course Details...');
        try {
            const result = await axios.get('/api/course?courseId=' + courseId);
            console.log(result.data);
            setCourseDetail(result.data);
            toast.success('Course Details Fetched Successfully!', { id: loadingToast });
            // Only attempt generation for authenticated users who own the course
            if (result?.data?.chapterContentSlides?.length === 0 && user) {
                try {
                    await GenerateVideoContent(result?.data)
                    // Re-fetch to pick up the newly generated slides
                    const updated = await axios.get('/api/course?courseId=' + courseId);
                    setCourseDetail(updated.data);
                } catch (genErr) {
                    console.error(genErr)
                    toast.error("Failed to generate video content. Please try again.")
                }
            }
        } catch (err) {
            console.error(err)
            toast.error("Failed to fetch course details", { id: loadingToast })
        }
    }

    const GenerateVideoContent = async (course: Course) => {
        for (let i = 0; i < course?.courseLayout?.chapters?.length; i++) {

            //if (i > 0) break; // For Testing, Remove this line to process all chapters
            const toastLoading = toast.loading('Generating Video Content for Chapter ' + (i + 1));
            console.log(course?.courseLayout?.chapters[i]);
            const result = await axios.post('/api/generate-video-content', {
                chapter: course?.courseLayout?.chapters[i],
                courseId: course?.courseId
            });

            toast.success('Video Content Generated for Chapter ' + (i + 1), { id: toastLoading });
        }
    }

    const fps = 30;
    const slides = useMemo(
        () => courseDetail?.chapterContentSlides ?? [],
        [courseDetail?.chapterContentSlides]
    )
    const [durationsBySlideId, setDurationsBySlideId] = useState<Record<string, number> | null>(null);


    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            if (!slides) return;
            const entries = await Promise.all(
                slides.map(async (slide) => {
                    const audioData = await getAudioData(slide?.audioFileUrl);
                    const audioSec = audioData?.durationInSeconds;
                    const frames = Math.max(1, Math.ceil(audioSec * fps));
                    return [slide.slideId, frames] as const;
                })
            );
            if (!cancelled) {
                setDurationsBySlideId(Object.fromEntries(entries))
            }
        }
        run();

        return () => {
            cancelled = true;
        }

    }, [slides, fps])



    return (
        <div className='flex flex-col items-center'>
            <CourseInfoCard course={courseDetail} durationsBySlideId={durationsBySlideId} isAuthenticated={!!user} />
            <CourseChapters course={courseDetail} durationsBySlideId={durationsBySlideId} isAuthenticated={!!user} />
        </div>
    )
}

export default CoursePreview