'use client'

import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';

export default function ShortenForm() {

    const [url, setUrl] = useState<string>('');
    const router = useRouter();
    const { isSignedIn } = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Check if the user is signed in
            if (!isSignedIn) {

                toast.info('Please sign in or sign up to shorten URLs.');
                return;
            }

        } catch {
            toast.error('Something went wrong');
        }


        // Client-side validation
        if (!url) {
            toast.error('URL is required.')
            return;
        } else {
            try {
                new URL(url);
            } catch {
                toast.error('Invalid URL.')
                return;
            }
        }

        // Server-side validation
        try {



            toast('Shortening URL ...')
            const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const responseData = await response.json();

            if (!response.ok) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                throw new Error(responseData.message || 'Failed to shorten URL');
            }

            setUrl('');
            router.refresh();
            toast.success('URL successfully shortened')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Something went wrong');

        }
    }

    return (
        <form onSubmit={handleSubmit} className='mb-4'>
            <div className="space-y-4">
                <Input
                    value={url}
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                    onChange={(e) => setUrl(e.target.value)}
                    className='h-12'
                    placeholder='Enter URL to shorten'
                />
                <Button
                    className='w-full p-2'
                    type='submit'
                >
                    Shorten URL
                </Button>
            </div>
        </form>
    )
}
