import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'AuditTrack VI - Caribbean Edition',
    template: '%s | AuditTrack VI'
  },
  description: 'AI-powered audit management system designed for the U.S. Virgin Islands. Streamline compliance with IRS, USVI DOL, and GASB requirements.',
  keywords: [
    'audit management',
    'compliance',
    'U.S. Virgin Islands',
    'USVI',
    'IRS compliance',
    'DOL regulations',
    'GASB standards',
    'document processing',
    'AI audit',
    'Caribbean'
  ],
  authors: [{ name: 'AuditTrack VI Team' }],
  creator: 'AuditTrack VI',
  publisher: 'AuditTrack VI',
  metadataBase: new URL('https://audittrack-vi.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://audittrack-vi.vercel.app',
    title: 'AuditTrack VI - Caribbean Edition',
    description: 'AI-powered audit management system for the U.S. Virgin Islands',
    siteName: 'AuditTrack VI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AuditTrack VI - Caribbean Edition'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AuditTrack VI - Caribbean Edition',
    description: 'AI-powered audit management system for the U.S. Virgin Islands',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification tokens here
    // google: 'your-google-verification-token',
    // yandex: 'your-yandex-verification-token',
  },
  category: 'business',
  classification: 'Audit Management Software',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'AuditTrack VI',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#00B6A0',
    'theme-color': '#00B6A0',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Additional meta tags for better mobile experience */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AuditTrack VI" />
        
        {/* Theme color for browser UI */}
        <meta name="theme-color" content="#00B6A0" />
        <meta name="msapplication-TileColor" content="#00B6A0" />
        
        {/* Prevent zoom on form inputs on iOS */}
        <style>{`
          @media screen and (-webkit-min-device-pixel-ratio: 0) {
            select, textarea, input[type="text"], input[type="password"], 
            input[type="datetime"], input[type="datetime-local"], 
            input[type="date"], input[type="month"], input[type="time"], 
            input[type="week"], input[type="number"], input[type="email"], 
            input[type="url"], input[type="search"], input[type="tel"], 
            input[type="color"] {
              font-size: 16px;
            }
          }
        `}</style>
      </head>
      <body className="h-full antialiased">
        {/* Skip to main content for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:shadow-lg"
        >
          Skip to main content
        </a>
        
        {/* Main application container */}
        <div id="main-content" className="min-h-full">
          {children}
        </div>
        
        {/* Performance and analytics scripts can go here */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics or other analytics scripts */}
            {/* <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            /> */}
          </>
        )}
      </body>
    </html>
  )
}