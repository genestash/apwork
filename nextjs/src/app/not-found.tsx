import { Loaded } from '@/components/navigation';
import { Block, Button } from '@/components/ui';
import style from './not-found.module.css';

export default function NotFound() {
    return (
        <Block className={style.block}>
            <h1>Error: Page not found</h1>
            <div className={style.image}></div>
            <Button color="blue" size="normal" href="/">
                Return to Apwork
            </Button>
            <Loaded />
        </Block>
    );
}
