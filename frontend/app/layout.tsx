import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OneLink Portfolio',
  description: 'Build your portfolio from GitHub',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
