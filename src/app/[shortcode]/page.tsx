import { redirect } from 'next/navigation';
import React from 'react'
import { getURLfromCode, logAccess } from '~/server/queries';

// TODO: implement rate limiting

interface RedirectPageProps {
    params: { shortcode: string }
}

export default async function RedirectPage({ params }: RedirectPageProps) {

    const { shortcode } = params;

    const url = await getURLfromCode(shortcode);

    if (!url) {
        return <div>404 - URL not found</div>
    }

    // track access to the shortened link
    await logAccess(shortcode);

    redirect(url);
}
