'use client';

import style from './style.module.css';
import type { ApplicationWindowType } from '@/types/Application';

type Props = {
    type?: ApplicationWindowType;
    className?: string;
    children: React.ReactNode;
};

export function ApplicationWindow({ type = 'standard', className, children }: Props) {
    return (
        <section className={style.wrap}>
            <div className={[style.block, style[type], className].join(' ')}>{children}</div>
        </section>
    );
}
