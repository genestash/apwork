'use client';

// Imports

import { useState, useRef } from 'react';
import { Loaded } from '@/components/navigation';
import { Button } from '@/components/ui';
import { useBlobUrl } from '@/hooks/useBlobUrl';
import { uploadFile, downloadFile } from '@/libs/files';
import { simulateProcessing } from '@/utils';
import { convertImage } from '@/libs/convertImage';
import style from './style.module.css';

// Types

type FilesData = { before: FileData; after: FileData };
type FileData = { file?: File; url?: string };

// Components

export default function Application() {
    const [dragging, setDragging] = useState(false);
    const [processing, setProcessing] = useState(false);

    const filesRef = useRef<FilesData>({ before: {}, after: {} });
    const dragCounter = useRef(0);
    const newBlobUrl = useBlobUrl();

    // File management

    const handleUpload = async () => {
        const files = await uploadFile('image/webp');
        if (!files[0]) return;
        processFile(files[0]);
    };

    const processFile = async (file: File) => {
        setProcessing(true);
        const waitProcessing = simulateProcessing(1000);

        filesRef.current.before = { file, url: newBlobUrl(file) };
        const png = await convertImage(file, 'png');
        filesRef.current.after = { file: png!, url: newBlobUrl(png!) };

        await waitProcessing();
        setProcessing(false);
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
        <div onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDrop={handleDrop} onDragLeave={handleDragLeave} className={cn(style.window, dragging ? style.active : '', processing && style.processing)}>
            <p className={cn('h1', style.title)}>Convert WEBP to PNG</p>
            <Button color="blue" size="normal" className={style.button} onClick={handleUpload}>
                Select File
            </Button>
            <div className={style.result}>
                {filesRef.current.before.file ? (
                    <>
                        <div className={style.preview}>
                            <div className={style.image} style={{ backgroundImage: `url(${filesRef.current.before.url})` }}></div>
                            <div className={style.name}>{filesRef.current.before.file.name}</div>
                        </div>
                        {processing ? (
                            <Button color="ghost" size="normal" loading={true}>
                                Processing
                            </Button>
                        ) : (
                            <Button color="yellow" size="normal" src={filesRef.current.after.url} onClick={handleDownload}>
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
