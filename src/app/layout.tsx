import ClientProviders from '@/lib/ClientProviders';
import { Header } from '@/components';

import s from '@/components/layout/layout.module.scss';
import 'leaflet/dist/leaflet.css';
import './global.scss';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <Header />
          <main className={s.mainContent}>{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
