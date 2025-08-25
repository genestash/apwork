export function uploadFile(accept: string, multiple: boolean = false): Promise<File[]> {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.multiple = multiple;

        input.style.display = 'none';
        document.body.appendChild(input);

        input.onchange = () => {
            const files = input.files ? Array.from(input.files) : [];
            resolve(files);
            document.body.removeChild(input);
        };

        input.click();
    });
}

export function downloadFile(url: string, name: string) {
    if (!url || !name) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
