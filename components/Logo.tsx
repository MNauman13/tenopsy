import React from 'react'

interface LogoIconProps {
    size?: number
}

export function LogoIcon({ size = 40 }: LogoIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="tenopsyGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#6d28d9" />
                    <stop offset="55%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
            </defs>

            {/* Background rounded square */}
            <rect width="40" height="40" rx="10" fill="url(#tenopsyGrad)" />

            {/* Play triangle — the primary "video" mark */}
            <path d="M13 11 L29 20 L13 29 Z" fill="white" />

            {/* 4-point sparkle — the "AI" mark */}
            <path
                d="M33 6.5 L34.3 9 L36.8 10 L34.3 11 L33 13.5 L31.7 11 L29.2 10 L31.7 9 Z"
                fill="white"
                opacity="0.88"
            />
        </svg>
    )
}

interface LogoProps {
    size?: number
    showText?: boolean
    className?: string
}

export function Logo({ size = 38, showText = true, className = '' }: LogoProps) {
    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <LogoIcon size={size} />
            {showText && (
                <span className="text-xl font-bold tracking-tight select-none">
                    <span className="text-primary">Ten</span>
                    <span className="text-foreground">Opsy</span>
                </span>
            )}
        </div>
    )
}
