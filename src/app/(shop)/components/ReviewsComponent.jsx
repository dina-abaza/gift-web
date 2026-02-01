"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { reviewService } from "@/app/services/reviewservice";
import api from "@/app/api";
import Activity from "@/app/loading";
import Image from "next/image";

const ReviewsComponent = () => {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        setLoading(true);
        
        const reviewsResponse = await reviewService.getList({ limit: 10 });
        const reviewsData = reviewsResponse.data.reviews || reviewsResponse.data || [];
        setReviews(reviewsData);

        // استخراج الـ _id بشكل صحيح سواء كان النص أو كائن
        const productIds = [...new Set(reviewsData.map(review => {
          const id = review.productId?._id || review.productId;
          return id;
        }))].filter(Boolean); // حذف أي قيم فارغة

        const productsMap = {};

        for (const id of productIds) {
          try {
            const response = await api.get(`/products/${id}`);
            if (response.data) {
              // تخزين المنتج باستخدام الـ _id الراجع من السيرفر لضمان التطابق
              productsMap[response.data._id] = response.data;
            }
          } catch (err) {
            console.warn(`المنتج ${id} غير موجود 404`);
            productsMap[id] = null;
          }
        }
        
        setProducts(productsMap);
      } catch (error) {
        console.error("خطأ في جلب التقييمات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllReviews();
  }, []);

  if (loading) return <Activity />;

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900">آراء العملاء</h2>
          <p className="text-gray-500 mt-2">ما يقوله عملاؤنا عن منتجاتنا</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.length > 0 ? (
            reviews.map((review) => {
              // محاولة الوصول للمنتج باستخدام المعرف المخزن في المراجعة
              const pId = review.productId?._id || review.productId;
              const product = products[pId];
              
              return (
                <div 
                  key={review._id} 
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow flex flex-col h-full"
                >
                  <div className="flex items-center gap-3 mb-4 border-b pb-3">
                    <div className="relative w-12 h-12 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                      {product?.image ? (
                        <Image
                          src={product.image}
                          alt={product.name || "Product"}
                          fill
                        sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 text-center p-1">
                          {product ? "بلا صورة" : "جاري التحميل..."}
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 
                        className={`font-bold text-xs ${product ? 'text-gray-800 hover:text-red-600 cursor-pointer' : 'text-gray-400'}`}
                        onClick={() => product && router.push(`/product/${product._id}`)}
                      >
                        {product?.name || "منتج غير متوفر"}
                      </h3>
                      <div className="text-yellow-400 text-[10px] mt-1">
                        {'★'.repeat(review.rating || 0) + '☆'.repeat(5 - (review.rating || 0))}
                      </div>
                    </div>
                  </div>

                  <div className="flex-grow">
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-[10px] font-bold text-red-600">
                          {review.userId?.name?.charAt(0) || "U"}
                        </div>
                        <span className="text-xs font-bold text-gray-700">
                          {review.userId?.name || "عميل موثق"}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString("ar-EG") : ""}
                      </span>
                    </div>

                    {review.adminReply && (
                      <div className="mt-3 p-2 bg-blue-50 rounded-lg border-r-4 border-blue-400 text-right">
                        <p className="text-[11px] text-gray-700 font-medium">
                          {review.adminReply.content}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl shadow-sm">
              <p className="text-gray-500">لا توجد تقييمات حالياً</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsComponent;