"use client";
import { useState } from "react";
import api from "@/app/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import GoogleSignInButton from "../components/GoogleSignInButton";
import PhoneRegister from "../components/PhoneRegister";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "", phone:""});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ username: "", email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // إعادة تعيين الأخطاء
    setErrors({ username: "", email: "", password: "" });
    
    // التحقق من الحقول
    let isValid = true;
    
    // التحقق من اسم المستخدم (5-100 حرف)
    if (!form.username.trim()) {
      setErrors(prev => ({ ...prev, username: "اسم المستخدم مطلوب" }));
      isValid = false;
    } else if (form.username.length < 5) {
      setErrors(prev => ({ ...prev, username: "اسم المستخدم يجب أن يكون على الأقل 5 أحرف" }));
      isValid = false;
    } else if (form.username.length > 100) {
      setErrors(prev => ({ ...prev, username: "اسم المستخدم يجب أن يكون على الأكثر 100 حرف" }));
      isValid = false;
    }
    
    // التحقق من البريد الإلكتروني (6-100 حرف)
    if (!form.email.trim()) {
      setErrors(prev => ({ ...prev, email: "البريد الإلكتروني مطلوب" }));
      isValid = false;
    } else if (form.email.length < 6) {
      setErrors(prev => ({ ...prev, email: "البريد الإلكتروني يجب أن يكون على الأقل 6 أحرف" }));
      isValid = false;
    } else if (form.email.length > 100) {
      setErrors(prev => ({ ...prev, email: "البريد الإلكتروني يجب أن يكون على الأكثر 100 حرف" }));
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrors(prev => ({ ...prev, email: "الرجاء إدخال بريد إلكتروني صحيح" }));
      isValid = false;
    }
    
    // التحقق من كلمة المرور (6-12 حرف)
    if (!form.password) {
      setErrors(prev => ({ ...prev, password: "كلمة المرور مطلوبة" }));
      isValid = false;
    } else if (form.password.length < 6) {
      setErrors(prev => ({ ...prev, password: "كلمة المرور يجب أن تكون على الأقل 6 أحرف" }));
      isValid = false;
    } else if (form.password.length > 12) {
      setErrors(prev => ({ ...prev, password: "كلمة المرور يجب أن تكون على الأكثر 12 حرف" }));
      isValid = false;
    }
    
    if (!isValid) {
      return;
    }
    
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      toast.success("تم إنشاء الحساب بنجاح! يمكنك الدخول الآن");
      router.push("/login");
    } catch (error) {
      const msg = error.response?.data?.message || "حدث خطأ أثناء إنشاء الحساب";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="bg-white w-full max-w-lg p-10 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">إنشاء حساب</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
          type="name"
            placeholder="اسم المستخدم"
            className="w-full rounded-2xl px-5 py-4 text-gray-700 bg-gray-100 placeholder-gray-400 shadow-inner outline-none focus:ring-2 focus:ring-red-500 text-right"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          {errors.username && <span className="text-red-500 text-xs">{errors.username}</span>}
          <input
            type="tel"
            placeholder="رقم الهاتف"
            className="w-full rounded-2xl px-5 py-4 text-gray-700 bg-gray-100 placeholder-gray-400 shadow-inner outline-none focus:ring-2 focus:ring-red-500 text-right"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            className="w-full rounded-2xl px-5 py-4 text-gray-700 bg-gray-100 placeholder-gray-400 shadow-inner outline-none focus:ring-2 focus:ring-red-500 text-right"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
          <input
            type="password"
            placeholder="كلمة المرور"
            className="w-full rounded-2xl px-5 py-4 text-gray-700 bg-gray-100 placeholder-gray-400 shadow-inner outline-none focus:ring-2 focus:ring-red-500 text-right"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
          <button 
            disabled={loading}
            className={`w-full mt-6 text-white font-bold py-4 rounded-2xl shadow-lg transition-all ${loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700 active:scale-95'}`}
          >
            {loading ? "جاري الإنشاء..." : "إنشاء حساب"}
          </button>
        </form>

        <GoogleSignInButton />

           {/* خط فاصل */}
        <div className="w-full flex items-center gap-3 text-xs text-gray-400 my-6">
          <span className="h-px flex-1 bg-gray-200"></span>
          <span>أو التسجيل برقم الهاتف</span>
          <span className="h-px flex-1 bg-gray-200"></span>
        </div>

        {/* تسجيل برقم الهاتف */}
        <PhoneRegister />

        <p className="text-sm text-center mt-6 text-gray-500">
          عندك حساب؟{" "}
          <Link href="/login" className="text-red-600 font-semibold hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
