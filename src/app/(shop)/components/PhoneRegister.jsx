"use client";

import { useState } from "react";
import api from "@/app/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function PhoneRegister() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("enterPhone"); // enterPhone | verifyOtp
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // إرسال OTP
  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/send-otp", { phone });
      toast.success(res.data.message || "تم إرسال رمز التحقق إلى هاتفك");
      setStep("verifyOtp");
    } catch (error) {
      const msg = error.response?.data?.message || "حدث خطأ أثناء إرسال OTP";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // التحقق من OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { phone, otpCode: otp });
      toast.success(res.data.message || "تم التحقق بنجاح! تسجيل الدخول...");
      router.push("/"); // تحويل بعد تسجيل الدخول
    } catch (error) {
      const msg = error.response?.data?.message || "رمز OTP غير صحيح";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 mt-6">
      {step === "enterPhone" && (
        <>
          <input
            type="tel"
            placeholder="رقم الهاتف + الدولة"
            className="w-full rounded-2xl px-5 py-4 text-gray-700 bg-gray-100 placeholder-gray-400 shadow-inner outline-none focus:ring-2 focus:ring-red-500 text-right"
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <button
            onClick={handleSendOtp}
            disabled={loading}
            className={`w-full mt-2 text-white font-bold py-4 rounded-2xl shadow-lg transition-all ${
              loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700 active:scale-95"
            }`}
          >
            {loading ? "جاري الإرسال..." : "إرسال رمز التحقق"}
          </button>
        </>
      )}

      {step === "verifyOtp" && (
        <>
          <input
            type="text"
            placeholder="أدخل رمز OTP"
            className="w-full rounded-2xl px-5 py-4 text-gray-700 bg-gray-100 placeholder-gray-400 shadow-inner outline-none focus:ring-2 focus:ring-red-500 text-right"
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className={`w-full mt-2 text-white font-bold py-4 rounded-2xl shadow-lg transition-all ${
              loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700 active:scale-95"
            }`}
          >
            {loading ? "جاري التحقق..." : "تحقق من الرمز"}
          </button>
          <p
            className="text-sm text-red-600 text-center mt-2 cursor-pointer hover:underline"
            onClick={() => setStep("enterPhone")}
          >
            إعادة إرسال الرمز
          </p>
        </>
      )}
    </div>
  );
}
