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
            <article>
                <div className={style.icon} style={{ backgroundImage: `url("${data.icon}")` }}></div>
                <div className={style.name}>
                    <h2 className={style.text}>{data.name}</h2>
                </div>
            </article>
        </Link>
    );
}
