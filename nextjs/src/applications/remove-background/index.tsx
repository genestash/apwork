'use client';

import { useState, useRef, useEffect } from 'react';
import { Loaded } from '@/components/navigation';
import { Button } from '@/components/ui';
import { limitFileImageSize } from '@/utils';
import style from './style.module.css';
import beforeImage from './assets/before.webp';
import afterImage from './assets/after.webp';

async function runWorker(ref: React.RefObject<Worker | null>): Promise<Worker> {
    if (ref.current) return ref.current;

    return new Promise((resolve, reject) => {
        const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });

        worker.onmessage = (event: MessageEvent) => {
            if (event.data?.ready) {
                ref.current = worker;
                resolve(ref.current);
            }
        };

        worker.onerror = () => {
            // Error
            reject();
        };
    });
}

export default function Application() {
    const [before, setBefore] = useState(beforeImage.src);
    const [after, setAfter] = useState(afterImage.src);
    const [processing, setProcessing] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const workerRef = useRef<Worker>(null);
    const urlsRef = useRef<string[]>([]);

    useEffect(() => {
        const worker = workerRef.current;
        const urls = urlsRef.current;

        return () => {
            worker?.terminate();

            for (const url of urls) {
                URL.revokeObjectURL(url);
            }
        };
    }, []);

    const handleUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;

        const url = URL.createObjectURL(file);
        urlsRef.current.push(url);
        setProcessing('Loading');
        setBefore(url);
        setAfter('');

        try {
            const [worker, resizedFile] = await Promise.all([runWorker(workerRef), limitFileImageSize(file, 1280)]);

            setAfter(url);
            setProcessing('Processing');
            worker.postMessage(resizedFile);

            worker.onmessage = (event: MessageEvent) => {
                if (event.data?.result) {
                    const resultUrl = URL.createObjectURL(event.data.result);
                    urlsRef.current.push(resultUrl);
                    setAfter(resultUrl);
                    setProcessing('');
                } else if (event.data?.error) {
                    // Error
                    setProcessing('');
                }
            };

            worker.onerror = () => {
                // Error
                setProcessing('');
            };
        } catch {
            // Error
            setProcessing('');
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = after;
        link.download = `${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <p className={'h1'}>Remove Background</p>
            <div className={style.images}>
                <div className={style.wrap}>
                    <div className={style.image} style={{ backgroundImage: `url(${before})` }}></div>
                </div>
                <div className={style.wrap}>
                    <div
                        className={[style.image, processing ? style.processing : ''].join(' ')}
                        style={{ backgroundImage: `url(${after})` }}
                    ></div>
                </div>
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className={style.fileInput} />
            <div className={style.buttons}>
                <div className={style.wrap}>
                    <Button color="blue" size="normal" disable={Boolean(processing)} onClick={handleUpload}>
                        Select File
                    </Button>
                </div>
                <div className={style.wrap}>
                    {processing ? (
                        <Button color="ghost" size="normal" loading={true}>
                            {processing}
                        </Button>
                    ) : (
                        <Button color="white" size="normal" onClick={handleDownload}>
                            Download Result
                        </Button>
                    )}
                </div>
            </div>
            <Loaded />
        </>
    );
}
