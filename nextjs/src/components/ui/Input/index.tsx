import style from './style.module.css';

type Props = {
    className?: string;
    value?: string | number;
    square?: boolean;
};

export function Input({ className, value = '', square, ...rest }: Props) {
    return <input className={cn(style.wrap, className, square ? style.square : '')} value={value} {...rest} />;
}
