import { ApplicationType } from '@/types/Application';

// List

const list: ApplicationType[] = [
    {
        id: 'crop-image',
        name: 'Crop Image',
        icon: '/icons/crop-image.webp',
        description: `Crop your images online with ease. Choose from freeform cropping, perfect squares, circles, or custom aspect ratios. Simply upload your photo, adjust the crop to your needs, and download instantly.`,
        windowSize: 'max'
    },

    {
        id: 'webp-to-png-converter',
        name: 'WEBP to PNG Converter',
        icon: '/icons/webp-to-png-converter.webp',
        description:
            "Easily convert your WEBP images to high-quality PNG format with this free online tool. Whether you're a designer, developer, or just need a quick format change, our converter ensures fast and accurate results without losing image quality.",
        windowSize: 'mid'
    },
    {
        id: 'count-words-and-characters',
        name: 'Count Words and Characters',
        icon: '/icons/count-words-and-characters.webp',
        description: `This tool helps you quickly see how many words and characters are in any text you enter. It's perfect for tracking your writing length in real time. The clean and responsive interface makes text editing effortless and convenient.`,
        windowSize: 'max',
        windowRatio: '1.5'
    },
    {
        id: 'make-image-black-and-white',
        name: 'Make Image Black and White',
        icon: '/icons/make-image-black-and-white.webp',
        description: `Convert any image to black and white instantly with this simple tool. Upload your photo to get a clean grayscale version for a classic look or printing.`,
        windowSize: 'max'
    },

    {
        id: 'merge-pdf',
        name: 'Merge PDF',
        icon: '/icons/merge-pdf.webp',
        description: `An easy-to-use PDF Merge app that quickly combines multiple PDFs into one, with fast processing, secure handling, and a clean interface.`,
        windowSize: 'max',
        windowRatio: '1.5'
    },
    {
        id: 'margin-calculator',
        name: 'Margin Calculator',
        icon: '/icons/margin-calculator.webp',
        description: `Free Margin Calculator to quickly find profit margin, markup, cost, and price. Helps business owners, entrepreneurs, and online sellers make smarter pricing decisions and boost profitability.`,
        windowSize: 'min'
    }
];

// Map

const map: Record<string, ApplicationType> = {};

for (const application of list) {
    map[application.id] = application;
}

// Export

export { list, map };
