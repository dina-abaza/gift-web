"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import api from "@/app/api"; 
import { ShoppingCart, Plus, Minus, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import Activity from "@/app/loading";
// ✅ Stores
import { useAuthStore } from "@/app/(shop)/store/useAuthStore";
import { useCartStore } from "@/app/(shop)/store/useCartStore";

const CategoryProducts = () => {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryNameFromQuery = searchParams.get("name");
  const { user, isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(null);

  useEffect(() => {
    if (categoryNameFromQuery) {
      setCategoryName(categoryNameFromQuery);
    }
  }, [categoryNameFromQuery]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/category/${id}`, { params: { page, limit } });
        const realProducts = response.data.products || [];
        setProducts(realProducts);

        const tp =
          response.data?.totalPages ??
          response.data?.pages ??
          (response.data?.total ? Math.ceil(response.data.total / limit) : null);
        setTotalPages(tp);

        const initialQuantities = {};
        realProducts.forEach((p) => (initialQuantities[p._id] = 1));
        setQuantities(initialQuantities);

      } catch (error) {
        setProducts([]);
        setCategoryName("المنتجات");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategoryData();
  }, [id, page]);

  const increment = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  };

  const decrement = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1),
    }));
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      toast.info("سجّل الدخول أولاً 🧾");
      router.push("/login");
      return;
    }

    const qty = quantities[product._id] || 1;
    const userId = user?.id || user?._id;

    try {
      await addToCart(userId, product._id, qty);
    } catch (error) {
       console.error("Cart Add Error:", error);
    }
  };

  if (loading) return <Activity />;

  return (
    <div className="bg-[#f8f8f8] min-h-screen pb-24" dir="rtl">
      
      {/* عنوان القسم */}
      <div className="bg-white/90 backdrop-blur-md sticky top-0 p-4 shadow-sm border-b border-gray-100 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-center relative">
          <button 
            onClick={() => router.back()} 
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition-colors"
            aria-label="رجوع"
          >
            <ArrowRight size={20} />
          </button>
          <h1 className="text-red-600 font-extrabold text-xl md:text-2xl">{categoryName || "المنتجات"}</h1>
        </div>
      </div>

      <div className="p-4 flex flex-wrap justify-center gap-4 max-w-7xl mx-auto">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-3xl shadow-sm flex flex-col items-center relative border border-gray-100 w-[calc(50%-8px)] md:w-[220px]"
            >
              {/* خصم */}
              <div className="absolute top-3 left-3 bg-gray-100 text-[10px] px-2 py-0.5 rounded-full">
                {product.discountPercent ?? 0} %
              </div>

              {/* الصورة */}
              <div 
                className="w-full h-44 flex items-center justify-center mb-3 cursor-pointer overflow-hidden rounded-2xl"
                onClick={() => router.push(`/product/${product._id}`)}
              > 
                <img 
                  src={product.image || "/placeholder.jpg"} 
                  alt={product.name} 
                  className="object-cover w-full h-full" 
                />
              </div>

              {/* الاسم والسعر */}
              <h3 className="font-bold text-[13px] text-center mb-1 line-clamp-2 h-8">{product.name}</h3>
              <div className="text-center mb-4 font-black">{product.price?.toLocaleString()} ج.م</div>

              {/* أزرار الكمية والإضافة */}
              <div className="flex items-center justify-between w-full bg-gray-50 p-1 rounded-full">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-90"
                >
                  <ShoppingCart size={15} />
                </button>

                <div className="flex items-center gap-1">
                  <button onClick={() => decrement(product._id)} className="text-red-600 p-1">
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{quantities[product._id] || 1}</span>
                  <button onClick={() => increment(product._id)} className="text-green-600 p-1">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-500 font-bold w-full">
            لا توجد منتجات في هذا القسم حالياً.
          </div>
        )}
      </div>

      {/* Pagination Dots */}
      {totalPages && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                page === i + 1 ? "bg-red-600" : "bg-gray-300"
              }`}
              aria-label={`اذهب إلى الصفحة ${i + 1}`}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default CategoryProducts;
