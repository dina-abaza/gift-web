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