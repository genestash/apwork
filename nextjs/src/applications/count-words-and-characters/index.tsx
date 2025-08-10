import { useState, useRef, useId, useEffect } from 'react';
import { Loaded } from '@/components/navigation';
import style from './style.module.css';

const snippet = `Colorado, a western U.S. state, has a diverse landscape of arid desert, river canyons and snow-covered Rocky Mountains, which are partly protected by Rocky Mountain National Park. Elsewhere, Mesa Verde National Park features Ancestral Puebloan cliff dwellings. Perched a mile above sea level, Denver, Colorado's capital and largest city, features a vibrant downtown area.`;

function count(text: string) {
    const words = (text.match(/\S+/g) || []).length;
    const characters = text.length;
    return { words, characters };
}

export default function Application() {
    const [value, setValue] = useState(snippet);
    const [data, setData] = useState(count(value));
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const textareaId = useId();

    useEffect(() => {
        if (!textareaRef.current) return;
        const length = textareaRef.current.value.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(length, length);
    }, []);

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = event.target.value;
        setValue(newValue);
        setData(count(newValue));
    };

    // throw new Error('test');

    return (
        <div className={style.wrap}>
            <div className={style.data}>
                <p>
                    <b>{data.words}</b> words
                </p>
                <p>
                    <b>{data.characters}</b> characters
                </p>
            </div>
            <textarea
                ref={textareaRef}
                id={textareaId}
                value={value}
                spellCheck={false}
                className={style.textarea}
                aria-label="Enter text"
                onChange={handleInput}
            ></textarea>
            <Loaded />
        </div>
    );
}
