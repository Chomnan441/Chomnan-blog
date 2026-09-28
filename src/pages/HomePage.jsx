import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import ArticleSection from "@/components/ArticleSection";
import { Footer } from "@/components/Footer";

function HomePage() {
  return (
    <div className="flex min-h-svh flex-col bg-public-canvas">
      <NavBar />
      <main className="flex-1">
        <HeroSection />
        <ArticleSection />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
