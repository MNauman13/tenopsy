import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Course } from '@/type/CourseType'
import { BookOpen, Calendar, Play } from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'
import Image from 'next/image'

type Props = {
    courseItem: Course
}

function CourseListCard({ courseItem }: Props) {
    return (
        <Card className='bg-white z-10 overflow-hidden group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-0.5'>
            {/* Gradient accent bar */}
            <div className='h-1 w-full bg-gradient-to-r from-primary to-sky-400' />

            <CardHeader className='pb-3'>
                {courseItem?.bannerImage ? (
                    <Image
                        src={courseItem.bannerImage}
                        width={400}
                        height={225}
                        alt={courseItem.courseName}
                        className='rounded-lg aspect-video object-cover mb-3'
                    />
                ) : (
                    <div className='rounded-lg aspect-video bg-gradient-to-br from-primary/10 to-sky-400/10 mb-3 flex items-center justify-center'>
                        <BookOpen className='h-10 w-10 text-primary/40' />
                    </div>
                )}

                <div className='flex justify-between items-start gap-2'>
                    <h2 className='font-semibold text-sm leading-snug line-clamp-2'>
                        {courseItem?.courseName}
                    </h2>
                    {courseItem?.courseLayout?.level && (
                        <span className='shrink-0 text-primary text-xs bg-primary/10 px-2 py-0.5 border rounded-full border-primary/20'>
                            {courseItem.courseLayout.level}
                        </span>
                    )}
                </div>
            </CardHeader>

            <CardContent className='pt-0'>
                <div className='flex items-center gap-3 text-xs text-muted-foreground mb-4'>
                    <span className='flex items-center gap-1'>
                        <BookOpen className='h-3.5 w-3.5' />
                        {courseItem?.courseLayout?.totalChapters ?? 0} chapters
                    </span>
                    <span className='flex items-center gap-1'>
                        <Calendar className='h-3.5 w-3.5' />
                        {moment(courseItem?.createdAt).fromNow()}
                    </span>
                </div>

                <Link href={'/course/' + courseItem?.courseId}>
                    <Button size='sm' className='w-full rounded-lg transition-colors'>
                        <Play className='h-3.5 w-3.5 mr-1.5' />
                        Watch Now
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}

export default CourseListCard
