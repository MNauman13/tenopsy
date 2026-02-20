import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)',
    '/sign-up(.*)',
    '/', '/api/course',
    '/course/69975e2a-fc91-4d3d-afa5-43e595655c33',
    '/course/7ce88fbf-ab85-4ca3-b01b-314d8e79b90d',
    '/course/56e56b13-ee31-4d51-99c2-84d48185e47c',
])

export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
        await auth.protect()
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}