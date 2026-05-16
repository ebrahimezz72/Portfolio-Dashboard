import { Geist, Geist_Mono, Almarai } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ToastProvider } from "@/context/ToastContext";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const almarai = Almarai({
  weight: ["300", "400", "700", "800"],
  subsets: ["arabic"],
  variable: "--font-almarai",
});

export const metadata: Metadata = {
  title: "Artisan Admin | Engineering Studio Portal",
  description: "Advanced administrative interface for the Artisan engineering and design portfolio.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Artisan Admin",
    description: "Engineering Studio Portfolio Management",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${almarai.variable} h-full antialiased font-arabic`}
      >
        <ThemeProvider>
          <ToastProvider>
            <NotificationProvider>
              <SidebarProvider>
                <LayoutWrapper>
                  {children}
                </LayoutWrapper>
              </SidebarProvider>
            </NotificationProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
