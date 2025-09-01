import { MetadataRoute } from 'next';
import { list } from '@/applications';
import { ApplicationType } from '@/types/Application';

export default function sitemap() {
    const result: MetadataRoute.Sitemap = [];

    result.push(
        {
            url: 'https://apwork.co',
            changeFrequency: 'daily'
        },
        {
            url: 'https://apwork.co/terms',
            changeFrequency: 'monthly'
        },
        {
            url: 'https://apwork.co/privacy',
            changeFrequency: 'monthly'
        },
        {
            url: 'https://apwork.co/contact',
            changeFrequency: 'monthly'
        }
    );

    for (const application of list as ApplicationType[]) {
        result.push({
            url: `https://apwork.co/${application.id}`,
            changeFrequency: 'weekly'
        });
    }

    return result;
}
