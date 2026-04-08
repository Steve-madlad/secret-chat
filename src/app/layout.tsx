import Providers from '@/components/ui/providers';
import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: { default: 'Private Chat | Secure Self-Destructing Rooms', template: '%s | Private Chat' },
  description:
    'Create a secure, temporary chat room that self-destructs. No logs, no tracking, total privacy.',
  keywords: [
    'private chat',
    'secure messaging',
    'self-destructing rooms',
    'anonymous chat',
    'temporary chat',
  ],
  authors: [{ name: 'Private Chat Team' }],
  creator: 'Private Chat',
  publisher: 'Private Chat',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://private-whisper-chat.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Private Chat | Secure Self-Destructing Rooms',
    description:
      'Create a secure, temporary chat room that self-destructs. No logs, no tracking, total privacy.',
    url: 'https://private-whisper-chat.vercel.app',
    siteName: 'Private Chat',
    images: [
      {
        url: '/private-chat.png',
        width: 1200,
        height: 630,
        alt: 'Private Chat - Secure Self-Destructing Rooms',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Private Chat | Secure Self-Destructing Rooms',
    description:
      'Create a secure, temporary chat room that self-destructs. No logs, no tracking, total privacy.',
    images: ['/private-chat.png'],
    creator: '@Theblackguy_1',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env['GOOGLE_SITE_VERIFICATION'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
