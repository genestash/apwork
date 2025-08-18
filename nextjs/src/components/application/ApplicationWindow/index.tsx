'use client';

import style from './style.module.css';
import { ApplicationWindowType } from '@/types/Application';

type Props = {
    type: ApplicationWindowType;
    className?: string;
    children: React.ReactNode;
};

export function ApplicationWindow({ type, className, children }: Props) {
    return (
        <section className={style.wrap}>
            <div className={cn(style.block, style[type], className)}>{children}</div>
        </section>
    );
}
