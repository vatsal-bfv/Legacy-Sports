import type { Metadata, Viewport } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://legacysportscomplex.com"),
  title: {
    default: "Legacy Sports Complex",
    template: "%s | Legacy Sports Complex",
  },
  description:
    "Georgia's premier multi-location athlete development system. Performance training, combine prep, and a college recruiting pipeline powered by AI.",
  applicationName: "Legacy Sports Complex",
  openGraph: {
    siteName: "Legacy Sports Complex",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#f8f7f4",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
