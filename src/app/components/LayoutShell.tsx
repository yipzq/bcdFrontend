'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Only hide header on /admin/dashboard
  const hideHeader = pathname === '/admin/dashboard';

  return (
    <>
      {!hideHeader && <Header />}
      <main className="min-h-screen">{children}</main>
      {!hideHeader && <Footer />}
    </>
  );
}
