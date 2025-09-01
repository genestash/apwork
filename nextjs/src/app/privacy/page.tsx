import { Loaded } from '@/components/navigation';
import { Block } from '@/components/ui';
import style from './style.module.css';

export const metadata = {
    title: 'Privacy Policy',
    description: `Apwork's Privacy Policy explains how we collect and protect your data while you use our free online tools. Your privacy is important to us.`,

    alternates: {
        canonical: '/privacy'
    }
};

export default function Page() {
    return (
        <Block className={style.document}>
            <h1>Privacy Policy</h1>
            <div className={style.date}>Effective Date: 01.09.2025</div>

            <p>We respect your privacy and are committed to protecting your information. This Privacy Policy explains how we collect, use, and safeguard information when you visit our website.</p>

            <h2>1. Information We Collect</h2>
            <p>We do not collect personal information directly from you through forms, registrations, or account creation. However, we use Google Analytics to understand how visitors use our site. Google Analytics may collect:</p>
            <ul>
                <li>Pages you visit and actions you take on our site</li>
                <li>Your device type, browser, and operating system</li>
                <li>Your approximate geographic location (based on IP address)</li>
                <li>Date and time of your visit</li>
                <li>Referring website (if any)</li>
            </ul>
            <p>This information is provided to us in aggregated or anonymized form and is not used to personally identify individual visitors.</p>

            <h2>2. Legal Basis for Processing (GDPR)</h2>
            <p>
                Under the <em>General Data Protection Regulation (GDPR)</em>, we process this data on the basis of:
            </p>
            <ul>
                <li>Legitimate Interests — to improve our website, understand usage trends, and enhance user experience.</li>
            </ul>

            <h2>3. Cookies and Tracking</h2>
            <p>Google Analytics uses cookies and similar technologies to collect usage data. If you prefer not to be tracked by Google Analytics, you can disable cookies in your browser settings.</p>

            <h2>4. Google Analytics</h2>
            <p>We use Google Analytics, a web analytics service provided by Google LLC. Google may process data in the United States or other countries. For details, please refer to Google{`'`}s privacy documentation.</p>

            <h2>5. Data Retention</h2>
            <p>We retain Google Analytics data for 12 months, after which it is deleted or anonymized automatically according to our analytics configuration.</p>

            <h2>6. Your Rights</h2>
            <p>Depending on your location, you may have the following rights under GDPR and other privacy laws:</p>
            <ul>
                <li>Access — Request a copy of the data we hold about you.</li>
                <li>Correction — Request correction of inaccurate data.</li>
                <li>Deletion — Request deletion of your data.</li>
                <li>Restriction — Limit how we process your data.</li>
                <li>Objection — Object to our processing of your data.</li>
                <li>Data Portability — Request transfer of your data to another service.</li>
            </ul>
            <p>To exercise any of these rights, contact us. We may need to verify your identity before fulfilling requests.</p>

            <h2>7. International Data Transfers</h2>
            <p>If your data is transferred outside your country (for example, to Google servers in the United States), we will ensure appropriate safeguards are in place in accordance with applicable law.</p>

            <h2>8. External Links</h2>
            <p>Our website may contain links to other websites. We are not responsible for the privacy practices or content of those external sites. We recommend reviewing the privacy policies of any third-party sites you visit.</p>

            <h2>9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised effective date.</p>

            <h2>10. Contact Us</h2>
            <p>If you have questions about this Privacy Policy or how your data is handled, please contact us:</p>
            <ul>
                <li>Email: contact@apwork.co</li>
            </ul>
            <Loaded />
        </Block>
    );
}
