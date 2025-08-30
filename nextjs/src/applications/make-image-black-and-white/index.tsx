import { useState } from 'react';
import { Loaded } from '@/components/navigation';
import { Button } from '@/components/ui';
import { useBlobUrl } from '@/hooks/useBlobUrl';
import { downloadFile, uploadFile } from '@/libs/files';
import { grayscaleImage } from '@/libs/grayscaleImage';
import { getFileType, sleep } from '@/utils';

// Import styles

import style from './style.module.css';

// Import assets

import beforeImage from './before.webp';
import afterImage from './after.webp';

// Components

export default function Application() {
    const [processing, setProcessing] = useState(false);
    const [before, setBefore] = useState(beforeImage.src);
    const [after, setAfter] = useState(afterImage.src);
    const [fileType, setFileType] = useState('webp');
    const newBlobUrl = useBlobUrl();

    // Handlers

    const handleUpload = async () => {
        const files = await uploadFile('image/*');
        if (!files[0]) return;

        const type = getFileType(files[0].name);
        if (!type) return;

        const blob = await grayscaleImage(files[0]);
        if (!blob) return;

        setBefore(newBlobUrl(files[0]));
        setAfter(newBlobUrl(blob));
        setFileType(type);
    };

    const handleDownload = async () => {
        setProcessing(true);
        await sleep(1000);
        setProcessing(false);
        downloadFile(after, `${Date.now()}.${fileType}`);
    };

    // Layout

    return (
        <>
            <div className="h1">Make Image Black and White</div>

            <div className={style.images}>
                <div className={`${style.wrap} `}>
                    <div className={style.image} style={{ backgroundImage: `url(${before})` }}></div>
                </div>
                <div className={`${style.wrap}`}>
                    <div className={style.image} style={{ backgroundImage: `url(${after})` }}></div>
                </div>
            </div>

            <div className={style.buttons}>
                <Button color="blue" size="normal" onClick={handleUpload}>
                    Select File
                </Button>
                <Button color="yellow" size="normal" onClick={handleDownload} loading={processing} className={style.download}>
                    {processing ? 'Processing' : 'Download Result'}
                </Button>
            </div>

            <Loaded />
        </>
    );
}
