"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/app/(shop)/store/useAuthStore";
import { useCartStore } from "@/app/(shop)/store/useCartStore";
import { Trash2, Plus, Minus, ShoppingBasket, ArrowRight, Truck, X, MapPin, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import api from "@/app/api";

const CartPage = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { cart, loading, fetchCart, updateQty, removeItem } = useCartStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shippingData, setShippingData] = useState({
    name: user?.username || "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    const userId = user?.id || user?._id;
    if (userId) fetchCart(userId);
  }, [user, fetchCart]);

  // حساب المجموع الكلي
  const totalPrice = cart?.items?.reduce(
    (acc, item) => acc + ((item.priceAtAdd || item.productId?.price || 0) * (item.qty || 1)),
    0
  );

const handleConfirmOrder = async (e) => {
  e.preventDefault();

  if (!shippingData.phone || !shippingData.address) {
    return toast.error("يرجى ملء جميع البيانات");
  }

  if (!cart?.items || cart.items.length === 0) {
    return toast.error("سلتك فارغة ولا يمكن إنشاء طلب");
  }

  try {
    const orderData = {
      userId: user?.id || user?._id,
      address: shippingData.address,
      phone: shippingData.phone
    };

    const response = await api.post(
      '/orders',
      orderData);

    toast.success("تم إنشاء الطلب بنجاح!");
    console.log("طلب جديد:", response.data);
   fetchCart(user?._id || user?.id);

    setIsModalOpen(false);
    // إفراغ السلة لو حابة
    // fetchCart(user?.id || user?._id);
  } catch (error) {
    console.error("خطأ في إنشاء الطلب:", error.response?.data || error.message);
    toast.error("فشل إنشاء الطلب. حاول لاحقاً");
  }
};

  if (!isAuthenticated) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <ShoppingBasket size={80} className="text-gray-200 mb-4" />
      <h2 className="text-xl font-bold text-gray-600">سجل دخولك لمتابعة التسوق</h2>
      <Link href="/login" className="bg-red-600 text-white px-10 py-3 rounded-3xl font-bold shadow-lg mt-4">تسجيل الدخول</Link>
    </div>
  );

  return (
    <div className="bg-[#f8f8f8] min-h-screen pb-32 relative" dir="rtl">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md sticky top-0 z-40 p-4 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-center relative">
          <button onClick={() => router.back()} className="text-red-600 absolute right-0 p-2"><ArrowRight size={28} /></button>
          <h1 className="text-red-600 font-extrabold text-xl">سلة المشتريات</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4">
        {!cart?.items || cart.items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 px-6">
            <ShoppingBasket size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-bold">سلتك فارغة حالياً</p>
            <Link href="/" className="bg-red-600 text-white px-8 py-3 rounded-2xl font-bold mt-6 inline-block">تصفح الأقسام</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {cart.items.map((item, idx) => (
              <div key={item._id || idx} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="relative w-20 h-20 bg-gray-50 rounded-2xl p-2 flex items-center justify-center">
                  <Image
                    src={item.productId?.image || "/placeholder.png"}
                    alt={item.productId?.name || "صورة المنتج"}
                    fill
                    sizes="80px"
                    loading="lazy"
                    className="max-h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-sm">{item.productId?.name || "اسم غير متوفر"}</h3>
                  <p className="text-red-600 font-black text-sm">{(item.priceAtAdd || item.productId?.price)?.toLocaleString() || 0} د.ع</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-4 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                      <button onClick={() => updateQty(user?.id || user?._id, item.productId._id, (item.qty || 1) + 1)} className="text-green-700"><Plus size={18} /></button>
                      <span className="font-bold text-gray-700">{item.qty || 1}</span>
                      <button onClick={() => updateQty(user?.id || user?._id, item.productId._id, Math.max(1, (item.qty || 1) - 1))} className="text-red-600" disabled={(item.qty || 1) <= 1}><Minus size={18} /></button>
                    </div>
                    <button onClick={() => removeItem(user?.id || user?._id, item.productId._id)} className="text-gray-300 hover:text-red-600"><Trash2 size={20} /></button>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-4 bg-white rounded-3xl p-6 shadow-xl border border-red-50">
              <div className="flex justify-between items-center mb-6 pt-3">
                <span className="text-gray-800 font-extrabold text-lg">المبلغ الإجمالي:</span>
                <span className="text-2xl font-black text-red-600">{totalPrice?.toLocaleString()} د.ع</span>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg"
              >
                إتمام الطلب الآن
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-t-[40px] md:rounded-[40px] p-6 shadow-2xl relative animate-in slide-in-from-bottom duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 left-6 text-gray-400"><X size={24} /></button>
            
            <div className="text-center mb-6">
              <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                <Truck className="text-red-600" size={30} />
              </div>
              <h2 className="text-xl font-black text-gray-800">تأكيد بيانات التوصيل</h2>
              <p className="text-gray-400 text-sm">الدفع نقداً عند استلام الطلب</p>
            </div>

            <form onSubmit={handleConfirmOrder} className="space-y-4">
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" placeholder="الاسم الكامل" 
                  className="w-full bg-gray-50 border-none rounded-2xl py-3 pr-12 pl-4 outline-none focus:ring-2 focus:ring-red-100"
                  value={shippingData.name}
                  onChange={(e) => setShippingData({...shippingData, name: e.target.value})}
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="tel" placeholder="رقم الهاتف" 
                  className="w-full bg-gray-50 border-none rounded-2xl py-3 pr-12 pl-4 outline-none focus:ring-2 focus:ring-red-100 text-right"
                  value={shippingData.phone}
                  onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                  required
                />
              </div>

              <div className="relative">
                <MapPin className="absolute right-4 top-3 text-gray-400" size={18} />
                <textarea 
                  placeholder="العنوان بالتفصيل (المحافظة، المنطقة، نقطة دالة)" 
                  className="w-full bg-gray-50 border-none rounded-2xl py-3 pr-12 pl-4 outline-none focus:ring-2 focus:ring-red-100 min-h-[100px]"
                  value={shippingData.address}
                  onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                  required
                />
              </div>

              <div className="bg-red-50 p-4 rounded-2xl">
                <div className="flex justify-between items-center text-red-700 font-bold">
                  <span>المبلغ المطلوب عند الاستلام:</span>
                  <span>{totalPrice?.toLocaleString()} د.ع</span>
                </div>
              </div>

              <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg mt-2 transition-transform active:scale-95">
                تأكيد طلب الشراء
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
