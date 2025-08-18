'use client';

import { Link } from '@/components/navigation';
import { ApplicationItemType } from '@/types/Application';
import style from './style.module.css';

export function ApplicationItem({ data }: { data: ApplicationItemType }) {
    if (data.empty || !data.id) {
        return <div className={style.empty}></div>;
    }

    const Heading = data.heading || 'h1';

    return (
        <Link href={'/' + data.id} className={style.item}>
            <article>
                <div className={style.wrap}>
                    <div className={style.icon} style={{ backgroundImage: `url("${data.icon}")` }}></div>
                </div>
                <div className={style.wrap}>
                    <Heading className={style.name}>{data.name}</Heading>
                </div>
            </article>
        </Link>
    );
}
