import type { Metadata, Viewport } from "next"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

import { cn } from "@acme/ui/lib/utils"
import { Toaster } from "@acme/ui/toast"

import { TRPCReactProvider } from "~/trpc/react"

import "~/app/globals.css"

import { TooltipProvider } from "@acme/ui/tooltip"

export const metadata: Metadata = {
  metadataBase: new URL("https://acme.com"),
  title: "Acme",
  description: "Simple monorepo with shared backend for web apps",
  openGraph: {
    title: "Acme",
    description: "Simple monorepo with shared backend for web apps",
    url: "https://acme.com",
    siteName: "Acme",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable} scroll-smooth`}>
      <body className={cn("text-neutral-900 antialiased")}>
        <TooltipProvider>
          <TRPCReactProvider>{props.children}</TRPCReactProvider>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  )
}
