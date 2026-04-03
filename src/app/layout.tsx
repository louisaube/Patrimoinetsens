import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { AuthProvider } from "@/components/auth/auth-provider"
import { ToastProvider } from "@/components/ui/toast"
import { ServiceWorkerRegister } from "@/components/service-worker-register"
import { OfflineSyncProvider } from "@/hooks/use-offline"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Patrimoine & Sens",
  description: "Documentez et protégez le patrimoine local de Sens",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Patrimoine & Sens",
  },
}

export const viewport: Viewport = {
  themeColor: "#065f46",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-stone-50">
        <AuthProvider>
          <OfflineSyncProvider>
            <ToastProvider>
              <ServiceWorkerRegister />
              {children}
            </ToastProvider>
          </OfflineSyncProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
