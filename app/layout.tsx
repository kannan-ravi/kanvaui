import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kanva UI | Open Source Shadcn UI Components & Blocks",
  description:
    "Open-source Shadcn UI components & Blocks, that you can copy-paste into any TypeScript/Next.js project.",
  applicationName: "Kanva UI",
  keywords: ["ui", "components", "Tailwind CSS", "Next.js", "shadcn", "motion"],
  creator: "Kannan Ravindran",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          enableSystem={true}
          disableTransitionOnChange
          defaultTheme="system"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
