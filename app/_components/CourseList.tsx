"use client"
import { Course } from '@/type/CourseType'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import CourseListCard from './CourseListCard'
import { HeroPageCourse } from '@/data/Dummy'
import { useUser } from '@clerk/nextjs'

function CourseList() {

    const [courseList, setCourseList] = useState<Course[]>([])
    const { user } = useUser();
    useEffect(() => {
        if (!user) {
            //@ts-ignore
            setCourseList(HeroPageCourse);
        } else {
            GetCourseList();
        }
    }, [user])

    const GetCourseList = async () => {
        const result = await axios.get('/api/course');
        console.log("---", result.data)
        setCourseList(result.data);
    }

    return (
        <div className='max-w-6xl mt-10 w-full ml-14'>
            <h2 className='font-bold text-2xl'>My Courses</h2>

            <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5 mt-4'>
                {courseList && courseList?.map((course, index) => (
                    <CourseListCard courseItem={course} key={index} />
                ))}
            </div>
        </div>
    )
}

export default CourseList