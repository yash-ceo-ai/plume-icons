import type { ReactNode } from 'react';

export const metadata = { title: 'Plume Icons in Next.js' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ font: '14px system-ui', background: '#121110', color: '#ecebe9', margin: 24 }}>{children}</body>
    </html>
  );
}
