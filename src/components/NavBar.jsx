import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/logo.svg";
import logoHover from "@/assets/logo-hoverNew.gif";

function NavBar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setIsProfileOpen(false);
    closeMenu();
  }

  return (
    <header className="border-b border-stone-200 bg-blog-page">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-0 md:px-8 lg:px-16"
        aria-label="Main navigation"
      >
        <Link to="/" className="group inline-flex shrink-0 items-center">
          <span className="relative inline-block h-15 md:h-20">
            <img
              src={logo}
              alt="Chomnan Blog logo"
              className="h-15 w-auto object-contain opacity-100 transition-all duration-300 ease-in-out group-hover:scale-95 group-hover:opacity-0 md:h-20"
            />
            <img
              src={logoHover}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-100 object-contain opacity-0 transition-all duration-300 ease-in-out group-hover:scale-100 group-hover:opacity-100"
            />
          </span>
        </Link>

        {user ? (
          <div className="flex items-center gap-3 md:gap-4">
            <button
              type="button"
              className="relative flex size-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
              aria-label="Notifications"
            >
              <Bell className="size-5" aria-hidden="true" />
              <span
                className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500"
                aria-hidden="true"
              />
            </button>

            <div className="relative" ref={profileRef}>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full py-1 pr-1 pl-1 hover:bg-stone-200/50 md:gap-3 md:pr-2"
                aria-expanded={isProfileOpen}
                aria-haspopup="menu"
                onClick={() => setIsProfileOpen((prev) => !prev)}
              >
                <img
                  src={user.avatar}
                  alt={`${user.name} profile`}
                  className="size-9 rounded-full object-cover md:size-10"
                />
                <span className="hidden text-sm font-medium text-stone-950 sm:inline">
                  {user.name}
                </span>
                <ChevronDown
                  className="hidden size-4 text-stone-500 sm:block"
                  aria-hidden="true"
                />
              </button>

              {isProfileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 z-50 mt-2 w-40 rounded-xl border border-stone-200 bg-white py-1 shadow-lg"
                >
                  <button
                    type="button"
                    role="menuitem"
                    className="w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-100"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="hidden items-center gap-3 md:flex">
              <Button
                variant="outline"
                className="h-11 rounded-full border-stone-950 bg-white px-6 text-base font-medium text-stone-950 hover:bg-stone-100"
                asChild
              >
                <Link to="/login">Log in</Link>
              </Button>
              <Button
                className="h-11 rounded-full bg-stone-950 px-6 text-base font-medium text-white hover:bg-stone-800"
                asChild
              >
                <Link to="/sign-up">Sign up</Link>
              </Button>
            </div>

            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-md text-stone-800 hover:bg-stone-200/60 md:hidden"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="size-6" aria-hidden="true" />
              ) : (
                <Menu className="size-6" aria-hidden="true" />
              )}
            </button>
          </>
        )}
      </nav>

      {!user && isMenuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-stone-300/60 bg-blog-page px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="h-11 w-full rounded-full border-stone-950 bg-white text-base font-medium text-stone-950 hover:bg-stone-100"
              asChild
            >
              <Link to="/login" onClick={closeMenu}>
                Log in
              </Link>
            </Button>
            <Button
              className="h-11 w-full rounded-full bg-stone-950 text-base font-medium text-white hover:bg-stone-800"
              asChild
            >
              <Link to="/sign-up" onClick={closeMenu}>
                Sign up
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export default NavBar;
