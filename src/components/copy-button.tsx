'use client';

import { Button } from './ui/button';
import { CopyIcon } from 'lucide-react';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface CopyButtonProps {
    url: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ url }) => {
    const [copied, setCopied] = useState(false);

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast('Shortened URL copied into clipboard.');
            setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className='text-muted-foreground hover:bg-muted'
            onClick={handleCopyUrl}
        >
            {!copied && <CopyIcon className='w-4 h-4' />}
            <span className='sr-only'>Copy URL</span>
            {copied && <Check className='w-4 h-4' />}
        </Button>
    );
};

export default CopyButton;
