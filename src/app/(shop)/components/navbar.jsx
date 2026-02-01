"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Percent, Search, Package } from "lucide-react";
import { useAuthStore } from "@/app/(shop)/store/useAuthStore";
import { useCartStore } from "@/app/(shop)/store/useCartStore";
import api from "@/app/api";
import Image from "next/image";
const Navbar = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { cart } = useCartStore();

  const cartItemsCount =
    cart?.items?.reduce((acc, item) => acc + item.qty, 0) || 0;

  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // 🔹 Autocomplete
  useEffect(() => {
    if (!keyword.trim()) return;

    const timer = setTimeout(async () => {
      try {
        const res = await api.get("/products/autocomplete", {
          params: { keyword, limit: 5 },
        });
        console.log("AUTO RESPONSE:", res.data);

      setSuggestions(res.data || []);

      } catch (e) {
        console.error(e);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  const handleSearch = () => {
    if (!keyword.trim()) return;
    setSuggestions([]);
    router.push(`/search?keyword=${keyword}`);
  };

  return (
    <nav className="bg-[#f2f2f2] sticky top-0 z-50 px-4 h-20 flex items-center" dir="rtl">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto gap-2 md:gap-4">

        {/* جهة اليمين */}
        <div className="flex items-center gap-2 md:gap-4">
          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <button
                onClick={logout}
                className="hidden md:block bg-red-600 text-white px-4 py-2 rounded-xl font-bold"
              >
                تسجيل خروج
              </button>
              <span className="font-bold">مرحبا، {user?.username}</span>
            </div>
          )}

          {!isAuthenticated && (
            <div className="hidden md:flex items-center gap-3">
              <Link 
                href="/login" 
                className="px-6 py-2 rounded-xl text-gray-700 font-bold hover:bg-gray-200 transition-all duration-300"
              >
                تسجيل دخول
              </Link>
              <Link 
                href="/register" 
                className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-red-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                إنشاء حساب
              </Link>
            </div>
          )}

          <div className="hidden md:flex gap-4 border-r pr-4">
            <Link href="/offers" className="flex flex-col items-center group hover:scale-105 transition-all duration-300">
              <Percent size={22} className="group-hover:text-red-600 transition-colors" />
              <span className="text-xs font-bold group-hover:text-red-600 transition-colors">العروض</span>
            </Link>

            <Link href="/orders" className="flex flex-col items-center group hover:scale-105 transition-all duration-300">
              <Package size={22} className="group-hover:text-red-600 transition-colors" />
              <span className="text-xs font-bold group-hover:text-red-600 transition-colors">طلباتي</span>
            </Link>

            <Link href="/cart" className="relative flex flex-col items-center group hover:scale-105 transition-all duration-300">
              <ShoppingCart size={22} className="group-hover:text-red-600 transition-colors" />
              <span className="text-xs font-bold group-hover:text-red-600 transition-colors">السلة</span>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* جهة اليسار: البحث + اللوجو (زي ما كانوا) */}
        <div className="flex items-center gap-2">
          {/* البحث */}
          <div className="relative flex-1 min-w-[120px] sm:min-w-[200px] md:max-w-[350px]">
            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                const v = e.target.value;
                setKeyword(v);
                if (!v.trim()) setSuggestions([]);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="بحث ...."
              className="w-full bg-[#e8e8e8] rounded-2xl py-2 pr-10 pl-4 text-sm outline-none"
            />
            <Search
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              size={18}
            />

            {/* Autocomplete */}
            {suggestions.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-white rounded-xl shadow z-1000">
                {suggestions.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      router.push(`/product/${item._id}`);
                      setKeyword("");
                      setSuggestions([]);
                    }}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* اللوجو – نفس كودك */}
          <Link
            href="/"
            className="flex-shrink-0 w-20 h-20 md:w-20 md:h-20 overflow-hidden flex items-center justify-center"
          >
            <Image
              src="/logoGift.png"
              alt="Logo"
              width={80}
              height={80}
              priority
              className="w-full h-full object-contain scale-[2.2] mix-blend-multiply"
            />
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
