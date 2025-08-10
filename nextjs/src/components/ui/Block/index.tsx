import style from './style.module.css';

type Props = {
    className?: string;
    children?: React.ReactNode;
};

export function Block({ className, children }: Props) {
    return (
        <div className={style.wrap}>
            <div className={[style.block, className].join(' ')}>{children}</div>
        </div>
    );
}
