'use client';

import { Block, Button } from '@/components/ui';
import style from './global-error.module.css';
import './global.css';

export default function GlobalError() {
    return (
        <html>
            <body>
                <div className={style.top}></div>
                <div className={style.main}>
                    <Block className={style.block}>
                        <h1>Error: Something went wrong</h1>
                        <div className={style.image}></div>
                        <Button color="blue" size="normal" href="/" standardLink={true}>
                            Return to Apwork
                        </Button>
                    </Block>
                </div>
                <div className={style.bottom}></div>
            </body>
        </html>
    );
}
