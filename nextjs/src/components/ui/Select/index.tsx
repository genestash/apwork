'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './style.module.css';

type Props = {
    options: Option[];
    label?: string;
    placeholder?: string;
    onChange: (value: string) => void;
    className: string;
    defaultOption?: Option;
    direction?: 'up' | 'down';
};

export type Option = {
    value: string;
    label: string;
};

export function Select({
    options,
    label,
    placeholder = 'Select...',
    onChange,
    className,
    defaultOption,
    direction = 'down'
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<Option | null>(defaultOption || null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (option: Option) => {
        setSelected(option);
        setIsOpen(false);
        onChange(option.value);
    };

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={cn(styles.button, className)} onClick={toggleDropdown}>
                <label className={styles.label}>{label}</label>:
                <span className={styles.selected}>{selected ? selected.label : placeholder}</span>
            </div>

            {isOpen && (
                <ul className={cn(styles.dropdown, styles[direction])}>
                    {options.map((option) => (
                        <li
                            key={option.value}
                            className={cn(styles.option, selected?.value === option.value ? styles.selected : '')}
                            onClick={() => handleSelect(option)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
