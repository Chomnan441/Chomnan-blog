import { NavLink } from "react-router-dom";
import { UserRound, KeyRound } from "lucide-react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";
import { DEFAULT_AVATAR } from "@/lib/auth";
import { cn } from "@/lib/utils";

const SIDEBAR_LINKS = [
  {
    to: "/profile",
    label: "Profile",
    icon: UserRound,
  },
  {
    to: "/reset-password",
    label: "Reset password",
    icon: KeyRound,
  },
];

function AccountLayout({ title, children }) {
  const { user } = useAuth();
  const avatarSrc = user?.avatar || DEFAULT_AVATAR;

  return (
    <div className="min-h-svh bg-blog-page">
      <NavBar />

      <main className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-10">
        <header className="mb-8 flex items-center gap-3 md:gap-4">
          <img
            src={avatarSrc}
            alt={`${user?.name || "User"} avatar`}
            className="size-12 rounded-full object-cover md:size-14"
          />
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="text-xl font-semibold text-stone-950 md:text-2xl">
              {user?.name}
            </h1>
            <span
              className="hidden h-5 w-px bg-stone-300 sm:block"
              aria-hidden="true"
            />
            <p className="text-xl font-semibold text-stone-950 md:text-2xl">
              {title}
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-8 md:flex-row md:gap-12">
          <aside className="shrink-0 md:w-48">
            <nav aria-label="Account settings" className="flex flex-col gap-1">
              {SIDEBAR_LINKS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm transition-colors",
                      isActive
                        ? "font-medium text-stone-950"
                        : "text-stone-500 hover:text-stone-800",
                    )
                  }
                >
                  <Icon className="size-5 shrink-0" aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </aside>

          <section className="min-w-0 flex-1">{children}</section>
        </div>
      </main>
    </div>
  );
}

export default AccountLayout;
