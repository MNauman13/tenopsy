"use client"
import { Course } from '@/type/CourseType'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import CourseListCard from './CourseListCard'
import { useUser } from '@clerk/nextjs'
import { BookOpen } from 'lucide-react'

function CourseList() {
    const [courseList, setCourseList] = useState<Course[]>([])
    const { user, isLoaded } = useUser()

    useEffect(() => {
        if (!isLoaded || !user) return
        GetCourseList()
    }, [user, isLoaded])

    const GetCourseList = async () => {
        try {
            const result = await axios.get('/api/course')
            setCourseList(result.data)
        } catch (error) {
            console.error('Failed to fetch course list:', error)
        }
    }

    // Guests see the LandingFeatures section rendered by page.tsx instead
    if (!isLoaded || !user) return null

    return (
        <section className='max-w-6xl mx-auto mt-16 w-full px-4'>
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h2 className='font-bold text-2xl'>My Courses</h2>
                    <p className='text-sm text-muted-foreground mt-0.5'>Pick up where you left off</p>
                </div>
                {courseList.length > 0 && (
                    <span className='text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full'>
                        {courseList.length} {courseList.length === 1 ? 'course' : 'courses'}
                    </span>
                )}
            </div>

            {courseList.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'>
                    {courseList.map((course) => (
                        <CourseListCard courseItem={course} key={course.courseId} />
                    ))}
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-2xl bg-muted/30'>
                    <BookOpen className='h-12 w-12 text-muted-foreground mb-4' />
                    <h3 className='font-semibold text-lg'>No courses yet</h3>
                    <p className='text-sm text-muted-foreground mt-1'>
                        Create your first course using the form above.
                    </p>
                </div>
            )}
        </section>
    )
}

export default CourseList
