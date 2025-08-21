'use client';

import { Link } from '@/components/navigation';
import { ApplicationType } from '@/types/Application';
import style from './style.module.css';

type Props = {
    data: ApplicationType;
    empty?: boolean;
};

export function ApplicationItem({ data, empty }: Props) {
    if (empty) {
        return <div className={style.empty}></div>;
    }

    return (
        <Link href={`/${data.id}`} className={style.item}>
            <article>
                <div className={style.wrap}>
                    <div className={style.icon} style={{ backgroundImage: `url("${data.icon}")` }}></div>
                </div>
                <div className={style.wrap}>
                    <h2 className={style.name}>{data.name}</h2>
                </div>
            </article>
        </Link>
    );
}
