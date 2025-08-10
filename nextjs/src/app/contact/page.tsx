import { Loaded } from '@/components/navigation';
import { Block } from '@/components/ui';
import style from './style.module.css';

export const metadata = {
    title: 'Contact Us',
    description:
        'Get in touch with Apwork for questions, suggestions, or project collaboration. Contact us easily via email at contact@apwork.co'
};

export default function Page() {
    return (
        <Block className={style.document}>
            <h1>Contact Us</h1>
            <p>
                If you have any questions, suggestions, or would like to help the project, simply contact us directly at
                contact@apwork.co. We do our best to respond to all messages within a few business days. Response times may be
                longer during weekends or holidays.
            </p>
            <Loaded />
        </Block>
    );
}
