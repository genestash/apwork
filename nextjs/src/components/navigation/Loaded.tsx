'use client';

import { useEffect } from 'react';
import { useLoading } from './provider';

export function Loaded() {
    const { setLoading } = useLoading();
    useEffect(() => setLoading(false), [setLoading]);
    return null;
}
