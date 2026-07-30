import { QuotaProvider } from "@/components/QuotaContext";
import Providers from "@/app/providers";
import "@/app/globals.css"; // Your Tailwind imports

export const metadata = {
  title: "FACTS TUPU | Accountability & Intelligence Platform",
  description:
    "AI-driven SaaS metrics and tracking framework for administrative governance.",
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
      <body>
        <head>
          <script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id="d97f58c6-b286-4614-879d-b688694dfaa3"
          ></script>
        </head>
        <Providers>
          <QuotaProvider>{children}</QuotaProvider>
        </Providers>
      </body>
    </html>
  );
}
