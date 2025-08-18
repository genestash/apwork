import { useRef, useEffect, useCallback } from 'react';

export function useBlobUrl() {
    const urlsRef = useRef<string[]>([]);

    useEffect(() => {
        const urls = urlsRef.current;
        return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }, []);

    const newBlobUrl = useCallback((obj: Blob | MediaSource) => {
        const url = URL.createObjectURL(obj);
        urlsRef.current.push(url);
        return url;
    }, []);

    return newBlobUrl;
}
