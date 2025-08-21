import style from './style.module.css';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    className?: string;
    value?: string | number;
    units?: string;
};

export function Input({ className, value = '', units, ...rest }: Props) {
    return (
        <div className={cn(style.wrap, className)}>
            <input className={style.input} value={value} spellCheck={false} autoComplete="off" {...rest} />
            {units ? <b className={style.units}>{units}</b> : null}
        </div>
    );
}
