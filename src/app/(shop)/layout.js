import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css" // لاحظي الـ .. لأننا دخلنا في مجلد (shop)
import Providers from "./providers"; 
import Navbar from "./components/navbar"; 
import NavBottom from "./components/navbottom"; 
import Footer from "./components/footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "متجر الأصناف",
  description: "تطبيق تسوق الخضروات والمواد الغذائية",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  applicationName: "Grocy Shop",
  keywords: ["هدايا", "إكسسوارات", "تسوق", "عروض"],
  openGraph: {
    type: "website",
    title: "متجر الأصناف",
    description: "تسوق هدايا فاخرة وإكسسوارات مناسبات",
    url: "/",
    images: [{ url: "/logo2.png", width: 512, height: 512, alt: "Grocy Shop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "متجر الأصناف",
    description: "هدايا فاخرة وإكسسوارات مناسبات",
    images: ["/logo2.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  themeColor: "#111827",
};

export default function ShopLayout({ children }) {
  
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <NavBottom />
          <Footer />
        </Providers>
    </div>
  );
}
