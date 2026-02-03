"use client";
import React, { useEffect, useState } from "react";
import api from "@/app/api";
import { ShoppingCart, Tag, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/(shop)/store/useCartStore";
import { useAuthStore } from "@/app/(shop)/store/useAuthStore";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
const OffersPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch("/api/products/offers", { cache: "no-store" });
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("خطأ في جلب العروض:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleAdd = async (product) => {
    if (!isAuthenticated) {
      const { toast } = await import("react-toastify");
      toast.info("سجّل الدخول أولاً");
      return router.push("/login");
    }
    await addToCart(user.id || user._id, product._id, 1);
  };

  if (loading)
    return (
      <div className="text-center py-20 font-bold text-red-600 animate-pulse">
        جاري تحميل أقوى العروض...
      </div>
    );

  return (
    <div className="bg-[#f8f8f8] min-h-screen pb-20" dir="rtl">
      {/* Header */}
      <div className="bg-red-600 p-6 rounded-b-[40px] shadow-lg text-white text-center relative">
        <button
          onClick={() => router.back()}
          className="absolute right-6 top-7 text-white/80"
        >
          <ArrowRight size={28} />
        </button>
        <Tag className="mx-auto mb-2" size={35} />
        <h1 className="text-2xl font-black">عروضنا القوية</h1>
        <p className="text-sm text-red-100">أفضل الأسعار لفترة محدودة</p>
      </div>

      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto mt-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-[30px] p-3 shadow-sm border border-red-100 flex flex-col relative overflow-hidden"
          >
            {/* نسبة الخصم */}
            {product.discountPercent > 0 && (
              <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-2xl z-10">
                خصم {Math.round(product.discountPercent)}%
              </div>
            )}

           <Link href={`/product/${product._id}`} className="flex flex-col items-center w-full">
  <div className="h-32 w-full flex items-center justify-center mb-2">
    <div className="relative w-full h-full aspect-square">
      <Image
        src={product.image}
        alt={product.name}
        fill
        loading="lazy"
        quality={70}
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover"
      />
    </div>
  </div>
  <h3 className="font-bold text-xs h-8 line-clamp-2 text-gray-800 text-center">{product.name}</h3>
</Link>

           
            <div className="flex flex-col items-center my-2">
              {product.discountPrice && product.discountPrice < product.price && (
                <span className="text-gray-400 line-through text-[10px]">
                  {product.price?.toLocaleString()} ج.م
                </span>
              )}
              <span className="text-red-600 font-black text-sm">
                {product.discountPrice?.toLocaleString() || product.price?.toLocaleString()} ج.م
              </span>
            </div>

            <button
              onClick={() => handleAdd(product)}
              className="w-full bg-red-600 text-white py-2 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold hover:bg-red-700 transition-all"
            >
              <ShoppingCart size={14} /> إضافة
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersPage;
