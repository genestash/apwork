'use client';

import { Link } from '@/components/navigation';
import { ApplicationType } from '@/types/Application';
import style from './style.module.css';

export function ApplicationItem({ data }: { data?: ApplicationType }) {
    if (!data) {
        return <div className={style.ghost}></div>;
    }

    return (
        <Link href={`/${data.id}`} className={style.item}>
            <div className={style.icon} style={{ backgroundImage: `url("${data.icon}")` }}></div>
            <div className={style.name}>
                <div className={style.text}>{data.name}</div>
            </div>
        </Link>
    );
}
