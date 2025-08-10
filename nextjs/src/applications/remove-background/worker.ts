import { preload, removeBackground, Config } from '@imgly/background-removal';

const config: Config = {
    // publicPath: `${process.env.NEXT_PUBLIC_URL}/applications/remove-background/dist/resources.json`,
    model: 'isnet_fp16',
    device: 'cpu'
};

preload(config).then(() => {
    postMessage({ ready: true });
});

addEventListener('message', async (event) => {
    const file = event.data;

    try {
        const result = await removeBackground(file, config);
        postMessage({ result });
    } catch (error) {
        postMessage({ error });
    }
});
