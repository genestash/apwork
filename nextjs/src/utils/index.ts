export function setCursor(value: 'auto' | 'move') {
    document.body.dataset.cursor = value;
}

export function unselectAll() {
    const selection = window.getSelection();
    selection?.removeAllRanges();
}

export async function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

export function simulateProcessing(time: number) {
    const startTime = Date.now();

    return async function () {
        const timeLeft = time - (Date.now() - startTime);
        await sleep(timeLeft);
    };
}
