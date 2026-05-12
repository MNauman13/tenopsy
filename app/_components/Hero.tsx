"use client"
import React, { useState } from 'react'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { Loader2, Send, Sparkles } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { QUICK_VIDEO_SUGGESTIONS } from '@/data/constant'
import axios from 'axios'
import { toast } from 'sonner'
import { SignInButton, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

function Hero() {
    const [userInput, setUserInput] = useState('')
    const [type, setType] = useState('full-course')
    const [loading, setLoading] = useState(false)
    const { user } = useUser()
    const router = useRouter()

    const GenerateCourseLayout = async () => {
        if (!userInput.trim()) {
            toast.error('Please enter a course topic first.')
            return
        }
        const toastId = toast.loading('Generating your course layout...')
        const courseId = crypto.randomUUID()
        try {
            setLoading(true)
            const result = await axios.post('/api/generate-course-layout', {
                userInput,
                type,
                courseId,
            })

            if (result?.data?.msg === 'max limit reached') {
                toast.error('Free plan limit reached — upgrade to keep creating!', { id: toastId })
                setLoading(false)
                return
            }

            toast.success('Course layout generated!', { id: toastId })
            router.push('/course/' + courseId)
        } catch {
            setLoading(false)
            toast.error('Something went wrong. Please try again.', { id: toastId })
        }
    }

    return (
        <div className='flex flex-col items-center mt-20 mb-16 px-4'>
            {/* Badge */}
            <div className='flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border bg-primary/5 text-primary text-sm font-medium'>
                <Sparkles className='h-3.5 w-3.5' />
                AI-powered course generation
            </div>

            {/* Headline */}
            <h1 className='text-5xl md:text-6xl font-bold text-center leading-tight max-w-3xl'>
                Learn Smarter with{' '}
                <span className='bg-gradient-to-r from-primary to-sky-400 bg-clip-text text-transparent'>
                    AI Video Courses
                </span>
            </h1>
            <p className='mt-4 text-center text-muted-foreground text-lg max-w-xl'>
                Turn any topic into a full video course in minutes — slides, narration, and captions included.
            </p>

            {/* Input card */}
            <div className='w-full max-w-xl mt-8 z-10 shadow-xl shadow-primary/10 rounded-xl border-2 border-primary/20 bg-white'>
                <InputGroup>
                    <InputGroupTextarea
                        data-slot='input-group-control'
                        className='flex field-sizing-content min-h-24 w-full resize-none rounded-xl px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm'
                        placeholder='e.g. "Python for beginners — data types, loops, and functions"'
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                    />
                    <InputGroupAddon align='block-end'>
                        <Select defaultValue='full-course' onValueChange={(val) => setType(val)}>
                            <SelectTrigger className='w-[180px]'>
                                <SelectValue placeholder='Select Type' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='full-course'>Full Course</SelectItem>
                                <SelectItem value='quick-explain-video'>Quick Explain</SelectItem>
                            </SelectContent>
                        </Select>
                        {user ? (
                            <InputGroupButton
                                className='ml-auto'
                                size='icon-sm'
                                variant='default'
                                onClick={GenerateCourseLayout}
                                disabled={loading}
                            >
                                {loading ? <Loader2 className='animate-spin' /> : <Send />}
                            </InputGroupButton>
                        ) : (
                            <SignInButton mode='modal'>
                                <InputGroupButton className='ml-auto' size='icon-sm' variant='default'>
                                    <Send />
                                </InputGroupButton>
                            </SignInButton>
                        )}
                    </InputGroupAddon>
                </InputGroup>
            </div>

            {/* Quick suggestions */}
            <div className='flex items-center gap-3 mt-5 max-w-2xl flex-wrap justify-center z-10'>
                <span className='text-xs text-muted-foreground'>Try:</span>
                {QUICK_VIDEO_SUGGESTIONS.map((suggestion) => (
                    <button
                        key={suggestion.id}
                        onClick={() => setUserInput(suggestion.prompt)}
                        className='border rounded-full cursor-pointer px-3 py-1 text-xs bg-white/80 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors'
                    >
                        {suggestion.title}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Hero
