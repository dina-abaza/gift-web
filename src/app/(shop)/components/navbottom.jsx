"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, MessageCircle, ShoppingCart, User, Percent, Package } from "lucide-react";
import { useAuthStore } from "@/app/(shop)/store/useAuthStore";
import { useCartStore } from "@/app/(shop)/store/useCartStore";

const NavBottom = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuthStore(); // استدعاء حالة الدخول ودالة الخروج
const { cart } = useCartStore();
const cartItemsCount = cart?.items?.reduce((acc, item) => acc + (item.qty || 0), 0) || 0;

  const openWhatsApp = () => {
    const phoneNumber = "964XXXXXXXXX"; // رقم صاحب المحل
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 z-50 px-2" dir="rtl">
      
      {/* الرئيسية */}
      <div 
        onClick={() => router.push('/')}
        className={`flex flex-col items-center cursor-pointer ${pathname === '/' ? 'text-red-600' : 'text-gray-400'}`}
      >
        <Home size={24} strokeWidth={pathname === '/' ? 2.5 : 2} />
        <span className={`text-[10px] mt-1 ${pathname === '/' ? 'font-bold' : ''}`}>الرئيسية</span>
      </div>

    
      {/* طلباتي */}
      <div 
        onClick={() => router.push('/orders')}
        className={`flex flex-col items-center cursor-pointer ${pathname === '/orders' ? 'text-red-600' : 'text-gray-400'}`}
      >
        <Package size={24} />
        <span className={`text-[10px] mt-1 ${pathname === '/orders' ? 'font-bold' : ''}`}>طلباتي</span>
      </div>

      {/* زر السلة */}
   <div 
  onClick={() => router.push('/cart')}
  className="relative -mt-10 flex flex-col items-center cursor-pointer"
>
  <div className="bg-white p-2 rounded-full shadow-lg border border-gray-50">
    <div className={`p-3 rounded-full ${pathname === '/cart' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
      <ShoppingCart size={28} />
    </div>

    {/* عداد المنتجات */}
    {cartItemsCount > 0 && (
      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
        {cartItemsCount}
      </span>
    )}
  </div>

  <span className={`text-[10px] mt-1 ${pathname === '/cart' ? 'text-red-600 font-bold' : 'text-gray-400'}`}>
    السلة
  </span>
</div>

      {/* العروض */}
      <div 
        onClick={() => router.push('/offers')}
        className={`flex flex-col items-center cursor-pointer ${pathname === '/offers' ? 'text-red-600' : 'text-gray-400'}`}
      >
        <Percent size={24} />
        <span className={`text-[10px] mt-1 ${pathname === '/offers' ? 'font-bold' : ''}`}>العروض</span>
      </div>


      {/* الحساب / تسجيل خروج */}
      {isAuthenticated ? (
        <div 
          onClick={logout}
          className="flex flex-col items-center cursor-pointer text-gray-400 hover:text-red-600"
        >
          <User size={24} />
          <span className="text-[10px] mt-1 font-bold">تسجيل خروج</span>
        </div>
      ) : (
        <div 
          onClick={() => router.push('/register')}
          className={`flex flex-col items-center cursor-pointer ${pathname === '/register' ? 'text-red-600' : 'text-gray-400'}`}
        >
          <User size={24} />
          <span className={`text-[10px] mt-1 ${pathname === '/register' ? 'font-bold' : ''}`}>إنشاء حساب</span>
        </div>
      )}

    </div>
  );
};

export default NavBottom;
