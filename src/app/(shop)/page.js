
import CategoryGrid from "./components/categoriesgrid";
import BannerCarousel from "./components/BannerCarousel";
import OffersCarouselLoader from "./components/OffersCarouselLoader";
import ReviewsComponent from "./components/ReviewsComponent";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <BannerCarousel />
      </div>
      <div>
        <CategoryGrid />
      </div>
      <OffersCarouselLoader />
      <ReviewsComponent />
    </main>
  );
}
