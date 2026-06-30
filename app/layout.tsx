import { QuotaProvider } from "@/components/QuotaContext";
import "@/app/globals.css"; // Your Tailwind imports

export const metadata = {
  title: "FACTS TUPU | Accountability & Intelligence Platform",
  description:
    "AI-driven SaaS metrics and tracking framework for administrative governance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-950 text-slate-50 antialiased">
      <body>
        <QuotaProvider>{children}</QuotaProvider>
      </body>
    </html>
  );
}
