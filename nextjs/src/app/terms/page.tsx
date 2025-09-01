import { Loaded } from '@/components/navigation';
import { Block } from '@/components/ui';
import style from './style.module.css';

export const metadata = {
    title: 'Terms of Use',
    description: 'Read the Terms of Use for Apwork — the free online tool website offering useful apps. Learn about your rights, usage rules, and disclaimers.',

    alternates: {
        canonical: '/terms'
    }
};

export default function Page() {
    return (
        <Block className={style.document}>
            <h1>Terms of Use</h1>
            <div className={style.date}>Effective Date: 01.09.2025</div>

            <p>Welcome to Apwork. By accessing or using our website, you agree to these Terms of Use. If you do not agree with these Terms, please do not use the website.</p>

            <h2>1. Service Provided “As Is”</h2>
            <p>
                Apwork provides small, useful online applications and tools for general use. The service is provided <em>“as is”</em> and <em>“as available”</em>, without warranties of any kind, either express or implied. We do not warrant that the site
                will be uninterrupted, error-free, or meet your expectations.
            </p>

            <h2>2. Intellectual Property</h2>
            <p>
                All content on Apwork — including but not limited to applications, tools, text, images, designs, and code — is owned by Apwork and protected by intellectual property laws. You may use the tools for their intended purpose, but you may not
                copy, reproduce, distribute, publicly display, create derivative works, or otherwise exploit our content without prior written permission from Apwork.
            </p>

            <h2>3. Acceptable Use</h2>
            <p>When using Apwork you agree not to:</p>
            <ul>
                <li>Use the site for any unlawful, harmful, or fraudulent purpose;</li>
                <li>Attempt to interfere with, damage, or disrupt the operation of the site or its servers;</li>
                <li>Reverse engineer, decompile, disassemble, or attempt to extract the source code of any applications or tools on the site;</li>
                <li>Attempt to gain unauthorized access to any part of the site or its systems.</li>
            </ul>

            <h2>4. No Accounts or User Content</h2>
            <p>Apwork does not require or support user accounts. There is no feature for users to post or upload content on the site.</p>

            <h2>5. External Links</h2>
            <p>The site may contain links to third-party websites or services. Those links are provided for convenience only. Apwork does not endorse and is not responsible for the content, privacy practices, or terms of such third-party sites.</p>

            <h2>6. No Payments or Subscriptions</h2>
            <p>There are currently no payments, subscriptions, or paid features on Apwork.</p>

            <h2>7. Disclaimer of Warranties</h2>
            <p>
                To the fullest extent permitted by law, Apwork disclaims all warranties, whether express, implied, statutory, or otherwise, including any implied warranties of merchantability, fitness for a particular purpose, accuracy, or
                non-infringement.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
                To the maximum extent permitted by applicable law, Apwork and its owners, officers, employees, agents, suppliers, and licensors will not be liable for any indirect, incidental, special, consequential, or exemplary damages arising out of or
                in connection with your use of (or inability to use) the site, even if advised of the possibility of such damages. In jurisdictions that do not allow limitation of liability for certain damages, liability shall be limited to the greatest
                extent permitted by law.
            </p>

            <h2>9. Governing Law & Dispute Resolution</h2>
            <p>
                These Terms are intended to be universal; however, they will be governed by the laws of the jurisdiction in which Apwork is established, to the extent permitted by applicable law. Any disputes arising from or related to these Terms or your
                use of the site will be subject to the exclusive jurisdiction of the courts located in that jurisdiction, except where mandatory law provides otherwise.
            </p>

            <h2>10. Changes to These Terms</h2>
            <p>
                We may modify or update these Terms of Use at any time, at our sole discretion. Any changes will be posted on this page with a revised effective date. Continued use of the site after such changes constitutes acceptance of the updated Terms.
            </p>

            <h2>11. Relationship to Privacy Policy</h2>
            <p>Our Privacy Policy explains how we collect and process information when you visit Apwork. By using the site you also accept the terms of the Privacy Policy.</p>

            <h2>12. Contact</h2>
            <p>If you have questions about these Terms of Use, please contact us:</p>
            <ul>
                <li>Email: contact@apwork.co</li>
            </ul>
            <Loaded />
        </Block>
    );
}
