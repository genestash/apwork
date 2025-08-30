export async function grayscaleImage(blob: Blob): Promise<Blob | null> {
    return new Promise((resolve) => {
        const image = new Image();
        image.src = URL.createObjectURL(blob);

        image.onload = () => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d')!;

            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const gray = Math.round(data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11);

                data[i] = gray;
                data[i + 1] = gray;
                data[i + 2] = gray;
            }

            context.putImageData(imageData, 0, 0);

            canvas.toBlob(
                (bwBlob) => {
                    resolve(bwBlob || null);
                },
                'image/png',
                1.0
            );

            URL.revokeObjectURL(image.src);
        };
    });
}
