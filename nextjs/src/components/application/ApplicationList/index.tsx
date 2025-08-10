'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import style from './style.module.css';
import type { ApplicationItemDto } from '@/types/Application';

type Props = {
    items?: ApplicationItemDto[];
    min?: number;
    max?: number;
    heading?: ApplicationItemDto['heading'];
};

const ApplicationItem = dynamic(() => import('@/components/application').then((module) => module.ApplicationItem), {
    loading: () => null,
    ssr: true
});

function buildList(items: ApplicationItemDto[] = [], min = -1, max = -1) {
    const list: ApplicationItemDto[] = [];

    for (let i = 0; i < items.length; i += 1) {
        if (max !== -1 && list.length == max) break;
        if (items[i].hide) continue;
        list.push(items[i]);
    }

    const leftToAdd = min === -1 ? 0 : min - list.length;

    for (let i = 0; i < leftToAdd; i += 1) {
        list.push({ id: String(Math.random()), empty: true });
    }

    return list;
}

export function ApplicationList({ items, min, max, heading = 'h1' }: Props) {
    const list = useMemo(() => buildList(items, min, max), [items, min, max]);

    return (
        <section className={style.list}>
            {list.map((item) => {
                item.heading = heading;
                return <ApplicationItem key={item.id} data={item} />;
            })}
        </section>
    );
}
