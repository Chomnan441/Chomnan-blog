import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// แถบนำทางหลักของเว็บไซต์ รองรับทั้งหน้าจอ desktop และ mobile
function NavBar() {
  // เก็บสถานะเปิด/ปิดเมนูบนมือถือ (false = ปิด, true = เปิด)
  // useState: เป็น Hook ของ React ใช้สำหรับสร้างและจัดการ "สถานะ" (State) ภายในคอมโพเนนต์
  // สร้าง State ชื่อ isMenuOpen เพื่อจดจำว่าตอนนี้เมนูบนมือถือ "เปิด" หรือ "ปิด" อยู่ (ค่าเริ่มต้นคือ false หมายถึงปิด)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // สลับสถานะเมนูเมื่อกดปุ่ม hamburger
  // toggleMenu()
  // ฟังก์ชันสำหรับสลับสถานะเมนู ถ้าเปิดอยู่ให้ปิด ถ้าปิดอยู่ให้เปิด โดยใช้ค่าสถานะก่อนหน้า (prev) มาสลับค่าด้วย !prev ฟังก์ชันนี้จะถูกผูกกับปุ่ม Hamburger
  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  // ปิดเมนู mobile หลังผู้ใช้กดลิงก์ Log in หรือ Sign up
  // closeMenu()
  // ฟังก์ชันสำหรับบังคับปิดเมนู (false) ทันที จะถูกเรียกใช้เมื่อผู้ใช้กดคลิกลิงก์ (Log in / Sign up) ในโหมดมือถือ เพื่อให้เมนูหุบเก็บไปโดยอัตโนมัติ
  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="border-b border-stone-200 bg-blog-page">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-8 lg:px-16"
        aria-label="Main navigation"
      >
        {/* โลโก้/ชื่อเว็บไซต์ — ลิงก์กลับหน้าแรก */}
        <a
          href="#"
          className="text-2xl font-bold tracking-tight text-stone-950"
        >
          hh.
        </a>

        {/* ปุ่ม Log in / Sign up สำหรับหน้าจอ md ขึ้นไป (ซ่อนบนมือถือ) */}
        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="outline"
            className="h-11 rounded-full border-stone-950 bg-white px-6 text-base font-medium text-stone-950 hover:bg-stone-100"
            asChild
          >
            <a href="#">Log in</a>
          </Button>
          <Button
            className="h-11 rounded-full bg-stone-950 px-6 text-base font-medium text-white hover:bg-stone-800"
            asChild
          >
            <a href="#">Sign up</a>
          </Button>
        </div>

        {/* ปุ่ม hamburger แสดงเฉพาะบนมือถือ (md:hidden) */}
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-md text-stone-800 hover:bg-stone-200/60 md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          onClick={toggleMenu}
        >
          {/* เปลี่ยนไอคอนตามสถานะ: X เมื่อเปิด, Menu เมื่อปิด */}
          {isMenuOpen ? (
            <X className="size-6" aria-hidden="true" />
          ) : (
            <Menu className="size-6" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* เมนู mobile แสดงเมื่อ isMenuOpen เป็น true เท่านั้น */}
      {isMenuOpen && (
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
              {/* closeMenu ทำให้เมนูปิดหลังกดลิงก์ */}
              <a href="#" onClick={closeMenu}>
                Log in
              </a>
            </Button>
            <Button
              className="h-11 w-full rounded-full bg-stone-950 text-base font-medium text-white hover:bg-stone-800"
              asChild
            >
              <a href="#" onClick={closeMenu}>
                Sign up
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export default NavBar;
