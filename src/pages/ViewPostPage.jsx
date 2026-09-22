import NavBar from "@/components/NavBar";
import ViewPost from "@/components/ViewPost";
import { Footer } from "@/components/Footer";

function ViewPostPage() {
  return (
    <div className="flex min-h-svh flex-col bg-public-canvas">
      <NavBar />
      <main className="flex-1">
        <ViewPost />
      </main>
      <Footer />
    </div>
  );
}

export default ViewPostPage;
