"use client"
import { BookOpen, Brain, Captions, ChevronRight, Mic2, Sparkles, Video, Zap } from 'lucide-react'
import { SignInButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

const steps = [
    {
        number: '01',
        title: 'Describe your topic',
        description: 'Type anything — a skill, concept, or subject. The more specific, the better the course.',
        icon: Brain,
    },
    {
        number: '02',
        title: 'AI builds the course',
        description: 'Claude structures chapters, writes slide content, records narration, and generates captions — all automatically.',
        icon: Sparkles,
    },
    {
        number: '03',
        title: 'Watch & learn',
        description: 'Your course is ready in minutes. Watch it in the browser with animated slides and synced audio.',
        icon: Video,
    },
]

const features = [
    {
        icon: BookOpen,
        title: 'Structured chapters',
        description: 'Every course is organized into focused chapters with a clear learning progression.',
        color: 'text-violet-500',
        bg: 'bg-violet-500/10',
    },
    {
        icon: Mic2,
        title: 'Natural voice narration',
        description: 'ElevenLabs TTS gives every slide a professional, human-sounding voice.',
        color: 'text-sky-500',
        bg: 'bg-sky-500/10',
    },
    {
        icon: Captions,
        title: 'Auto-generated captions',
        description: 'Whisper AI transcribes each narration so nothing is lost and content is accessible.',
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
    },
    {
        icon: Zap,
        title: 'Ready in minutes',
        description: 'From topic to fully narrated video course in under 3 minutes — no editing required.',
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
    },
]

function LandingFeatures() {
    return (
        <div className='w-full mt-4 mb-20 px-4 relative z-10'>

            {/* How it works */}
            <section className='max-w-4xl mx-auto'>
                <div className='text-center mb-10'>
                    <span className='text-xs font-semibold tracking-widest uppercase text-primary/70'>How it works</span>
                    <h2 className='mt-2 text-2xl md:text-3xl font-bold'>From idea to video course in three steps</h2>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {steps.map((step, i) => {
                        const Icon = step.icon
                        return (
                            <div key={step.number} className='relative flex flex-col gap-3 p-6 rounded-2xl border bg-background/60 backdrop-blur'>
                                <div className='flex items-center gap-3'>
                                    <span className='text-3xl font-black text-primary/20 leading-none'>{step.number}</span>
                                    <div className='h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center'>
                                        <Icon className='h-4.5 w-4.5 text-primary' />
                                    </div>
                                </div>
                                <h3 className='font-semibold text-base'>{step.title}</h3>
                                <p className='text-sm text-muted-foreground leading-relaxed'>{step.description}</p>
                                {i < steps.length - 1 && (
                                    <ChevronRight className='hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 z-10' />
                                )}
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Features grid */}
            <section className='max-w-4xl mx-auto mt-16'>
                <div className='text-center mb-10'>
                    <span className='text-xs font-semibold tracking-widest uppercase text-primary/70'>What you get</span>
                    <h2 className='mt-2 text-2xl md:text-3xl font-bold'>Everything a video course needs</h2>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                    {features.map((f) => {
                        const Icon = f.icon
                        return (
                            <div key={f.title} className='flex gap-4 p-5 rounded-2xl border bg-background/60 backdrop-blur'>
                                <div className={`h-10 w-10 shrink-0 rounded-xl ${f.bg} flex items-center justify-center`}>
                                    <Icon className={`h-5 w-5 ${f.color}`} />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-sm'>{f.title}</h3>
                                    <p className='text-sm text-muted-foreground mt-0.5 leading-relaxed'>{f.description}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* CTA banner */}
            <section className='max-w-4xl mx-auto mt-16'>
                <div className='rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-sky-500/10 border border-primary/20 p-10 text-center'>
                    <h2 className='text-2xl md:text-3xl font-bold'>Ready to build your first course?</h2>
                    <p className='mt-3 text-muted-foreground text-sm max-w-md mx-auto'>
                        Sign up free and turn any topic into a narrated video course in minutes.
                    </p>
                    <SignInButton mode='modal'>
                        <Button className='mt-6 rounded-full px-8' size='lg'>
                            Get started free
                        </Button>
                    </SignInButton>
                </div>
            </section>

        </div>
    )
}

export default LandingFeatures
