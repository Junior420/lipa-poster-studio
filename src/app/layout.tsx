import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lipa Poster Studio',
  description: 'Modern, shareable payment posters with copyable Lipa numbers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body">{children}</body>
    </html>
  );
}
