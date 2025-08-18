import { useEffect } from 'react';

export function useAutoFocus(inputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>) {
    useEffect(() => {
        if (!inputRef.current) return;
        const input = inputRef.current;
        const length = input.value.length;
        input.focus();
        input.setSelectionRange(length, length);
    }, [inputRef]);
}
