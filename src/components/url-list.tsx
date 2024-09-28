import Link from 'next/link';
import { EyeIcon, Settings } from 'lucide-react';
import { getMyUrls } from '~/server/queries';
import CopyButton from './copy-button';
import { Button } from './ui/button';

export const dynamic = "force-dynamic";

export default async function UrlList() {
    let urls = [];

    try {
        urls = await getMyUrls();
    } catch (error) {
        console.error('Error loading URLs:', error);
        return <p className='text-red-500 text-center'>Error loading URLs. Please try again later.</p>;
    }


    return (
        <div>
            {urls.length > 0 && <div>
                <h2 className='text-2xl font-bold mb-2'>Recent URLs</h2>
                <ul className='space-y-2'>
                    {urls.map((url) => (
                        <li key={url.id} className='flex items-center gap-2 justify-between'>
                            <Link href={url.shortCode} target='_blank' className='text-blue-500'>
                                {url.originalUrl}
                            </Link>
                            <div className='flex items-center gap-3'>
                                <CopyButton url={"https://" + process.env.NEXT_PUBLIC_URL + '/' + url.shortCode} />
                                <span className='flex items-center text-muted-foreground '>
                                    <EyeIcon className='h-4 w-4 mr-2' />
                                    {url.visits}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className='text-muted-foreground hover:bg-muted'
                                >
                                    <Settings />
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>}
            {urls.length === 0 && <p className='text-center'>You do not have any shortened URLs yet.</p>}

        </div>
    );
}
