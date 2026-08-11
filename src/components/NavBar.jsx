import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  Bell,
  ChevronDown,
  UserRound,
  KeyRound,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  fetchNotifications,
  markAllNotificationsRead,
} from "@/lib/notificationsApi";
import { DEFAULT_AVATAR } from "@/lib/auth";
import logo from "@/assets/logo.svg";
import logoHover from "@/assets/logo-hoverNew.gif";

function NavBar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  // State (useState) — เปิด/ปิด UI
  const [isMenuOpen, setIsMenuOpen] = useState(false); // เมนูมือถือ (hamburger) ของคนที่ยังไม่ล็อกอิน
  const [isProfileOpen, setIsProfileOpen] = useState(false); // dropdown โปรไฟล์ (หลังล็อกอิน)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false); // dropdown แจ้งเตือน
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  // Ref (useRef) — ชี้ไปที่ DOM
  const profileRef = useRef(null); // กล่อง dropdown โปรไฟล์
  const notificationsRef = useRef(null); //กล่อง dropdown แจ้งเตือน

  // เปิด/ปิด menu มือถือ
  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }
  function closeMenu() {
    setIsMenuOpen(false);
  }

  // โหลดแจ้งเตือนเมื่อล็อกอินแล้ว
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setHasUnread(false);
      return;
    }

    let cancelled = false;

    async function loadNotifications() {
      const result = await fetchNotifications();
      if (cancelled || !result.success) return;
      setNotifications(result.notifications);
      setHasUnread(result.notifications.some((item) => !item.isRead));
    }

    loadNotifications();
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function handleOpenNotifications() {
    const nextOpen = !isNotificationsOpen;
    setIsNotificationsOpen(nextOpen);
    setIsProfileOpen(false);

    if (nextOpen && hasUnread) {
      await markAllNotificationsRead();
      setHasUnread(false);
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true })),
      );
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      // profileRef.current มีไหม? (กล่องที่ ref={profileRef} ถูก mount แล้ว)
      // จุดที่คลิก ไม่อยู่ใน กล่องนั้นไหม? (!contains(...))
      // ถ้าใช่ทั้งคู่ → ปิด dropdown โปรไฟล์
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // logout() — จาก useAuth() เคลียร์ user ใน Context + ลบ session ใน localStorage
  // setIsProfileOpen(false) — ปิด dropdown โปรไฟล์
  // closeMenu() — ปิดเมนูมือถือ (ถ้าเปิดอยู่)
  // navigate("/") — พาไปหน้าแรก
  // สรุป: ออกจากระบบ → ปิดเมนูที่เปิดอยู่ → กลับหน้า Home
  function handleLogout() {
    logout();
    setIsProfileOpen(false);
    closeMenu();
    navigate("/");
  }

  // ใช้ตอนกดรายการใน dropdown โปรไฟล์ (ไป Profile / Reset password / Admin)
  function handleMenuNavigate(path) {
    setIsProfileOpen(false);
    navigate(path); // ไปหน้าตาม path ที่ส่งเข้ามา
  }
  // user?.avatar — ถ้ามี user และมี avatar ให้ใช้ค่านั้น (?. กันพังตอน user เป็น null เช่นยังไม่ล็อกอิน)
  // || DEFAULT_AVATAR — ถ้าไม่มี avatar (ว่าง/undefined) ให้ใช้รูปเริ่มต้น
  const avatarSrc = user?.avatar || DEFAULT_AVATAR;

  return (
    <header className="border-b border-stone-200 bg-blog-page">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-0 md:px-8 lg:px-16"
        aria-label="Main navigation"
      >
        {/* logo */}
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

        {/* ถ้ามี user แสดงรูปภาพผู้ใช้งาน และ dropdown โปรไฟล์ */}
        {/* ternary operator */}
        {user ? (
          <div className="flex items-center gap-3 md:gap-4">
            {/* notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                className="relative flex size-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                aria-label="Notifications"
                aria-expanded={isNotificationsOpen}
                aria-haspopup="menu"
                onClick={handleOpenNotifications}
              >
                <Bell className="size-5" aria-hidden="true" />
                {hasUnread && (
                  <span
                    className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500"
                    aria-hidden="true"
                  />
                )}
              </button>

              {/* dropdown แจ้งเตือน */}
              {isNotificationsOpen && (
                <div
                  role="menu"
                  className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,22rem)] rounded-2xl border border-stone-200 bg-white py-2 shadow-lg"
                >
                  {notifications.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-stone-500">
                      No notifications yet.
                    </p>
                  ) : (
                    notifications.slice(0, 8).map((notification) => (
                      <article
                        key={notification.id}
                        role="menuitem"
                        className="flex gap-3 px-4 py-3 hover:bg-stone-50"
                      >
                        <span className="size-10 shrink-0 overflow-hidden rounded-full bg-stone-200">
                          <img
                            src={notification.avatar}
                            alt={`${notification.name} avatar`}
                            className="size-full object-cover"
                          />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm text-stone-800">
                            <span className="font-semibold">
                              {notification.name}
                            </span>{" "}
                            {notification.message}
                          </p>
                          <p className="mt-1 text-xs text-orange-700/80">
                            {notification.time}
                          </p>
                        </div>
                      </article>
                    ))
                  )}
                  {isAdmin && (
                    <div className="border-t border-stone-100 px-4 py-2">
                      <Link
                        to="/admin/notifications"
                        className="text-sm font-medium text-stone-950 underline underline-offset-2"
                        onClick={() => setIsNotificationsOpen(false)}
                      >
                        View all
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              {/* button โปรไฟล์ */}
              <button
                type="button"
                className="flex items-center gap-2 rounded-full py-1 pr-1 pl-1 hover:bg-stone-200/50 md:gap-3 md:pr-2"
                aria-expanded={isProfileOpen}
                aria-haspopup="menu"
                onClick={() => {
                  setIsProfileOpen((prev) => !prev);
                  setIsNotificationsOpen(false);
                }}
              >
                <img
                  src={avatarSrc}
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

              {/* profile / reset password (user เท่านั้น), admin panel (admin), logout */}
              {isProfileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-stone-200 bg-white py-1 shadow-lg"
                >
                  {!isAdmin && (
                    <>
                      <button
                        type="button"
                        role="menuitem"
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-stone-700 hover:bg-stone-100"
                        onClick={() => handleMenuNavigate("/profile")}
                      >
                        <UserRound
                          className="size-4 shrink-0"
                          aria-hidden="true"
                        />
                        Profile
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-stone-700 hover:bg-stone-100"
                        onClick={() => handleMenuNavigate("/reset-password")}
                      >
                        <KeyRound
                          className="size-4 shrink-0"
                          aria-hidden="true"
                        />
                        Reset password
                      </button>
                    </>
                  )}
                  {isAdmin && (
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-stone-700 hover:bg-stone-100"
                      onClick={() => handleMenuNavigate("/admin/articles")}
                    >
                      <LayoutDashboard
                        className="size-4 shrink-0"
                        aria-hidden="true"
                      />
                      Admin panel
                    </button>
                  )}
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-stone-700 hover:bg-stone-100"
                    onClick={handleLogout}
                  >
                    <LogOut className="size-4 shrink-0" aria-hidden="true" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          // else ของ ternary (ตอนยังไม่ล็อกอิน) ต้องคืน 2 อย่างพร้อมกัน:
          // 1. button ล็อกอิน และ button ลงทะเบียน
          // 2. button เมนูมือถือ (hamburger)
          <>
            {/* button ล็อกอิน และ button ลงทะเบียน */}
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

            {/* button เมนูมือถือ (hamburger) */}
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-md text-stone-800 hover:bg-stone-200/60 md:hidden"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={toggleMenu} // setIsMenuOpen(true) หรือ setIsMenuOpen(false)
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

      {/* หลังจากกด button เมนูมือถือ (hamburger) แสดง menu มือถือ */}
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
