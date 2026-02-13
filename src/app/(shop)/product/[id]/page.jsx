"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/api";
import { toast } from "react-toastify";
import Activity from "@/app/loading";
import { reviewService } from "@/app/services/reviewservice";
import { CornerDownLeft, ArrowRight } from "lucide-react";
import Script from "next/script";
import Image from "next/image";

const ProductDetails = () => {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState([]);
  const [average, setAverage] = useState({ average: 0, count: 0 });
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        toast.error("المنتج غير موجود");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProductData();
  }, [id]);

  const fetchReviewData = async () => {
    try {
      setReviewsLoading(true);
      const [revRes, statsRes, avgRes] = await Promise.all([
        reviewService.getList({ productId: id, limit: 10 }),
        reviewService.getStats(id),
        reviewService.getAverage(id),
      ]);
      setReviews(revRes.data.reviews);
      setStats(statsRes.data);
      if (avgRes.data.length > 0) setAverage(avgRes.data[0]);
    } catch (error) {
      console.error("خطأ في جلب المراجعات:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchReviewData();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (newReview.comment.length > 200) {
    return toast.warn("التعليق طويل جداً، الحد الأقصى 200 حرف");
  }
    setSubmitting(true);
    try {
      await reviewService.add({ productId: id, ...newReview });
      toast.success("تم إضافة تقييمك بنجاح");
      setNewReview({ rating: 5, comment: "" });
      fetchReviewData();
    } catch (error) {
      toast.error(error.response?.data?.message || "فشل الإرسال، تأكد من تسجيل الدخول وشراء المنتج");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Activity />;
  if (!product) return null;

  const hasDiscount = product.discountActive && product.discountPrice < product.price;

  return (
    <div className="bg-[#f8f8f8] min-h-screen pb-24" dir="rtl">
      {product && (
        <Script id="jsonld-product" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            image: [product.image],
            description: product.description || "",
            offers: {
              "@type": "Offer",
              priceCurrency: "IQD",
              price: (product.discountActive ? product.discountPrice : product.price) || 0,
              availability: "https://schema.org/InStock",
            },
          })}
        </Script>
      )}

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
          <h1 className="text-red-600 font-extrabold text-xl md:text-2xl">{product.category?.name || "المنتجات"}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 mt-6 flex flex-col items-center text-center">
        {/* الصورة أكبر */}
        <div className="relative w-full max-w-md h-80 mb-4 rounded-2xl overflow-hidden shadow-md">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            fetchPriority="high"
            quality={70}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>

        <div className="flex items-center gap-3 mb-2 justify-center">
          {hasDiscount && (
            <span className="text-gray-400 text-lg line-through">
              {product.price?.toLocaleString()} ج.م
            </span>
          )}
          <span className={`font-black ${hasDiscount ? "text-red-600 text-2xl" : "text-gray-900 text-2xl"}`}>
            {hasDiscount ? product.discountPrice?.toLocaleString() : product.price?.toLocaleString()} ج.م
          </span>
        </div>

        {product.weight && <div className="text-gray-500 mb-4">الوزن: {product.weight}</div>}

        <div className="border-t border-gray-100 pt-4 w-full text-right">
          <h3 className="font-bold text-gray-800 mb-2">الوصف</h3>
          <p className="text-gray-600 leading-relaxed text-sm">{product.description || "وصف المنتج غير متوفر حالياً."}</p>
        </div>
      </div>

      {/* مراجعات العملاء */}
      <div className="max-w-2xl mx-auto px-6 mt-12 border-t border-gray-100 pt-8">
        <h3 className="font-bold text-gray-900 text-xl mb-6 text-right">مراجعات العملاء</h3>

        <div className="flex items-center gap-6 mb-8 bg-gray-50 p-4 rounded-2xl justify-between flex-row-reverse">
          <div className="text-center">
            <div className="text-4xl font-black text-yellow-500">{average.average?.toFixed(1) || 0}</div>
            <div className="text-sm text-gray-400">من 5</div>
          </div>
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const starStat = stats.find((s) => s._id === star);
              const percentage = average.count > 0 ? ((starStat?.count || 0) / average.count) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 flex-row-reverse">
                  <span className="text-xs text-gray-500 w-8">{star} نجوم</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* نموذج إضافة مراجعة */}
        <div className="mb-10 bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
          <h4 className="font-bold text-gray-800 mb-4 text-right">أضف رأيك</h4>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="text-right">
              <label className="text-xs text-gray-400 block mb-1">تقييمك</label>
              <select
                className="w-full p-2 bg-gray-50 border-none rounded-lg text-sm outline-none"
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
              >
                <option value="5">5 نجوم - ممتاز</option>
                <option value="4">4 نجوم - جيد جداً</option>
                <option value="3">3 نجوم - جيد</option>
                <option value="2">2 نجوم - مقبول</option>
                <option value="1">1 نجوم - ضعيف</option>
              </select>
            </div>
            <div className="text-right">
              <label className="text-xs text-gray-400 block mb-1">تعليقك</label>
              <textarea
                className="w-full p-3 bg-gray-50 border-none rounded-lg text-sm outline-none h-24"
                placeholder="تكلم عن تجربتك مع المنتج..."
                value={newReview.comment}
                maxLength={200}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                submitting ? "bg-gray-300" : "bg-blue-600 active:scale-95"
              }`}
            >
              {submitting ? "جاري الإرسال..." : "نشر التقييم"}
            </button>
          </form>
        </div>

        {/* قائمة المراجعات */}
        <div className="space-y-6 text-right">
          {reviewsLoading ? (
            <p className="text-center text-gray-400 animate-pulse">جاري تحميل المراجعات...</p>
          ) : reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev._id} className="border-b border-gray-50 pb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">
                    {new Date(rev.createdAt).toLocaleDateString("ar-EG")}
                  </span>
                  <div className="text-yellow-400 text-xs">
                    {"★".repeat(rev.rating) + "☆".repeat(5 - rev.rating)}
                  </div>
                </div>
                <div className="font-bold text-gray-800 text-sm mb-1">{rev.userId?.name || "عميل موثق"}</div>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">{rev.comment}</p>
                {rev.adminReply && (
                  <div className="mr-4 p-3 bg-blue-50 rounded-xl border-r-4 border-blue-500 flex gap-2 items-start">
                    <CornerDownLeft size={16} className="text-blue-500 mt-1 shrink-0" />
                    <div>
                      <div className="text-[10px] font-black text-blue-600 mb-1">رد المتجر الرسمي:</div>
                      <p className="text-xs text-gray-700 leading-relaxed">{rev.adminReply.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border-dashed border-2 border-gray-100">
              <p className="text-gray-400 text-sm italic">لا توجد مراجعات لهذا المنتج حالياً.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
