import { useState, useRef, useEffect, useCallback } from 'react';

// Internal imports

import { Loaded } from '@/components/navigation';
import { Button, Select } from '@/components/ui';
import { useWindowResize } from '@/hooks/useWindowResize';
import { useBlobUrl } from '@/hooks/useBlobUrl';
import { uploadFile, downloadFile } from '@/libs/files';
import { getFileType, simulateProcessing } from '@/utils';

// Style imports

import style from './style.module.css';

// Assets imports

import exampleImage from './example.webp';

// Types

enum CropType {
    Free = 'Free',
    Square = 'Square',
    Circle = 'Circle',
    Ratio = 'Ratio'
}

type ImageData = {
    img: HTMLImageElement;
    scale: number;
    displayW: number;
    displayH: number;
    offsetX: number;
    offsetY: number;
};

type MaskData = {
    x: number;
    y: number;
    w: number;
    h: number;
};

type RatioData = {
    a: number;
    b: number;
    aRaw: string | number;
    bRaw: string | number;
};

enum Processing {
    Free,
    Uploading,
    Downloading
}

// Variables

const exampleMask = {
    x: 35 / 395,
    y: 110 / 395,
    w: 333 / 395,
    h: 208 / 395
};

// Components

export default function Application() {
    // States

    const [processing, setProcessing] = useState<Processing>(Processing.Free);
    const [before, setBefore] = useState(exampleImage.src);
    const [shape, setShape] = useState(CropType.Free);
    const [ratio, setRatio] = useState<RatioData>({ a: 3, b: 2, aRaw: 3, bRaw: 2 });
    const [mask, setMask] = useState<MaskData>({ x: -1, y: -1, w: -1, h: -1 });
    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(false);
    const [imageData, setImageData] = useState<ImageData | null>(null);
    const [fileType, setFileType] = useState('webp');

    // Refs

    const containerRef = useRef<HTMLDivElement>(null);
    const previewContainerRef = useRef<HTMLDivElement>(null);
    const startMouse = useRef({ x: 0, y: 0 });
    const startRect = useRef<MaskData>(mask);
    const prevImageSrc = useRef<string>('');
    const isInitialized = useRef<boolean>(false);
    const imageDataRef = useRef<ImageData | null>(null);
    const maskRef = useRef<MaskData>(mask);

    // Custom hooks

    const resizeKey = useWindowResize();
    const newBlobUrl = useBlobUrl();

    // Update refs when values change

    useEffect(() => {
        imageDataRef.current = imageData;
    }, [imageData]);

    useEffect(() => {
        maskRef.current = mask;
    }, [mask]);

    // Handlers

    const handleRatioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (/[^0-9]/.test(value)) return;

        const name = event.target.name;
        const number = Number(value) || 1;

        setRatio((prev) => ({
            ...prev,
            [name]: number,
            [`${name}Raw`]: value
        }));
    };

    const handleRatioBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const rawValue = event.target.value;
        const number = Number(rawValue) || 1;

        setRatio((prev) => ({
            ...prev,
            [name]: number,
            [`${name}Raw`]: number
        }));
    };

    const handleMaskMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        setDragging(true);
        startMouse.current = { x: event.clientX, y: event.clientY };
        startRect.current = { ...mask };
    };

    const handleResizeMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setResizing(true);
        startMouse.current = { x: event.clientX, y: event.clientY };
        startRect.current = { ...mask };
    };

    const calculateNewMaskSize = useCallback(
        (newW: number, newH: number, minSize: number) => {
            const aspect = ratio.a / ratio.b;

            switch (shape) {
                case CropType.Square:
                case CropType.Circle:
                    const side = Math.max(newW, newH);
                    return { w: Math.max(side, minSize), h: Math.max(side, minSize) };

                case CropType.Ratio:
                    newW = Math.max(newW, minSize);
                    newH = Math.max(newW / aspect, minSize);

                    if (newH < minSize) {
                        newH = minSize;
                        newW = newH * aspect;
                    }
                    return { w: newW, h: newH };

                default:
                    return { w: Math.max(newW, minSize), h: Math.max(newH, minSize) };
            }
        },
        [ratio, shape]
    );

    const constrainMaskToImageBounds = useCallback(
        (newW: number, newH: number, rect: MaskData, maxW: number, maxH: number, minSize: number) => {
            const aspect = ratio.a / ratio.b;

            switch (shape) {
                case CropType.Square:
                case CropType.Circle:
                    const maxSide = Math.min(maxW, maxH);
                    const side = Math.min(newW, maxSide);
                    return { w: Math.max(side, minSize), h: Math.max(side, minSize) };

                case CropType.Ratio:
                    if (newW > maxW) {
                        newW = maxW;
                        newH = Math.max(newW / aspect, minSize);
                    }
                    if (newH > maxH) {
                        newH = maxH;
                        newW = Math.max(newH * aspect, minSize);
                    }
                    if (newW > maxW) {
                        newW = maxW;
                        newH = Math.max(newW / aspect, minSize);
                    }
                    return { w: newW, h: newH };

                default:
                    return { w: Math.min(newW, maxW), h: Math.min(newH, maxH) };
            }
        },
        [ratio, shape]
    );

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!containerRef.current || !imageData) return;

            const rect = startRect.current;
            const { displayW, displayH, offsetX, offsetY, scale } = imageData;

            if (dragging) {
                const dx = e.clientX - startMouse.current.x;
                const dy = e.clientY - startMouse.current.y;

                let newX = rect.x + dx;
                let newY = rect.y + dy;

                // Constrain to image bounds
                newX = Math.max(offsetX, Math.min(newX, offsetX + displayW - rect.w));
                newY = Math.max(offsetY, Math.min(newY, offsetY + displayH - rect.h));

                setMask((prev) => ({ ...prev, x: newX, y: newY }));
            }

            if (resizing) {
                let newW = rect.w + (e.clientX - startMouse.current.x);
                let newH = rect.h + (e.clientY - startMouse.current.y);

                // Minimum size: 1 pixel on original image
                const minSize = scale;

                // Calculate new size based on crop type
                const calculatedSize = calculateNewMaskSize(newW, newH, minSize);
                newW = calculatedSize.w;
                newH = calculatedSize.h;

                // Constrain to image bounds
                const maxW = offsetX + displayW - rect.x;
                const maxH = offsetY + displayH - rect.y;

                const constrainedSize = constrainMaskToImageBounds(newW, newH, rect, maxW, maxH, minSize);
                newW = constrainedSize.w;
                newH = constrainedSize.h;

                setMask((prev) => ({ ...prev, w: newW, h: newH }));
            }
        },
        [dragging, imageData, resizing, calculateNewMaskSize, constrainMaskToImageBounds]
    );

    const handleMouseUp = useCallback(() => {
        setDragging(false);
        setResizing(false);
    }, []);

    const handleUpload = async () => {
        const files = await uploadFile('image/*');
        if (!files[0]) return;

        const type = getFileType(files[0].name);
        if (!type) return;

        setBefore(newBlobUrl(files[0]));
        setFileType(type);
    };

    const handleDownload = async () => {
        if (!imageData) return;
        setProcessing(Processing.Downloading);
        const waitProcessing = simulateProcessing(1000);

        const { img, scale, offsetX, offsetY } = imageData;
        const X = (mask.x - offsetX) / scale;
        const Y = (mask.y - offsetY) / scale;
        const W = mask.w / scale;
        const H = mask.h / scale;

        const canvas = new OffscreenCanvas(W, H);
        const context = canvas.getContext('2d')!;

        if (shape === CropType.Circle) {
            context.beginPath();
            context.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2, 0, Math.PI * 2);
            context.closePath();
            context.clip();
        }

        context.drawImage(img, X, Y, W, H, 0, 0, canvas.width, canvas.height);
        const blob = await canvas.convertToBlob({ type: `image/${fileType}` });
        const url = newBlobUrl(blob);
        const name = `${Date.now()}.${fileType}`;

        await waitProcessing();
        downloadFile(url, name);
        setProcessing(Processing.Free);
    };

    // Utility functions

    const initializeMask = useCallback(
        (displayW: number, displayH: number, offsetX: number, offsetY: number) => {
            if (before === exampleImage.src) {
                return {
                    x: offsetX + exampleMask.x * displayW,
                    y: offsetY + exampleMask.y * displayH,
                    w: exampleMask.w * displayW,
                    h: exampleMask.h * displayH
                };
            }

            return {
                x: offsetX + displayW / 4,
                y: offsetY + displayH / 4,
                w: displayW / 2,
                h: displayH / 2
            };
        },
        [before]
    );

    const calculateRelativeMask = (currentMask: MaskData, prevImageData: ImageData) => {
        const { displayW: prevDisplayW, displayH: prevDisplayH, offsetX: prevOffsetX, offsetY: prevOffsetY } = prevImageData;

        return {
            x: (currentMask.x - prevOffsetX) / prevDisplayW,
            y: (currentMask.y - prevOffsetY) / prevDisplayH,
            w: currentMask.w / prevDisplayW,
            h: currentMask.h / prevDisplayH
        };
    };

    const applyRelativeMask = (relativeMask: MaskData, displayW: number, displayH: number, offsetX: number, offsetY: number) => {
        return {
            x: offsetX + relativeMask.x * displayW,
            y: offsetY + relativeMask.y * displayH,
            w: relativeMask.w * displayW,
            h: relativeMask.h * displayH
        };
    };

    const getPreviewStyles = (): React.CSSProperties => {
        if (!imageData || !previewContainerRef.current) return {};

        const { scale, offsetX, offsetY } = imageData;

        const cropX = (mask.x - offsetX) / scale;
        const cropY = (mask.y - offsetY) / scale;
        const cropW = mask.w / scale;
        const cropH = mask.h / scale;

        const containerRect = previewContainerRef.current.getBoundingClientRect();
        const containerSize = Math.min(containerRect.width, containerRect.height);

        const aspectRatio = cropW / cropH;
        let previewW, previewH;

        if (aspectRatio > 1) {
            previewW = containerSize;
            previewH = containerSize / aspectRatio;
        } else {
            previewH = containerSize;
            previewW = containerSize * aspectRatio;
        }

        const previewScale = previewW / cropW;

        return {
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${previewW}px`,
            height: `${previewH}px`,
            transform: 'translate(-50%, -50%)',
            backgroundImage: `url(${before})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: `-${cropX * previewScale}px -${cropY * previewScale}px`,
            backgroundSize: `${imageData.img.width * previewScale}px ${imageData.img.height * previewScale}px`,
            borderRadius: shape === CropType.Circle ? '50%' : '0'
        };
    };

    // Effects

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    // Image loading and mask initialization

    useEffect(() => {
        const img = new Image();
        img.src = before;

        const handleLoad = () => {
            if (!containerRef.current) return;

            const bounds = containerRef.current.getBoundingClientRect();
            const scale = Math.min(bounds.width / img.width, bounds.height / img.height);
            const displayW = img.width * scale;
            const displayH = img.height * scale;
            const offsetX = (bounds.width - displayW) / 2;
            const offsetY = (bounds.height - displayH) / 2;

            const prevImageData = imageDataRef.current;
            const currentMask = maskRef.current;

            setImageData({ img, scale, displayW, displayH, offsetX, offsetY });

            if (!isInitialized.current) {
                // First initialization
                isInitialized.current = true;
                prevImageSrc.current = before;
                setMask(initializeMask(displayW, displayH, offsetX, offsetY));
            } else if (prevImageSrc.current === before && prevImageData) {
                // Window resize - preserve relative mask position
                const relativeMask = calculateRelativeMask(currentMask, prevImageData);
                setMask(applyRelativeMask(relativeMask, displayW, displayH, offsetX, offsetY));
            } else if (prevImageSrc.current !== before) {
                // New image - reset mask
                prevImageSrc.current = before;
                setMask(initializeMask(displayW, displayH, offsetX, offsetY));
            }
        };

        img.addEventListener('load', handleLoad);
        return () => img.removeEventListener('load', handleLoad);
    }, [before, resizeKey, initializeMask]);

    // Handle crop type changes

    useEffect(() => {
        if (!imageData) return;

        const { displayW, displayH, offsetX, offsetY } = imageData;
        let newW = mask.w;
        let newH = mask.h;

        // Adjust mask size based on crop type
        if (shape === CropType.Square || shape === CropType.Circle) {
            const side = Math.max(newW, newH);
            newW = side;
            newH = side;
        } else if (shape === CropType.Ratio) {
            const aspect = ratio.a / ratio.b;
            newH = newW / aspect;
        }

        // Constrain to image bounds
        const maxW = offsetX + displayW - mask.x;
        const maxH = offsetY + displayH - mask.y;

        if (shape === CropType.Square || shape === CropType.Circle) {
            const maxSide = Math.min(maxW, maxH);
            const side = Math.min(newW, maxSide);
            newW = side;
            newH = side;
        } else if (shape === CropType.Ratio) {
            const aspect = ratio.a / ratio.b;

            if (newW > maxW) {
                newW = maxW;
                newH = newW / aspect;
            }
            if (newH > maxH) {
                newH = maxH;
                newW = newH * aspect;
            }
            if (newW > maxW) {
                newW = maxW;
                newH = newW / aspect;
            }
        } else {
            newW = Math.min(newW, maxW);
            newH = Math.min(newH, maxH);
        }

        if (newW !== mask.w || newH !== mask.h) {
            setMask((prev) => ({ ...prev, w: newW, h: newH }));
        }
    }, [shape, mask, ratio, imageData]);

    // Layout

    return (
        <div className={cn(style.window, processing !== Processing.Free && style.processing)}>
            <p className="h1">Crop Image</p>

            <div className={style.images}>
                <div className={`${style.wrap} ${shape === CropType.Circle ? style.circle : ''}`}>
                    <div className={style.image} style={{ backgroundImage: `url(${before})` }} ref={containerRef}>
                        <div
                            onMouseDown={handleMaskMouseDown}
                            className={style.mask}
                            style={{
                                left: mask.x,
                                top: mask.y,
                                width: mask.w,
                                height: mask.h,
                                borderRadius: shape === CropType.Circle ? '50%' : '0'
                            }}
                        >
                            <div data-handle="resize" onMouseDown={handleResizeMouseDown} className={style.resizeHandle} />
                        </div>
                    </div>
                </div>

                <div ref={previewContainerRef} className={style.wrap}>
                    <div className={style.image} style={getPreviewStyles()} />
                </div>
            </div>

            <div className={style.buttons}>
                <Button color="blue" size="normal" loading={processing === Processing.Uploading} onClick={handleUpload}>
                    {processing === Processing.Uploading ? 'Uploading' : 'Select File'}
                </Button>

                <Select
                    options={Object.values(CropType).map((type) => ({ value: type, label: type }))}
                    onChange={(value) => setShape(value as CropType)}
                    defaultOption={{ label: CropType.Free, value: CropType.Free }}
                    className={style.select}
                    label="Crop type"
                />

                {shape === CropType.Ratio && (
                    <div className={style.ratio}>
                        <input value={ratio.aRaw} onChange={handleRatioChange} onBlur={handleRatioBlur} autoComplete="off" name="a" />
                        <div className={style.colon}>:</div>
                        <input value={ratio.bRaw} onChange={handleRatioChange} onBlur={handleRatioBlur} autoComplete="off" name="b" />
                    </div>
                )}

                <Button color="yellow" size="normal" onClick={handleDownload} loading={processing === Processing.Downloading} className={style.download}>
                    {processing === Processing.Downloading ? 'Processing' : 'Download Result'}
                </Button>
            </div>

            <Loaded />
        </div>
    );
}
