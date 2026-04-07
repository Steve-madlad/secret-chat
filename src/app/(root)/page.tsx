import { Metadata } from 'next';
import Home from './Home';

export const metadata: Metadata = {
  title: 'Private Chat | Secure Self-Destructing Rooms',
  description:
    'Create a secure, temporary chat room that self-destructs. No logs, no tracking, total privacy.',
  keywords: [
    'private chat',
    'secure messaging',
    'self-destructing rooms',
    'anonymous chat',
    'temporary chat',
  ],
  openGraph: {
    title: 'Private Chat | Secure Self-Destructing Rooms',
    description:
      'Create a secure, temporary chat room that self-destructs. No logs, no tracking, total privacy.',
    url: 'https://yourdomain.com', // Replace with your actual domain
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
  alternates: {
    canonical: 'https://yourdomain.com', // Replace with your actual domain
  },
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Private Chat',
    description:
      'Create a secure, temporary chat room that self-destructs. No logs, no tracking, total privacy.',
    url: 'https://yourdomain.com', // Replace with your actual domain
    applicationCategory: 'CommunicationApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'Private Chat Team',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <Home />
    </>
  );
}
