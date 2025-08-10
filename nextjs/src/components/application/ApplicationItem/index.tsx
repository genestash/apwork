'use client';

import { Link } from '@/components/navigation';
import style from './style.module.css';

import type { ApplicationItemDto } from '@/types/Application';

export function ApplicationItem({ data }: { data: ApplicationItemDto }) {
    if (data.empty || !data.id) {
        return <div className={style.empty}></div>;
    }

    const Heading = data.heading || 'h1';

    return (
        <Link href={'/' + data.id} className={style.item}>
            <article>
                <div className={style.wrap}>
                    {data.converter ? (
                        <div className={style.converter}>
                            <div className={[style.file, style.from].join(' ')}>
                                <div className={style.text}>{data.converter.from.slice(0, 4)}</div>
                            </div>
                            <div className={[style.file, style.to].join(' ')}>
                                <div className={style.text}>{data.converter.to.slice(0, 4)}</div>
                            </div>
                        </div>
                    ) : (
                        <div className={style.icon} style={{ backgroundImage: `url("${data.icon}")` }}></div>
                    )}
                </div>
                <div className={style.wrap}>
                    <Heading className={style.name}>{data.name}</Heading>
                </div>
            </article>
        </Link>
    );
}
