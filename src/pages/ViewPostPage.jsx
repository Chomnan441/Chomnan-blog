import NavBar from "@/components/NavBar";
import ViewPost from "@/components/ViewPost";
import { Footer } from "@/components/Footer";

function ViewPostPage() {
  return (
    <div className="min-h-svh bg-blog-page">
      <NavBar />
      <main>
        <ViewPost />
      </main>
      <Footer />
    </div>
  );
}

export default ViewPostPage;
