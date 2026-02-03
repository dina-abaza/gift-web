"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/app/api";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/app/(shop)/store/useCartStore";
import { useAuthStore } from "@/app/(shop)/store/useAuthStore";
import { toast } from "react-toastify";
import Activity from "@/app/loading";
import Image from "next/image";
export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("keyword");
  
  const { addToCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // إضافة state لتخزين الكمية لكل منتج بشكل منفصل
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (!keyword) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/products/search", {
          params: { keyword, page: 1, limit: 10 },
        });
        setProducts(res.data.products || []);
        
        // تهيئة الكمية بـ 1 لكل منتج قادم من البحث
        const initialQuants = {};
        res.data.products?.forEach(p => initialQuants[p._id] = 1);
        setQuantities(initialQuants);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [keyword]);

  const handleUpdateQuantity = (id, delta) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      const { toast } = await import("react-toastify");
      toast.info("سجّل الدخول أولاً");
      router.push("/login");
      return;
    }
    const userId = user?.id || user?._id;
    const qty = quantities[product._id] || 1;
    await addToCart(userId, product._id, qty);
  };

  if (loading) return <Activity />;

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8" dir="rtl">
      <h1 className="text-xl font-bold mb-6">
        نتائج البحث عن: <span className="text-red-600">{keyword}</span>
      </h1>

      {products.length === 0 ? (
        <p className="text-center py-10">لا توجد نتائج تطابق بحثك</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border rounded-2xl p-4 hover:shadow-lg transition-shadow bg-white flex flex-col">
              {/* رابط للصورة والاسم */}
              <Link href={`/product/${product._id}`} className="flex-grow">
                <div className="relative w-full h-40 mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    loading="lazy"
                    quality={80}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain"
                  />
                </div>
                <p className="text-red-600 font-black text-lg mb-1">
                  {product.price?.toLocaleString()} <span className="text-xs">د.ع</span>
                </p>
                <h3 className="text-sm font-bold text-gray-800 h-10 overflow-hidden">{product.name}</h3>
              </Link>

              <div className="mt-4 pt-4 border-t border-gray-50">
                {/* أزرار زيادة ونقصان العدد (مثل صفحة التفاصيل) */}
                <div className="flex items-center justify-between mb-4 bg-gray-50 px-3 py-1 rounded-xl">
                  <button 
                    onClick={() => handleUpdateQuantity(product._id, 1)}
                    className="text-green-600 p-1"
                  >
                    <Plus size={16} strokeWidth={3} />
                  </button>
                  <span className="font-bold">{quantities[product._id] || 1}</span>
                  <button 
                    onClick={() => handleUpdateQuantity(product._id, -1)}
                    className="text-red-600 p-1"
                  >
                    <Minus size={16} strokeWidth={3} />
                  </button>
                </div>

                {/* زر الإضافة للسلة */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
                >
                  <ShoppingCart size={16} />
                  إضافة للسلة
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
