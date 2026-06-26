"use client";
import dynamic from "next/dynamic";

const ReviewsComponent = dynamic(() => import("./ReviewsComponent"), {
  ssr: false,
  loading: () => (
    <div className="py-16 text-center animate-pulse text-gray-400">
      جاري تحميل التقييمات...
    </div>
  ),
});

export default function ReviewsLoader() {
  return <ReviewsComponent />;
}
