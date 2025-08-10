import { ApplicationItemDto } from '@/types/Application';

// List

const list: ApplicationItemDto[] = [
    {
        id: 'remove-background',
        name: 'Remove Background',
        description:
            'This application allows you to quickly remove the background from any image using AI. Simply upload a photo, and the tool will generate a transparent version in seconds. Ideal for profile pictures, product images, or creative projects.',
        icon: '/icons/remove-background.webp'
    },
    {
        id: 'webp-to-png-converter',
        name: 'WEBP to PNG Converter',
        description:
            "Easily convert your WEBP images to high-quality PNG format with this free online tool. Whether you're a designer, developer, or just need a quick format change, our converter ensures fast and accurate results without losing image quality.",
        windowType: 'small',
        converter: { from: 'WEBP', to: 'PNG' }
    },
    {
        id: 'count-words-and-characters',
        name: 'Count Words and Characters',
        description: `This tool helps you quickly see how many words and characters are in any text you enter. It's perfect for tracking your writing length in real time. The clean and responsive interface makes text editing effortless and convenient.`,
        windowType: 'card',
        icon: '/icons/count-words-and-characters.webp'
    }
];

// Map

const map: Record<string, ApplicationItemDto> = {};

for (const application of list) {
    map[application.id!] = application;
}

// Export

export { list, map };
