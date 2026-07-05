import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import ArticleSection from "@/components/ArticleSection";
import { Footer } from "@/components/Footer";

function HomePage() {
  return (
    <div className="min-h-svh bg-blog-page">
      <NavBar />
      <main>
        <HeroSection />
        <ArticleSection />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
