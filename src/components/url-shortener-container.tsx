import React from 'react'
import ShortenForm from './shorten-form'
import UrlList from './url-list'
import { SignedIn } from '@clerk/nextjs'

export default function UrlShortenerContainer() {
    return (
        <div>
            <ShortenForm />

            <SignedIn>
                <UrlList />
            </SignedIn>

        </div>
    )
}
