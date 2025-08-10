import { notFound } from 'next/navigation';
import { ClientPage } from './client';
import { map } from '@/applications';

import type { ApplicationItemDto } from '@/types/Application';

interface Context {
    params: Promise<{ id: string }>;
}

async function getApplication(id: string): Promise<ApplicationItemDto | null> {
    return map[id] || null;
}

export async function generateMetadata(context: Context) {
    const { id } = await context.params;
    const data = await getApplication(id);
    if (!data) return;

    return {
        title: data.name,
        description: data.description,
        alternates: {
            canonical: `https://apwork.co/${data.id}`
        }
    };
}

export default async function Page(context: Context) {
    const { id } = await context.params;
    const data = await getApplication(id);

    if (!data) {
        notFound();
    }

    return <ClientPage data={data} />;
}
