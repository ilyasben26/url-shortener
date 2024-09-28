import { headers } from 'next/headers';
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
    const reqHeaders = headers();

    const userAgent = reqHeaders.get('user-agent') ?? '';
    const ipAddress = reqHeaders.get('x-forwarded-for') ?? '';
    const referer = reqHeaders.get('referer') ?? '';
    await logAccess(shortcode, {
        userAgent,
        ipAddress,
        referer,
    });

    redirect(url);
}
