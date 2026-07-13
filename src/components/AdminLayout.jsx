import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Bell,
  ExternalLink,
  FileText,
  FolderOpen,
  KeyRound,
  LogOut,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.svg";

const ADMIN_NAV_LINKS = [
  {
    to: "/admin/articles",
    label: "Article management",
    icon: FileText,
  },
  {
    to: "/admin/categories",
    label: "Category management",
    icon: FolderOpen,
  },
  {
    to: "/profile",
    label: "Profile",
    icon: UserRound,
  },
  {
    to: "/admin/notifications",
    label: "Notification",
    icon: Bell,
  },
  {
    to: "/reset-password",
    label: "Reset password",
    icon: KeyRound,
  },
];

function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="flex min-h-svh bg-white">
      <aside className="flex w-64 shrink-0 flex-col border-r border-stone-200 bg-stone-100">
        <header className="px-6 pt-8 pb-6">
          <Link to="/" className="inline-flex items-center">
            <img
              src={logo}
              alt="Chomnan Blog logo"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <p className="mt-2 text-sm font-medium text-orange-400">
            Admin panel
          </p>
        </header>

        <nav
          aria-label="Admin navigation"
          className="flex flex-1 flex-col gap-1 px-3"
        >
          {ADMIN_NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-stone-200/80 font-medium text-stone-950 before:absolute before:top-1/2 before:left-0 before:h-6 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-stone-800"
                    : "text-stone-600 hover:bg-stone-200/50 hover:text-stone-900",
                )
              }
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <footer className="mt-auto flex flex-col gap-1 border-t border-stone-200 px-3 py-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-stone-600 transition-colors hover:bg-stone-200/50 hover:text-stone-900"
          >
            <ExternalLink className="size-5 shrink-0" aria-hidden="true" />
            Website
          </Link>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-stone-600 transition-colors hover:bg-stone-200/50 hover:text-stone-900"
            onClick={handleLogout}
          >
            <LogOut className="size-5 shrink-0" aria-hidden="true" />
            Log out
          </button>
        </footer>
      </aside>

      <main className="min-w-0 flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
