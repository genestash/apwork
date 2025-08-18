import { GoogleAnalytics } from '@next/third-parties/google';
import { LoadingProvider, Link } from '@/components/navigation';
import { Loader } from '@/components/ui';
import style from './layout.module.css';
import './global.css';

export const dynamic = 'force-dynamic';

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
