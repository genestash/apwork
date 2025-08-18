import { MetadataRoute } from 'next';
import { list } from '@/applications';
import { ApplicationType } from '@/types/Application';

export default function sitemap() {
    const result: MetadataRoute.Sitemap = [];

    for (const application of list as ApplicationType[]) {
        result.push({
            url: `https://apwork.co/${application.id}`,
            changeFrequency: 'weekly'
        });
    }

    return result;
}
