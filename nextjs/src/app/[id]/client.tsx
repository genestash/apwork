'use client';

import dynamic from 'next/dynamic';
import { ApplicationWindow } from '@/components/application';
import { ApplicationType } from '@/types/Application';
import style from './style.module.css';

function ClientPage({ data }: { data: ApplicationType }) {
    const Application = dynamic<{ data: ApplicationType }>(() => import(`@/applications/${data.id}`), {
        ssr: true,
        loading: () => null
    });

    const Instruction = data.includeInstruction
        ? dynamic(() => import(`@/applications/${data.id}/instruction`), { ssr: true, loading: () => null })
        : null;

    return (
        <>
            <ApplicationWindow type={data.windowType}>
                <Application data={data} />
            </ApplicationWindow>
            <section className={style.wrap}>
                <div className={style.about}>
                    <div className={style.top}>
                        <h1 className={style.name}>{data.name}</h1>
                    </div>
                    <div className={style.description}>{Instruction ? <Instruction /> : <p>{data.description}</p>}</div>
                </div>
            </section>
        </>
    );
}

export { ClientPage };
