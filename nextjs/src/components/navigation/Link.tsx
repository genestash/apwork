'use client';

import { usePathname } from 'next/navigation';
import { useLoading } from './provider';
import { unselectAll } from '@/utils';

export function Link({ href, className, children, ...rest }: { href: string; className?: string; children: React.ReactNode }) {
    const { reloadPage, loadPage } = useLoading();
    const pathname = usePathname();

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        unselectAll();

        if (event.shiftKey || event.ctrlKey || event.metaKey) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (href === pathname) {
            reloadPage();
        } else {
            loadPage(href);
        }
    };

    return (
        <a href={href} onClick={handleClick} className={className} {...rest}>
            {children}
        </a>
    );
}
