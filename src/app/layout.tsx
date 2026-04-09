import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Doces Gourmet de Elite | O Seu Guia da Sobremesa Perfeita",
  description: "Aprenda a criar doces gourmet lucrativos com um passo a passo interativo e exclusivo.",
  manifest: "/manifest.json",
  verification: {
    other: {
      "facebook-domain-verification": ["uebq3kzcd3u1ni8hjupk4iwn8w8hxa"],
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Doces Gourmet",
  },
  openGraph: {
    title: "Doces Gourmet de Elite | O Seu Guia da Sobremesa Perfeita",
    description: "Aprenda a criar doces gourmet lucrativos com um passo a passo interativo e exclusivo.",
    url: "https://doces-gourmet.vercel.app",
    siteName: "Doces Gourmet",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Doces Gourmet de Elite",
    description: "Aprenda a criar doces gourmet lucrativos.",
  },
};

export const viewport: Viewport = {
  themeColor: "#E83E8C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1523944362485658');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1523944362485658&ev=PageView&noscript=1"
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
