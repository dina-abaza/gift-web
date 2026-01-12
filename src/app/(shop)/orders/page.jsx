  "use client";
  import { useEffect, useState } from "react";
  import api from "@/app/api";
  import Link from "next/link";
  import { useAuthStore } from "@/app/(shop)/store/useAuthStore";
  import { ArrowRight, Package } from "lucide-react";   
import { useRouter } from 'next/navigation';

  export default function OrdersPage() {
    const user = useAuthStore((s) => s.user);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const authLoading = useAuthStore((s) => s.loading);
    const checkAuth = useAuthStore((s) => s.checkAuth);
const router = useRouter();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
      if (!isAuthenticated) {
        checkAuth();
      }
    }, [isAuthenticated, checkAuth]);

    useEffect(() => {
      const fetchOrders = async () => {
        const uid = user?._id || user?.id;
        if (!uid) return;
        setLoading(true);
        setError("");
        try {
          const res = await api.get(`/orders/${uid}`);
          setOrders(Array.isArray(res.data) ? res.data : res.data?.orders || []);
        } catch (e) {
          setError("حدث خطأ أثناء جلب الطلبات");
        } finally {
          setLoading(false);
        }
      };
      if (isAuthenticated && (user?._id || user?.id)) {
        fetchOrders();
      }
    }, [isAuthenticated, user]);

    const statusStyle = (s) => {
      const map = {
        pending: "bg-yellow-100 text-yellow-700",
        processing: "bg-blue-100 text-blue-700",
        on_route: "bg-purple-100 text-purple-700",
        delivered: "bg-green-100 text-green-700",
        canceled: "bg-gray-200 text-gray-600",
      };
      return map[s] || "bg-gray-100 text-gray-700";
    };

    return (
      <div className="min-h-[calc(100vh-5rem)] bg-gray-50" dir="rtl">
   <div className="bg-white/90 backdrop-blur-md sticky top-0 z-40 p-4 shadow-sm border-b border-gray-100">
  <div className="max-w-7xl mx-auto flex items-center justify-center relative">
    {/* السهم على اليمين */}
    <button
      onClick={() => router.back()}
      className="text-red-600 absolute right-0 p-2 hover:bg-red-50 rounded-full"
    >
      <ArrowRight size={28} strokeWidth={2.5} />
    </button>

    {/* العنوان مع أيقونة الطلبات */}
    <div className="flex items-center gap-2">
      <Package className="text-gray-600" size={24} strokeWidth={2} />
      <h1 className="text-red-600 font-extrabold text-xl md:text-2xl">
        طلباتي
      </h1>
    </div>
  </div>
</div>


          {!isAuthenticated && !authLoading && (
            <div className="bg-white rounded-2xl shadow p-6 text-center">
              <p className="text-gray-700 mb-4">من فضلك سجل الدخول لعرض طلباتك</p>
              <Link href="/login" className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold">
                تسجيل الدخول
              </Link>
            </div>
          )}

          {(authLoading || loading) && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />
                  <div className="h-32 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          )}

          {!loading && isAuthenticated && error && (
            <div className="bg-white rounded-2xl shadow p-6 text-center text-red-600 font-bold">
              {error}
            </div>
          )}

          {!loading && isAuthenticated && !error && (
            <>
              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow p-6 text-center">
                  <p className="text-gray-700">لا توجد طلبات حتى الآن</p>
                  <Link href="/" className="inline-block mt-4 bg-red-600 text-white px-6 py-3 rounded-xl font-bold">
                    ابدأ التسوق
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orders.map((o) => {
                    const id = o?._id || o?.id || "";
                    const created = o?.createdAt ? new Date(o.createdAt) : null;
                    const dateStr = created ? created.toLocaleDateString() : "غير متوفر";
                    const total = o?.total || o?.totalPrice || 0;
                    const items = o?.items || o?.orderItems || [];
                    const status = o?.status || "pending";
                    return (
                      <div key={id} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">رقم الطلب</span>
                          <span className="font-bold text-gray-800">{id.slice(-6)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">التاريخ</span>
                          <span className="font-bold text-gray-800">{dateStr}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">الإجمالي</span>
                          <span className="font-bold text-red-600">{Number(total).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">الحالة</span>
                          <span className={`px-3 py-1 rounded-xl text-xs font-bold ${statusStyle(status)}`}>
                            {status === "on_route" ? "في الطريق" :
                            status === "delivered" ? "تم التسليم" :
                            status === "processing" ? "جاري التجهيز" :
                            status === "pending" ? "قيد الانتظار" :
                            status === "canceled" ? "ملغي" : status}
                          </span>
                        </div>
                        <div className="border-t pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xl text-green-800">عدد المنتجات</span>
                            <span className="font-bold text-green-600">{items?.length || 0}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {items.slice(0, 6).map((it, idx) => (
                              <div key={idx} className="bg-gray-100 rounded-xl p-2 text-center">
                                <div className="text-xs font-bold text-gray-700 line-clamp-1">{it?.name || it?.product?.name || "منتج"}</div>
                                <div className="text-[11px] text-gray-500">{it?.qty || 1}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
     
    );
  }
