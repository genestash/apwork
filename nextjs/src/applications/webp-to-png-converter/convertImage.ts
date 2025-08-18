export function convertImage(file: File, targetFormat: 'png' | 'jpeg' | 'webp', quality: number = 1): Promise<File | null> {
    const url = URL.createObjectURL(file);

    return new Promise((resolve) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';

        image.onload = () => {
            URL.revokeObjectURL(url);

            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;

            const context = canvas.getContext('2d')!;
            context.drawImage(image, 0, 0);
            const mimeType = `image/${targetFormat}`;

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        resolve(null);
                        return;
                    }

                    const newFile = new File([blob], file.name.replace(/\.\w+$/, `.${targetFormat}`), { type: mimeType });
                    resolve(newFile);
                },
                mimeType,
                quality
            );
        };

        image.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(null);
        };

        image.src = url;
    });
}
