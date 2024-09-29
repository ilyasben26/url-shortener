'use client'

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import Image from 'next/image'
import { Button } from "~/components/ui/button";

interface QrCodeProps {
    shortened_url: string
}

export function QrCode({ shortened_url }: QrCodeProps) {
    const [src, setSrc] = useState<string>('');

    const generate = () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        QRCode.toDataURL(shortened_url)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            .then(setSrc)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            .catch(err => console.error(err));
    };

    const handleDownload = () => {
        if (src) {
            const link = document.createElement('a');
            link.href = src;
            link.download = 'qrcode.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    useEffect(() => {
        generate();
    }, [generate, shortened_url]);

    return (
        <div className="flex flex-col items-center">
            <Image src={src} alt="QR code" width={250} height={250} />

            <Button className="mb-3 w-48" onClick={generate}>Regenerate</Button>
            <Button className="w-48" onClick={handleDownload}>Download</Button>

        </div>
    );
}