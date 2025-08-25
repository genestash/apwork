import { PDFDocument, degrees } from 'pdf-lib';

type Input = {
    file: File;
    rotation: number;
};

export async function mergePdfs(inputs: Input[]): Promise<Blob> {
    const result = await PDFDocument.create();

    for (const input of inputs) {
        const buffer = await input.file.arrayBuffer();
        const pdf = await PDFDocument.load(buffer);
        const copiedPages = await result.copyPages(pdf, pdf.getPageIndices());

        copiedPages.forEach((page) => {
            page.setRotation(degrees(input.rotation ?? 0));
            result.addPage(page);
        });
    }

    const bytes = new Uint8Array(await result.save());
    return new Blob([bytes], { type: 'application/pdf' });
}
