import Navbar from "@/components/Navbar";
import Providers from "@/components/providers/Providers";
import { Toaster } from "@/components/ui/Toaster";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
export const metadata = {
  title: "Insightify - Share your insights with others",
  description:
    "Web app that allows users to share advanced post with others, made using TypeScript",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-slate-900 light antialiased",
        inter.className
      )}
    >
      <Providers>
        <body className="min-h-screen pt-12 antialiased bg-slate-50">
          {/* @ts-expect-error server component */}
          <Navbar />

          {authModal}

          <div className="container max-w-7xl h-full pt-12">{children}</div>
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}
