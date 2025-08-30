'use client';

import { useState, useRef, useEffect } from 'react';
import { ApplicationItem } from '@/components/application';
import { ApplicationType } from '@/types/Application';
import style from './style.module.css';

export function useColumns(minItemWidth: number, gridGap: number) {
    const [columns, setColumns] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleResize() {
            if (!ref.current) return;
            const containerWidth = ref.current.offsetWidth;
            const count = Math.max(1, Math.floor((containerWidth + gridGap) / (minItemWidth + gridGap)));
            setColumns(count);
        }

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [minItemWidth, gridGap]);

    return { ref, columns };
}

export function ApplicationList({ items = [] }: { items: ApplicationType[] }) {
    const { ref, columns } = useColumns(148, 20);
    const remainder = columns ? items.length % columns : 0;
    const ghostCount = remainder === 0 ? 0 : columns - remainder;
    const ghostItems = new Array(ghostCount).fill(null);

    return (
        <section ref={ref} className={style.list}>
            {items.map((item) => (
                <ApplicationItem key={item.id} data={item} />
            ))}
            {ghostItems.map((_, index) => (
                <ApplicationItem key={index} />
            ))}
        </section>
    );
}
