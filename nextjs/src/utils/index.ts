export function unselectAll() {
    const selection = window.getSelection();
    selection?.removeAllRanges();
}

export function limitFileImageSize(file: File, limit: number): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const image = new Image();

            image.onload = () => {
                const scale = Math.min(limit / image.width, limit / image.height, 1);
                const canvas = document.createElement('canvas');
                canvas.width = Math.round(image.width * scale);
                canvas.height = Math.round(image.height * scale);

                const context = canvas.getContext('2d');

                if (!context) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                context.drawImage(image, 0, 0, canvas.width, canvas.height);

                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Failed to create blob from canvas'));
                        return;
                    }

                    const newFile = new File([blob], file.name, { type: 'image/png' });
                    resolve(newFile);
                }, 'image/png');
            };

            image.onerror = () => reject(new Error('Failed to load image'));
            image.src = reader.result as string;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

export function convertFileImage(file: File, targetFormat: 'png' | 'jpeg' | 'webp', quality: number = 1): Promise<File | null> {
    const url = URL.createObjectURL(file);

    return new Promise((resolve) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';

        image.onload = () => {
            URL.revokeObjectURL(url);

            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;

            const context = canvas.getContext('2d');

            if (!context) {
                resolve(null);
                return;
            }

            const mimeType = `image/${targetFormat}`;
            context.drawImage(image, 0, 0);

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
