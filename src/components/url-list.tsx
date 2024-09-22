import Link from 'next/link'
import { Button } from './ui/button'
import { CopyIcon, EyeIcon } from 'lucide-react'
import { getMyUrls } from '~/server/queries';

export const dynamic = "force-dynamic";

export default async function UrlList() {
    const urls = await getMyUrls();

    return (
        <div>
            <h2 className='text-2xl font-bold mb-2'>Recent URLs</h2>
            <ul className='space-y-2'>
                {urls.map((url) => (
                    <li key={url.id} className='flex items-center gap-2 justify-between'>
                        <Link href={url.originalUrl} target='_blank' className='text-blue-500'>
                            {url.originalUrl}
                        </Link>
                        <div className='flex items-center gap-3'>
                            <Button variant="ghost" size="icon" className='text-muted-foreground hover:bg-muted'>
                                <CopyIcon className='w-4 h-4' />
                                <span className='sr-only'>Copy URL</span>
                            </Button>
                            <span className='flex items-center'>
                                <EyeIcon className='h-4 w-4' />
                                100 views
                            </span>
                        </div>
                    </li>
                ))}

            </ul>
        </div>
    )
}
