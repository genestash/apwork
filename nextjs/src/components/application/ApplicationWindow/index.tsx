'use client';

import style from './style.module.css';
import { ApplicationWindowSize, ApplicationWindowRatio } from '@/types/Application';

type Props = {
    size: ApplicationWindowSize;
    ratio?: ApplicationWindowRatio;
    className?: string;
    children: React.ReactNode;
};

export function ApplicationWindow({ size, ratio, className, children }: Props) {
    return (
        <section className={style.wrap}>
            <div className={cn(style.block, className)} data-size={size} data-ratio={ratio}>
                {children}
            </div>
        </section>
    );
}
