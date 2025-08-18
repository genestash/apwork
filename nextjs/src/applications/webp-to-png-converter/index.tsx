'use client';

import { useState, useRef } from 'react';
import { Loaded } from '@/components/navigation';
import { Button } from '@/components/ui';
import style from './style.module.css';
import { convertImage } from './convertImage';
import { useBlobUrl } from '@/hooks/useBlobUrl';
import { uploadFile, downloadFile } from '@/utils';

type FilesData = { before: FileData; after: FileData };
type FileData = { file?: File; url?: string };

export default function Application() {
    const [dragging, setDragging] = useState(false);
    const [processing, setProcessing] = useState(false);

    const filesRef = useRef<FilesData>({ before: {}, after: {} });
    const dragCounter = useRef(0);
    const newBlobUrl = useBlobUrl();

    const minProcessingTime = 1000;

    // File management

    const handleUpload = async () => {
        const files = await uploadFile('image/webp');
        if (!files) return;
        processFile(files[0]);
    };

    const processFile = async (file: File) => {
        const processingStart = Date.now();

        setProcessing(true);
        filesRef.current.before = { file, url: newBlobUrl(file) };

        const png = await convertImage(file, 'png');
        filesRef.current.after = { file: png!, url: newBlobUrl(png!) };

        const processingDelay = minProcessingTime - (Date.now() - processingStart);
        setTimeout(setProcessing, processingDelay, false);
    };

    const handleDownload = () => {
        if (!filesRef.current.after.file) return;
        const url = filesRef.current.after.url!;
        const name = filesRef.current.after.file.name;
        downloadFile(url, name);
    };

    // Drag and Drop

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        dragCounter.current++;

        if (dragCounter.current === 1) {
            setDragging(true);
        }
    };

    const handleDragLeave = () => {
        dragCounter.current--;

        if (dragCounter.current === 0) {
            setDragging(false);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        dragCounter.current = 0;
        setDragging(false);
        const files = event.dataTransfer.files;
        if (files.length !== 1) return;
        if (files[0].type !== 'image/webp') return;
        processFile(files[0]);
    };

    // Layout

    return (
        <div
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
            className={cn(style.dropZone, dragging ? style.active : '')}
        >
            <p className={cn('h1', style.title)}>Convert WEBP to PNG</p>
            <Button color="blue" size="normal" className={style.button} onClick={handleUpload}>
                Select File
            </Button>
            <div className={style.result}>
                {filesRef.current.before.file ? (
                    <>
                        <div className={style.preview}>
                            <div
                                className={style.image}
                                style={{ backgroundImage: `url(${filesRef.current.before.url})` }}
                            ></div>
                            <div className={style.name}>{filesRef.current.before.file.name}</div>
                        </div>
                        {processing ? (
                            <Button color="ghost" size="normal" loading={true}>
                                Processing
                            </Button>
                        ) : (
                            <Button color="white" size="normal" src={filesRef.current.after.url} onClick={handleDownload}>
                                Download PNG
                            </Button>
                        )}
                    </>
                ) : (
                    <div className={style.dropHere}>Or drop file here</div>
                )}
            </div>
            <Loaded />
        </div>
    );
}
