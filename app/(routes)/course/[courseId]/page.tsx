"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import CourseInfoCard from './_components/CourseInfoCard'
import { useParams } from 'next/navigation'
import { Course } from '@/type/CourseType'
import CourseChapters from './_components/CourseChapters'

const CoursePreview = () => {
  const { courseId } = useParams()
  const [courseDetail, setCourseDetail] = useState<Course>()

  useEffect(() => {
    courseId && GetCourseDetail()
  }, [courseId])
  
  const GetCourseDetail = async () => {
    const result = await axios.get('/api/course?courseId=' + courseId)
    console.log(result.data)
    setCourseDetail(result.data)
  }
  
  return (
    <div className='flex flex-col items-center '>
      <CourseInfoCard course={courseDetail} />
      <CourseChapters course={courseDetail}/>
    </div>
  )
}

export default CoursePreview