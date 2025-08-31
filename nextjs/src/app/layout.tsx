import { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { LoadingProvider, Link } from '@/components/navigation';
import { Loader } from '@/components/ui';
import style from './layout.module.css';
import './global.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    icons: {
        icon: [
            { url: '/icons/favicon-48.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
            { url: '/icons/icon-96.png', sizes: '96x96', type: 'image/png' },
            { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            { url: '/icons/icon.svg', type: 'image/svg+xml' }
        ],
        shortcut: '/icons/favicon-48.ico',
        apple: '/icons/icon-512.png'
    }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <GoogleAnalytics gaId="G-CKCYSP1KVK" />
            </head>
            <body data-loading="true">
                <LoadingProvider minDelay={500}>
                    <header className={style.wrap}>
                        <div className={style.top}>
                            <Link href="/" className={style.logo}>
                                <Loader className={style.loader} size="logo" color="black" />
                                Apwork
                            </Link>
                        </div>
                    </header>
                    <main className={style.main}>{children}</main>
                    <footer className={style.wrap}>
                        <div className={style.bottom}>
                            <p className={style.copyright}>© {String(new Date().getFullYear())} Apwork</p>
                            <nav className={style.menu}>
                                <ul className="reset">
                                    <li>
                                        <Link href="/terms">Terms</Link>
                                    </li>
                                    <li>
                                        <Link href="/privacy">Privacy</Link>
                                    </li>
                                    <li>
                                        <Link href="/contact">Contact</Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </footer>
                </LoadingProvider>
            </body>
        </html>
    );
}
