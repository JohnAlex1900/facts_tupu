import { QuotaProvider } from "@/components/QuotaContext";
import Providers from "@/app/providers";
import "@/app/globals.css";
import Script from "next/script";

export const metadata = {
  title: "FACTS-TUPU.COM | Know Your Candidate",
  description:
    "AI-driven SaaS metrics and tracking framework for administrative governance.",
  icons: {
    icon: [{ url: "/icon.jpeg" }, { url: "/icon.jpeg", type: "image/jpeg" }],
    shortcut: "/icon.jpeg",
    apple: "/icon.jpeg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-950 text-slate-50 antialiased">
      <head>
        <link rel="icon" href="/icon.jpeg" />
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="d97f58c6-b286-4614-879d-b688694dfaa3"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <Providers>
          <QuotaProvider>{children}</QuotaProvider>
        </Providers>
      </body>
    </html>
  );
}
