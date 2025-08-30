import { Loaded } from '@/components/navigation';
import { Block } from '@/components/ui';
import { ApplicationList } from '@/components/application';
import { list } from '@/applications';
import style from './page.module.css';

export const metadata = {
    title: 'Apwork',
    description: `Apwork offers a collection of simple, useful online applications designed to make everyday tasks easier. Access free tools instantly - no accounts, no payments, just quick solutions.`
};

export default function Page() {
    return (
        <Block className={style.block}>
            <h1 className={style.title}>Simple apps to make your life easier</h1>
            <p className={style.note}>Free, online, secure, no account required.</p>
            <ApplicationList items={list} />
            <Loaded />
        </Block>
    );
}
