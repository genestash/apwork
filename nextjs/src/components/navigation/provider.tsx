'use client';

import { createContext, useContext, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type Context = {
    reloadPage: () => void;
    openPage: (href: string) => void;
    setLoading: (state: boolean) => void;
};

type Props = {
    minDelay?: number;
    children: React.ReactNode;
};

const LoadingContext = createContext<Context | null>(null);

export function useLoading() {
    const context = useContext(LoadingContext);

    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }

    return context;
}

export function LoadingProvider({ minDelay = 0, children }: Props) {
    const [reloadKey, setReloadKey] = useState(0);
    const loadingStart = useRef(0);
    const router = useRouter();

    const setLoading = useCallback(
        (state: boolean) => {
            if (state) {
                loadingStart.current = Date.now();
                document.body.setAttribute('data-loading', 'true');
                return;
            }

            if (!loadingStart.current) {
                document.body.setAttribute('data-loading', 'false');
                return;
            }

            const delay = Math.max(0, minDelay - (Date.now() - loadingStart.current));

            setTimeout(() => {
                document.body.setAttribute('data-loading', 'false');
            }, delay);
        },
        [minDelay]
    );

    const reloadPage = useCallback(() => {
        setLoading(true);
        setReloadKey((v) => v + 1);
        window.scrollTo(0, 0);
    }, [setLoading]);

    const openPage = useCallback(
        (href: string) => {
            setLoading(true);
            router.push(href);
        },
        [setLoading, router]
    );

    return (
        <LoadingContext.Provider value={{ reloadPage, openPage, setLoading }} key={reloadKey}>
            {children}
        </LoadingContext.Provider>
    );
}
