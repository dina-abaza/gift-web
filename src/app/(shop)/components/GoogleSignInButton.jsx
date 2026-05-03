"use client";

import { GoogleLogin } from "@react-oauth/google";
import api from "@/app/api";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/(shop)/store/useAuthStore";
import { toast } from "react-toastify";

export default function GoogleSignInButton() {
  const router = useRouter();
  const checkAuth = useAuthStore((state) => state.checkAuth);

  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse?.credential;
    if (!token) {
      toast.error("تعذّر الحصول على رمز Google");
      return;
    }
    try {
      const res = await api.post("/auth/google", { token });
      if (res.data?.tokens) {
        localStorage.setItem("accessToken", res.data.tokens.accessToken || "");
        localStorage.setItem("refreshToken", res.data.tokens.refreshToken || "");
      }
      await checkAuth();
      toast.success("تم تسجيل الدخول عبر Google");
      router.push("/");
    } catch (error) {
      const msg = error.response?.data?.message || "فشل التحقق من Google";
      toast.error(msg);
    }
  };

  const handleError = () => {
    toast.error("فشل تسجيل الدخول عبر Google");
  };

  return (
    <div className="mt-6 flex flex-col items-center gap-4">
      <div className="w-full flex items-center gap-3 text-xs text-gray-400">
        <span className="h-px flex-1 bg-gray-200"></span>
        <span>أو</span>
        <span className="h-px flex-1 bg-gray-200"></span>
      </div>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        use_fedcm_for_prompt={false}
        use_fedcm_for_button={false}
        ux_mode="popup"
        promptMomentNotification={(notification) => {
          if (notification.isNotDisplayed?.()) {
            console.warn("Google prompt not displayed:", notification.getNotDisplayedReason?.());
          }
        }}
      />
    </div>
  );
}
