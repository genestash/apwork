'use client';

import { useMemo } from 'react';
import { ApplicationItem } from '@/components/application';
import { ApplicationType, ApplicationItemType } from '@/types/Application';
import style from './style.module.css';

type Props = {
    items?: ApplicationType[];
    min?: number;
    max?: number;
    heading?: ApplicationItemType['heading'];
};

function buildList(items: ApplicationType[] = [], min = -1, max = -1) {
    const list: ApplicationItemType[] = [];

    for (let i = 0; i < items.length; i += 1) {
        if (max !== -1 && list.length == max) break;
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
