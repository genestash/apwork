export function unselectAll() {
    const selection = window.getSelection();
    selection?.removeAllRanges();
}

export async function sleep(time: number = 0) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

export function uploadFile(accept?: string, multiple = false): Promise<FileList | null> {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        if (accept) input.accept = accept;
        if (multiple) input.multiple = true;

        input.style.display = 'none';
        document.body.appendChild(input);

        input.onchange = () => {
            resolve(input.files && input.files.length > 0 ? input.files : null);
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
