import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Bebas_Neue, IBM_Plex_Mono } from "next/font/google"
import "styles/globals.css"

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
})

const body = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-body",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
