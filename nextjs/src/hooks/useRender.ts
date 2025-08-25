import { useState } from 'react';

/**
 * @returns forceRender function
 */
export function useRender(): VoidFunction {
    const [, setKey] = useState(0);
    return () => setKey(Math.random());
}
