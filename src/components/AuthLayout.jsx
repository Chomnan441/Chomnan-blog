import NavBar from "@/components/NavBar";

function AuthLayout({ children }) {
  return (
    <div className="flex min-h-svh flex-col bg-blog-page">
      <NavBar />
      <main className="flex flex-1 items-center justify-center px-4 py-10 md:px-8">
        {children}
      </main>
    </div>
  );
}

export default AuthLayout;
