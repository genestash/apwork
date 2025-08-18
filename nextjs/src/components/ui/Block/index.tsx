import style from './style.module.css';

type Props = {
    className?: string;
    children?: React.ReactNode;
};

export function Block({ className, children }: Props) {
    return (
        <div className={style.wrap}>
            <div className={cn(style.block, className)}>{children}</div>
        </div>
    );
}
