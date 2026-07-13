import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

function AdminPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-svh bg-blog-page">
      <NavBar />

      <main className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-4 py-12 md:px-8">
        <header>
          <h1 className="text-3xl font-bold text-stone-950">Admin panel</h1>
          <p className="mt-2 text-stone-600">
            Welcome, {user?.name}. This is a placeholder admin area for
            managing blog content.
          </p>
        </header>

        <section className="w-full rounded-3xl bg-stone-300/40 px-6 py-8 md:px-8">
          <p className="text-stone-700">
            Admin tools will be available here in a future update.
          </p>
          <Button
            className="mt-6 h-11 rounded-full bg-stone-950 px-6 text-base font-medium text-white hover:bg-stone-800"
            asChild
          >
            <Link to="/">Back to home</Link>
          </Button>
        </section>
      </main>
    </div>
  );
}

export default AdminPage;
