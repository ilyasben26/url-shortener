'use client'

import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'


//TODO: Use another form technique

export default function ShortenForm() {

    const [url, setUrl] = useState<string>();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(url);
    }

    return (
        <form onSubmit={handleSubmit} className='mb-4'>
            <div className="space-y-4">
                <Input
                    value={url}
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                    onChange={(e) => setUrl(e.target.value)}
                    className='h-12'
                    type='url'
                    placeholder='Enter URL to shorten'
                    required
                />
                <Button
                    className='w-full p-2'
                    type='submit'>
                    Shorten URL
                </Button>
            </div>
        </form>
    )
}
