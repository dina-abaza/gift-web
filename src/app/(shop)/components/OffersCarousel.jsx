"use client";
import React, { useEffect, useState } from "react";
import { ShoppingCart, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/(shop)/store/useCartStore";
import { useAuthStore } from "@/app/(shop)/store/useAuthStore";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";

// استيراد Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Autoplay } from "swiper/modules";

// استيراد استايلات Swiper
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

const OffersCarousel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch("/api/products/offers", { cache: "force-cache" });
        const data = await response.json();
        setProducts(data.products?.slice(0, 8) || []);
      } catch (err) {
        console.error("خطأ في جلب العروض:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleAdd = async (product) => {
    if (!isAuthenticated) {
      toast.info("سجّل الدخول أولاً");
      return router.push("/login");
    }
    await addToCart(user.id || user._id, product._id, 1);
  };

  if (loading) return <div className="py-16 text-center animate-pulse text-red-600 font-bold">جاري تحميل العروض...</div>;

  return (
    <div className="py-12 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900">عروضنا المميزة</h2>
          <p className="text-gray-500 mt-2">استكشف العروض بطريقة تفاعلية</p>
        </div>

        <div className="relative px-4">
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
           loop={products.length > 1}
            coverflowEffect={{
              rotate: 30,    // درجة الدوران (مثل الكرة الأرضية)
              stretch: 0,    // تمدد العناصر
              depth: 200,    // عمق العناصر البعيدة
              modifier: 1,   // قوة التأثير
              slideShadows: false, // ظلال السلايد
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            navigation={{
              nextEl: ".button-next",
              prevEl: ".button-prev",
            }}
            modules={[EffectCoverflow, Navigation, Autoplay]}
            className="mySwiper !pb-12"
          >
            {products.map((product) => (
              <SwiperSlide key={product._id} style={{ width: "240px" }}>
                {({ isActive }) => (
                  <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 p-3 transition-all duration-500 flex flex-col ${isActive ? 'scale-105 opacity-100' : 'scale-90 opacity-60'}`}>
                    
                    {/* نسبة الخصم */}
                    {product.discountPercent > 0 && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">
                        -{Math.round(product.discountPercent)}%
                      </div>
                    )}

                    <Link href={`/product/${product._id}`} className="flex flex-col items-center">
                      <div className="h-40 w-full relative mb-3 bg-gray-50 rounded-lg overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="240px"
                           loading={isActive ? "eager" : "lazy"}
                          quality={70}
                        />
                      </div>
                      <h3 className="font-bold text-center text-gray-800 line-clamp-1">{product.name}</h3>
                    </Link>

                    <div className="flex flex-col items-center my-4">
                      <span className="text-red-600 font-black text-xl">
                        {product.discountPrice?.toLocaleString() || product.price?.toLocaleString()}ج.م
                      </span>
                      {product.discountPrice && product.discountPrice < product.price && (
                        <span className="text-gray-400 line-through text-xs">
                          {product.price?.toLocaleString()} ج.م
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAdd(product)}
                      className="w-full bg-black text-white py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-600 transition-colors font-bold"
                    >
                      <ShoppingCart size={18} /> إضافة للسلة
                    </button>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* أزرار التنقل المخصصة */}
          <div className="button-prev absolute top-1/2 left-0 z-30 cursor-pointer bg-white p-3 rounded-full shadow-lg text-red-600 hover:bg-red-600 hover:text-white transition-all -translate-y-1/2">
            <ChevronLeft size={28} />
          </div>
          <div className="button-next absolute top-1/2 right-0 z-30 cursor-pointer bg-white p-3 rounded-full shadow-lg text-red-600 hover:bg-red-600 hover:text-white transition-all -translate-y-1/2">
            <ChevronRight size={28} />
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/offers" className="inline-flex items-center gap-2 text-red-600 font-bold hover:underline">
            تصفح جميع العروض <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OffersCarousel);
