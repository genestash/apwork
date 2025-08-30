import { useState } from 'react';
import { Loaded } from '@/components/navigation';
import { Button } from '@/components/ui';
import { useBlobUrl } from '@/hooks/useBlobUrl';
import { downloadFile, uploadFile } from '@/libs/files';
import { grayscaleImage } from '@/libs/grayscaleImage';
import { getFileType, simulateProcessing, sleep } from '@/utils';

// Import styles

import style from './style.module.css';

// Import assets

import beforeImage from './before.webp';
import afterImage from './after.webp';

// Types

enum Processing {
    Free,
    Uploading,
    Downloading
}

// Components

export default function Application() {
    const [processing, setProcessing] = useState<Processing>(Processing.Free);
    const [before, setBefore] = useState(beforeImage.src);
    const [after, setAfter] = useState(afterImage.src);
    const [fileType, setFileType] = useState('webp');
    const newBlobUrl = useBlobUrl();

    // Handlers

    const handleUpload = async () => {
        const files = await uploadFile('image/*');
        if (!files[0]) return;

        const type = getFileType(files[0].name);
        const blob = await grayscaleImage(files[0]);

        if (!blob) return;

        setBefore(newBlobUrl(files[0]));
        setAfter(newBlobUrl(blob));
        setFileType(type);
    };

    const handleDownload = async () => {
        setProcessing(Processing.Downloading);
        await sleep(1000);
        setProcessing(Processing.Free);
        downloadFile(after, `${Date.now()}.${fileType}`);
    };

    // Layout

    return (
        <div className={cn(style.window, processing !== Processing.Free && style.processing)}>
            <div className="h1">Make Image Black and White</div>

            <div className={style.images}>
                <div className={style.wrap}>
                    <div className={style.image} style={{ backgroundImage: `url(${before})` }}></div>
                </div>
                <div className={style.wrap}>
                    <div className={style.image} style={{ backgroundImage: `url(${after})` }}></div>
                </div>
            </div>

            <div className={style.buttons}>
                <Button color="blue" size="normal" onClick={handleUpload} loading={processing === Processing.Uploading} className={style.button}>
                    {processing === Processing.Uploading ? 'Uploading' : 'Select File'}
                </Button>

                <Button color="yellow" size="normal" onClick={handleDownload} loading={processing === Processing.Downloading} className={style.button}>
                    {processing === Processing.Downloading ? 'Processing' : 'Download Result'}
                </Button>
            </div>

            <Loaded />
        </div>
    );
}
