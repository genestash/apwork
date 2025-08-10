'use client';

import { useState, useRef, useEffect } from 'react';
import { Loaded } from '@/components/navigation';
import { Button } from '@/components/ui';
import style from './style.module.css';
import { convertFileImage } from '@/utils';

type FilesData = { before: FileData; after: FileData };
type FileData = { file?: File; url?: string };

export default function Application() {
    const [dragging, setDragging] = useState(false);
    const [processing, setProcessing] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const filesRef = useRef<FilesData>({ before: {}, after: {} });
    const dragCounter = useRef(0);

    const minProcessingTime = 1000;

    // Clean Up

    useEffect(() => {
        const urls = filesRef.current;
        return () => cleanUrls(urls);
    }, []);

    const cleanUrls = (files: FilesData) => {
        if (files.before.url) URL.revokeObjectURL(files.before.url);
        if (files.after.url) URL.revokeObjectURL(files.after.url);
    };

    // File Management

    const handleUpload = () => {
        inputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;
        event.target.value = '';
        processFile(selectedFile);
    };

    const processFile = async (file: File) => {
        const processingStart = Date.now();

        setProcessing(true);
        cleanUrls(filesRef.current);
        filesRef.current.before = { file, url: URL.createObjectURL(file) };

        const png = await convertFileImage(file, 'png');
        filesRef.current.after = { file: png!, url: URL.createObjectURL(png!) };

        const processingDelay = minProcessingTime - (Date.now() - processingStart);
        setTimeout(setProcessing, processingDelay, false);
    };

    const handleDownload = () => {
        if (!filesRef.current.after.file) return;
        const link = document.createElement('a');
        link.href = filesRef.current.after.url!;
        link.download = filesRef.current.after.file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
            className={[style.dropZone, dragging ? style.active : ''].join(' ')}
        >
            <p className={['h1', style.title].join(' ')}>Convert WEBP to PNG</p>
            <Button color="blue" size="normal" className={style.button} onClick={handleUpload}>
                Select File
            </Button>
            <input ref={inputRef} type="file" accept="image/webp" onChange={handleFileChange} className={style.fileInput} />
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
                            <Button color="ghost" size="small" loading={true}>
                                Processing
                            </Button>
                        ) : (
                            <Button color="white" size="small" src={filesRef.current.after.url} onClick={handleDownload}>
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
