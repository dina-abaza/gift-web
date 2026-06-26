import BannerCarousel from "./components/BannerCarousel";
import CategoryGrid from "./components/categoriesgrid";
import ReviewsLoader from "./components/ReviewsLoader";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <BannerCarousel />
      </div>
      <CategoryGrid />
      <ReviewsLoader />
    </main>
  );
}
