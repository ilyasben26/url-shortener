import { notFound, redirect } from 'next/navigation';
import { getURLfromCode, logAccess } from '~/server/queries';

// TODO: implement rate limiting

interface RedirectPageProps {
    params: { shortcode: string }
}

export default async function RedirectPage({ params }: RedirectPageProps) {

    const { shortcode } = params;

    const url = await getURLfromCode(shortcode);

    if (!url) {
        notFound();
    }

    // track access to the shortened link
    await logAccess(shortcode);

    redirect(url);
}
