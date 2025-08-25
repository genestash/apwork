'use client';

// Imports

import { useState, useRef, useCallback, useEffect, Fragment } from 'react';
import style from './style.module.css';
import { setCursor } from '@/utils';

// Types

type DraggingData = {
    index: number;
    startX: number;
    startY: number;
    rect: DOMRect;
};

type Props<T> = {
    list: T[];
    Item: React.ComponentType<ItemType<T>>;
};

export type ItemType<T> = {
    data: T;
    index: number;
    dragging: boolean;
    swapping: boolean;
};

// Components

export function List<T>({ list, Item }: Props<T>) {
    const [isDragging, setIsDragging] = useState(false);
    const [activeGap, setActiveGap] = useState(-1);
    const draggingItemRef = useRef<HTMLDivElement>(null);
    const draggingDataRef = useRef<DraggingData>(null);

    // Handlers

    const startDragging = (event: React.MouseEvent, index: number) => {
        if (event.button !== 0) return;
        const target = event.target as HTMLElement;
        const isItem = target.classList.contains(style.item);
        if (!isItem) return;

        draggingDataRef.current = {
            index: index,
            startX: event.clientX,
            startY: event.clientY,
            rect: target.getBoundingClientRect()
        };

        setIsDragging(true);
    };

    const handleMouseMove = useCallback(
        (event: MouseEvent) => {
            if (!isDragging || !draggingItemRef.current || !draggingDataRef.current) return;
            const x = event.clientX - draggingDataRef.current.startX;
            const y = event.clientY - draggingDataRef.current.startY;
            draggingItemRef.current.style.transform = `translate(${x}px, ${y}px)`;
        },
        [isDragging]
    );

    const handleMouseUp = useCallback(
        (event: MouseEvent) => {
            if (!isDragging || !draggingItemRef.current || !draggingDataRef.current) return;
            draggingItemRef.current.style.transform = ``;

            if (activeGap !== -1 && activeGap !== draggingDataRef.current.index) {
                const elementUnderCursor = document.elementFromPoint(event.clientX || 0, event.clientY || 0);
                const gapElement = elementUnderCursor?.closest(`.${style.gap}`);

                if (gapElement && gapElement.classList.contains(style.active)) {
                    const fromIndex = draggingDataRef.current.index;
                    const toIndex = activeGap > fromIndex ? activeGap - 1 : activeGap;
                    const [movedItem] = list.splice(fromIndex, 1);
                    list.splice(toIndex, 0, movedItem);
                }
            }

            setActiveGap(-1);
            setIsDragging(false);
        },
        [isDragging, list, activeGap]
    );

    const handleMouseOver = (index: number) => {
        if (!isDragging || !draggingDataRef.current) return;
        setActiveGap(index);
    };

    const handleMouseOut = () => {
        if (!isDragging) return;
        setActiveGap(-1);
    };

    // Effects

    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [handleMouseMove, handleMouseUp]);

    useEffect(() => {
        if (!draggingItemRef.current || !draggingDataRef.current) return;
        draggingItemRef.current.style.left = `${draggingDataRef.current.rect.x}px`;
        draggingItemRef.current.style.top = `${draggingDataRef.current.rect.y}px`;
        draggingItemRef.current.style.width = `${draggingDataRef.current.rect.width}px`;
    }, [isDragging]);

    useEffect(() => {
        setCursor(isDragging ? 'move' : 'auto');
        return () => setCursor('auto');
    }, [isDragging]);

    // Layout

    const Gap = ({ index, isLast }: { index: number; isLast?: boolean }) => {
        const isActive = activeGap === index;

        const handlers = {
            onMouseOver: () => handleMouseOver(index),
            onMouseOut: handleMouseOut
        };

        return <div className={cn(style.gap, isActive && style.active, isLast && style.last)} {...handlers}></div>;
    };

    return (
        <div className={style.list} onMouseOut={handleMouseOut}>
            {list.map((item, index) => {
                const isDraggingThis = Boolean(draggingDataRef.current && isDragging && draggingDataRef.current.index === index);

                const handlers = {
                    onMouseDown: (event: React.MouseEvent) => startDragging(event, index)
                };

                return (
                    <Fragment key={index}>
                        <div className={cn(style.slot)} {...handlers}>
                            <Gap index={index} />
                            <div className={cn(style.item, isDraggingThis && style.dragging)}>
                                <Item data={item} dragging={isDraggingThis} swapping={false} index={index} />
                            </div>
                            {isDraggingThis ? (
                                <div ref={draggingItemRef} className={cn(style.item, style.ghost)}>
                                    <Item data={item} dragging={true} swapping={false} index={index} />
                                </div>
                            ) : null}
                            <Gap index={index + 1} isLast={true} />
                        </div>
                    </Fragment>
                );
            })}
        </div>
    );
}
