import { useState, useEffect } from 'react';

/**
 * @returns new key on resize
 */
export function useWindowResize() {
    const [key, setKey] = useState(0);

    useEffect(() => {
        const handleResize = () => setKey(Math.random());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return key;
}
