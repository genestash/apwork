'use client';

// Imports

import { useId, useRef, useState } from 'react';
import { Loaded } from '@/components/navigation';
import { Button, List } from '@/components/ui';
import { useBlobUrl } from '@/hooks/useBlobUrl';
import { useRender } from '@/hooks/useRender';
import { uploadFile, downloadFile } from '@/libs/files';
import { sleep } from '@/utils';
import { getPdfPageImage } from '@/libs/getPdfPageImage';
import { mergePdfs } from '@/libs/mergePdfs';
import style from './style.module.css';

// Types

type Pdf = {
    id: number;
    name: string;
    image: string;
    file: File;
    rotation: number;
};

enum Processing {
    Free,
    Uploading,
    Downloading
}

// Constants

const minProcessingTime = 1000;

// Components

export default function Application() {
    const instanceId = useId();
    const list = useRef<Pdf[]>([]);
    const [processing, setProcessing] = useState(Processing.Free);
    const newBlobUrl = useBlobUrl();
    const forceRender = useRender();

    // Handlers

    const addItems = async () => {
        const files = await uploadFile('application/pdf', true);
        setProcessing(Processing.Uploading);

        for await (const file of files) {
            const blob = await getPdfPageImage(file);
            if (!blob) continue;

            list.current.push({
                id: Math.random(),
                file: file,
                image: blob ? newBlobUrl(blob) : '',
                rotation: 0,
                name: file.name
            });
        }

        setProcessing(Processing.Free);
    };

    const deleteItem = (id: number) => {
        list.current = list.current.filter((item) => item.id !== id);
        forceRender();
    };

    const rotateItem = async (id: number) => {
        const item = list.current.find((i) => i.id === id);
        if (!item) return;
        item.rotation = (item.rotation + 90) % 360;

        // To prevent an unnecessary render and the hover blinking
        const image = document.querySelector<HTMLElement>(`[data-id="${instanceId}-${item.id}"] > .${style.image}`);
        image!.style.transform = `rotate(${item.rotation}deg)`;
    };

    const mergeItems = async () => {
        const processingStart = Date.now();
        setProcessing(Processing.Downloading);
        const blob = await mergePdfs(list.current);
        const url = newBlobUrl(blob);
        await sleep(minProcessingTime - (Date.now() - processingStart));
        setProcessing(Processing.Free);
        downloadFile(url, `${Date.now()}.pdf`);
    };

    // Layout

    const Item = ({ data, index }: { data: Pdf; index: number }) => {
        return (
            <div className={style.item} data-id={`${instanceId}-${data.id}`}>
                <div className={style.buttons}>
                    <div className={style.rotate} onClick={() => rotateItem(data.id)}>
                        <div className={style.image}></div>
                    </div>
                    <div className={style.delete} onClick={() => deleteItem(data.id)}>
                        <div className={style.image}></div>
                    </div>
                </div>
                <div className={style.image} style={{ backgroundImage: `url(${data.image})`, transform: `rotate(${data.rotation}deg)` }}></div>
                <div className={style.name}>
                    {index + 1}. {data.name}
                </div>
            </div>
        );
    };

    return (
        <div className={cn(style.wrap, processing !== Processing.Free && style.processing)}>
            <b className={cn('h1', style.title)}>Merge PDF</b>

            {processing === Processing.Uploading ? (
                <Button className={style.button} color="blue" loading={true}>
                    Processing
                </Button>
            ) : (
                <Button className={style.button} color="blue" onClick={addItems}>
                    Add Files
                </Button>
            )}

            <div className={style.list}>
                {list.current.length === 0 ? (
                    <p className={style.note}>
                        No files uploaded
                        <br />
                        Click the button above to add PDF files
                    </p>
                ) : (
                    <List list={list.current} Item={Item} />
                )}
            </div>

            {list.current.length >= 1 ? (
                <div className={style.result}>
                    {list.current.length === 1 ? (
                        <div className={style.note}>Add at least 1 more file</div>
                    ) : processing === Processing.Downloading ? (
                        <Button color="yellow" loading={true}>
                            Processing
                        </Button>
                    ) : (
                        <Button color="yellow" onClick={mergeItems}>
                            Merge {list.current.length} files
                        </Button>
                    )}
                </div>
            ) : null}
            <Loaded />
        </div>
    );
}
