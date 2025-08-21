'use client';

import { useState, useRef, useEffect } from 'react';
import { ApplicationItem } from '@/components/application';
import { ApplicationType } from '@/types/Application';
import style from './style.module.css';

type Props = {
    items?: ApplicationType[];
    min?: number;
};

export function useGridSize(itemsCount: number, itemWidth: number, gridGap: number) {
    const [cols, setCols] = useState(1);
    const [rows, setRows] = useState(1);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleResize() {
            if (!ref.current) return;
            const listWidth = ref.current.offsetWidth;
            const calcCols = Math.max(1, Math.floor((listWidth + gridGap) / (itemWidth + gridGap)));
            const calcRows = Math.ceil(itemsCount / calcCols);
            setCols(calcCols);
            setRows(calcRows);
        }

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [itemsCount, itemWidth, gridGap]);

    return { ref, cols, rows };
}

export function ApplicationList({ items = [], min = 0 }: Props) {
    const { ref, cols, rows } = useGridSize(Math.max(items.length, min), 148, 20);
    const ghostItems = new Array((cols + 2) * rows).fill(null);
    const invisibleItems = new Array(min - items.length).fill(null);

    return (
        <section className={style.list} ref={ref}>
            <div className={style.ghostList}>
                {ghostItems.map((_, index) => (
                    <div key={index} className={style.ghostItem}></div>
                ))}
            </div>
            {items.map((item) => (
                <ApplicationItem key={item.id} data={item} />
            ))}
            {invisibleItems.map((_, index) => (
                <div key={index} className={style.invisibleItem}></div>
            ))}
        </section>
    );
}
