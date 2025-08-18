'use client';

import style from './style.module.css';

type Props = {
    size?: 'small' | 'logo';
    color?: keyof typeof colors;
    className?: string;
};

const colors = {
    black: '#000',
    white: '#fff',
    blue: 'var(--blue)'
} as const;

export function Loader({ size = 'small', color = 'black', className }: Props) {
    return (
        <div className={cn(style.wrap, style[size], className)}>
            <div className={style.circle} style={{ '--color': colors[color] } as React.CSSProperties}></div>
        </div>
    );
}
