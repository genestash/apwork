import { useState, useRef, useId } from 'react';
import { Loaded } from '@/components/navigation';
import { useAutoFocus } from '@/hooks/useAutoFocus';
import style from './style.module.css';

function count(text: string) {
    const words = (text.match(/\S+/g) || []).length;
    const characters = text.length;
    return { words, characters };
}

export default function Application() {
    const [value, setValue] = useState('');
    const [data, setData] = useState(() => count(value));
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const textareaId = useId();

    useAutoFocus(textareaRef);

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = event.target.value;
        setValue(newValue);
        setData(count(newValue));
    };

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
                aria-label="Enter text to count words and characters"
                placeholder="Start typing or paste your text here..."
                onChange={handleInput}
            ></textarea>
            <Loaded />
        </div>
    );
}
