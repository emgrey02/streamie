import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'streamie',
    description: 'Generated by create next app',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body
                    className={`${inter.className} p-2 w-full h-full relative`}
                >
                    <SignedOut>
                        <SignInButton />
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <nav className="flex justify-end gap-4 absolute top-0 right-0 py-2 px-4 z-0">
                        <Link href="/">Home</Link>
                        <Link href="/dashboard">Tmdb Dashboard</Link>
                    </nav>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}
