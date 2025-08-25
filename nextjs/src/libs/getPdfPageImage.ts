export async function getPdfPageImage(file: File, pageNumber: number = 1): Promise<Blob | null> {
    if (typeof window === 'undefined') return null;

    const { version, GlobalWorkerOptions, getDocument } = await import('pdfjs-dist');
    const worker = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
    const wasm = `https://unpkg.com/pdfjs-dist@${version}/wasm/`;
    GlobalWorkerOptions.workerSrc = worker;

    const buffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: buffer, wasmUrl: wasm }).promise;
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext('2d')!;
    await page.render({ canvasContext: context, canvas, viewport }).promise;

    return new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png');
    });
}
