import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

function NotFoundPage() {
  return (
    <div className="min-h-svh bg-blog-page">
      <NavBar />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24">
        <div className="flex size-24 items-center justify-center rounded-full border-2 border-stone-300 text-4xl font-bold text-stone-500">
          !
        </div>
        <h1 className="mt-8 text-3xl font-bold text-stone-950">Page Not Found</h1>
        <Button
          asChild
          className="mt-8 h-11 rounded-full bg-stone-950 px-8 text-base font-medium text-white hover:bg-stone-800"
        >
          <Link to="/">Go To Homepage</Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
}

export default NotFoundPage;
