import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Karoli Foundation - University Management",
  description: "Comprehensive university management system for students, faculty, and administrators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#4f46e5',
          colorBackground: '#ffffff',
          colorText: '#1f2937',
        },
        elements: {
          formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm',
          card: 'shadow-xl',
          footerActionLink: 'text-indigo-600 hover:text-indigo-700',
        },
      }}
    >
      <html lang="en">
        <body
          className={`${inter.variable} antialiased`}
        >
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}

