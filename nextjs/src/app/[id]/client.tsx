'use client';

import dynamic from 'next/dynamic';
import { ApplicationWindow } from '@/components/application';
import style from './style.module.css';
import type { ApplicationItemDto } from '@/types/Application';

function ClientPage({ data }: { data: ApplicationItemDto }) {
    const ApplicationComponent = dynamic<{ data: ApplicationItemDto }>(() => import('@/applications/' + data.id), {
        ssr: true,
        loading: () => null
    });

    return (
        <>
            <ApplicationWindow type={data.windowType}>
                <ApplicationComponent data={data} />
            </ApplicationWindow>
            <section className={style.wrap}>
                <div className={style.about}>
                    <div className={style.top}>
                        <h1 className={style.name}>{data.name}</h1>
                    </div>
                    <div className={style.description}>
                        <p>{data.description}</p>
                    </div>
                </div>
            </section>
        </>
    );
}

export { ClientPage };
