"use client";
import dynamic from "next/dynamic";

const OffersCarousel = dynamic(() => import("./OffersCarousel"), {
  ssr: false,
  loading: () => (
    <div className="py-16 text-center animate-pulse text-red-600 font-bold">
      جاري تحميل العروض...
    </div>
  ),
});

export default function OffersCarouselLoader() {
  return <OffersCarousel />;
}
