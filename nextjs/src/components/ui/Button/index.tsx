'use client';

import { Link } from '@/components/navigation';
import { Loader } from '@/components/ui';
import style from './style.module.css';

type Props = {
    size?: 'small' | 'normal';
    color?: 'ghost' | 'white' | 'blue';
    disable?: boolean;
    loading?: boolean;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
    href?: string;
    standardLink?: boolean;
    src?: string;
    children: React.ReactNode;
};

export function Button(props: Props) {
    const {
        size = 'normal',
        color = 'white',
        loading,
        disable,
        className,
        href,
        standardLink,
        src,
        onClick,
        children,
        ...rest
    } = props;

    const styles = [
        style.button,
        style[size],
        style[color],
        loading ? style.loading : '',
        disable ? style.disable : '',
        className
    ].join(' ');

    const loader = <>{loading ? <Loader size="small" className={style.loader} /> : null}</>;

    if (href && standardLink) {
        return (
            <a className={styles} href={href} {...rest}>
                {loader}
                {children}
            </a>
        );
    }

    if (href) {
        return (
            <Link className={styles} href={href} {...rest}>
                {loader}
                {children}
            </Link>
        );
    }

    if (src) {
        return (
            <div className={styles} onClick={onClick} {...rest}>
                <img src={src} alt="" />
                {loader}
                {children}
            </div>
        );
    }

    return (
        <button className={styles} onClick={onClick} {...rest}>
            {loader}
            {children}
        </button>
    );
}
