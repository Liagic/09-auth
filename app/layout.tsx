import type { Metadata } from 'next';

import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import { Roboto } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Home page',
  description:
    'A simple and convenient note-taking platform for creating, organizing, and storing your notes.',
  openGraph: {
    title: 'Home Page',
    description:
      'A simple and convenient note-taking platform for creating, organizing, and storing your notes.',
    siteName: 'NoteHub',
    url: 'https://08-zustand-two-snowy.vercel.app/',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub logo on a blue and green gradient background.',
      },
    ],
  },
};
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <TanStackProvider>
          <Header />
          {children}
          {modal}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
