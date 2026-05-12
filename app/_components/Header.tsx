"use client"
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Logo'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

function Header() {
    const { user } = useUser()

    return (
        <header className='sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md'>
            <div className='max-w-7xl mx-auto flex items-center justify-between px-6 py-3'>
                <Link href='/'>
                    <Logo />
                </Link>

                <nav>
                    <ul className='flex gap-7 items-center'>
                        <li>
                            <Link
                                href='/'
                                className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href='/pricing'
                                className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
                            >
                                Pricing
                            </Link>
                        </li>
                    </ul>
                </nav>

                {user ? (
                    <UserButton />
                ) : (
                    <SignInButton mode='modal'>
                        <Button size='sm' className='rounded-full px-5'>
                            Get Started
                        </Button>
                    </SignInButton>
                )}
            </div>
        </header>
    )
}

export default Header
