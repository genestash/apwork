import { list } from '@/applications';
import { ApplicationItemDto } from '@/types/Application';
import { MetadataRoute } from 'next';

export default function sitemap() {
    const result: MetadataRoute.Sitemap = [];

    for (const application of list as ApplicationItemDto[]) {
        if (application.hide) continue;

        result.push({
            url: `https://apwork.co/${application.id}`,
            changeFrequency: 'weekly'
        });
    }

    return result;
}
