"use client";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[40vh] bg-gray-50">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-black text-red-600">حدث خطأ غير متوقع</h2>
        <p className="text-gray-600 mt-2">جرّب إعادة تحميل القسم</p>
        <button
          onClick={() => reset()}
          className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-black text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}
