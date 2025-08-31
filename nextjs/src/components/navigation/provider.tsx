'use client';

import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Context

type Context = {
    reloadPage: () => void;
    loadPage: (href: string) => void;
    setLoading: (state: boolean) => void;
};

const LoadingContext = createContext<Context | null>(null);

export function useLoading() {
    const context = useContext(LoadingContext);

    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }

    return context;
}

// Provider

type Props = {
    minDelay?: number;
    children: React.ReactNode;
};

export function LoadingProvider({ minDelay = 0, children }: Props) {
    const [reloadKey, setReloadKey] = useState(0);
    const loadingStart = useRef(0);
    const router = useRouter();

    // Methods

    const setLoading = useCallback(
        (state: boolean) => {
            if (state) {
                loadingStart.current = Date.now();
                document.body.dataset.loading = 'true';
                return;
            }

            if (!loadingStart.current) {
                document.body.dataset.loading = 'false';
                return;
            }

            const delay = minDelay - (Date.now() - loadingStart.current);
            setTimeout(() => (document.body.dataset.loading = 'false'), delay);
        },
        [minDelay]
    );

    const reloadPage = useCallback(() => {
        setLoading(true);
        setReloadKey(Math.random());
        window.scrollTo(0, 0);
    }, [setLoading]);

    const loadPage = useCallback(
        (href: string) => {
            setLoading(true);
            router.push(href);
        },
        [setLoading, router]
    );

    // Effects

    useEffect(() => {
        const handlePopstate = () => {
            setLoading(true);
            setReloadKey(Math.random());
        };

        window.addEventListener('popstate', handlePopstate);
        return () => window.removeEventListener('popstate', handlePopstate);
    }, [setLoading]);

    // Layout

    return (
        <LoadingContext.Provider value={{ reloadPage, loadPage, setLoading }} key={reloadKey}>
            {children}
        </LoadingContext.Provider>
    );
}
