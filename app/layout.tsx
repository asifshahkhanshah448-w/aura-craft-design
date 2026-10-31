import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AURA Craft & Design — Full-Stack E-Commerce Store',
  description:
    'Production-grade full-stack e-commerce web application featuring REST API, Mongoose/MongoDB Atlas architecture, JWT auth, inventory control, cart, and admin dashboard.',
  openGraph: {
    title: 'AURA Craft & Design — Full-Stack E-Commerce Store',
    description:
      'Production-grade full-stack e-commerce web application featuring REST API, Mongoose/MongoDB Atlas architecture, JWT auth, inventory control, cart, and admin dashboard.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AURA Craft & Design — Full-Stack E-Commerce Store',
    description:
      'Production-grade full-stack e-commerce web application featuring REST API, Mongoose/MongoDB Atlas architecture, JWT auth, inventory control, cart, and admin dashboard.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 text-stone-900 font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
