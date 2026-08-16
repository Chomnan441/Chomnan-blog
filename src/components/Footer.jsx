// ส่วนท้ายของหน้าเว็บ (Footer) — แสดงลิงก์โซเชียลและลิงก์กลับหน้าแรก
import { Link } from "react-router-dom";

// Component ย่อยสำหรับไอคอน LinkedIn
// รับ props ชื่อ className เพื่อให้ parent กำหนดขนาด/สีผ่าน Tailwind ได้
// aria-hidden="true" = ซ่อนไอคอนจาก screen reader เพราะลิงก์มี aria-label อธิบายอยู่แล้ว
function LinkedInIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      {/* <path> คือแท็กที่ทรงพลังและยืดหยุ่นที่สุดในมาตรฐาน SVG (Scalable Vector Graphics) ครับ เปรียบเสมือน "ปากกาวิเศษ" ที่คุณสามารถป้อนคำสั่งให้มันลากเส้นตรง เส้นโค้ง หักมุม หรือวาดรูปทรงเรขาคณิตที่ซับซ้อนแค่ไหนก็ได้บนหน้าจอ
หัวใจสำคัญของการทำงานใน <path> คือ แอตทริบิวต์ d (ย่อมาจาก data) ซึ่งจะบรรจุชุดคำสั่งและพิกัด (x, y) ที่บอกว่าปากกานี้จะต้องเคลื่อนที่ไปทางไหน */}
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function GoogleIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.046 6.046 0 110-12.092 6.046 6.046 0 013.107.825l2.675-2.675A9.857 9.857 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c5.457 0 9.817-4.135 9.817-9.825 0-.625-.061-1.125-.179-1.618h-9.638z" />
    </svg>
  );
}

// array เก็บข้อมูลลิงก์โซเชียลทั้งหมด
// แต่ละ object มี label (ชื่อแสดง), href (URL ปลายทาง), icon (Component ไอคอน)
// แยกข้อมูลออกจาก JSX เพื่อเพิ่ม/แก้ลิงก์ได้ง่ายโดยไม่ต้องแก้โครงสร้าง HTML
const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/chomnan-phokhawatchanan-5b42b8420/",
    icon: LinkedInIcon,
  },
  {
    label: "GitHub",
    href: "https://github.com/Chomnan441",
    icon: GitHubIcon,
  },
  {
    label: "Email",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=chomnan415@gmail.com",
    icon: GoogleIcon,
  },
];

// export = ให้ไฟล์อื่น (เช่น App.jsx) import ไปใช้ได้
export function Footer() {
  return (
    // <footer> = แท็ก HTML สำหรับส่วนท้ายของหน้า (semantic HTML)
    <footer className="border-t border-stone-200 bg-blog-page">
      {/* container จัด layout: แนวตั้งบนมือถือ, แนวนอนบนจอ md ขึ้นไป */}
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-8 md:flex-row md:items-center md:px-8 lg:px-16">
        {/* กลุ่มซ้าย: ข้อความ "Get in touch" + รายการไอคอนโซเชียล */}
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-sm font-medium text-stone-700">Get in touch</p>
          {/* <ul> = รายการลิงก์ (semantic list) — aria-label ช่วย screen reader อ่านว่าเป็นลิงก์โซเชียล */}
          <ul className="flex items-center gap-4" aria-label="Social links">
            {/* .map() วนลูป array socialLinks แล้วสร้าง <li> ต่อรายการ */}
            {/* destructuring { label, href, icon: Icon } ดึงค่าจาก object — เปลี่ยนชื่อ icon เป็น Icon เพราะชื่อขึ้นต้นตัวพิมพ์ใหญ่ใช้กับ Component ได้ */}
            {/* key={label} บอก React ว่าแต่ละรายการในลิสต์คืออะไร (จำเป็นเมื่อ render จาก .map()) */}
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                {/* target="_blank" เปิดลิงก์ในแท็บใหม่ | rel="noopener noreferrer" ป้องกันช่องโหว่เมื่อเปิดแท็บใหม่ */}
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-stone-800 transition-opacity hover:opacity-70"
                >
                  {/* <Icon /> = render Component ไอคอนที่เก็บไว้ใน object (เช่น LinkedInIcon) */}
                  <Icon className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ลิงก์กลับหน้าแรก — อยู่กลุ่มขวาบนจอใหญ่ */}
        <Link
          to="/"
          className="text-sm font-medium text-stone-800 underline underline-offset-4 transition-colors hover:text-stone-600"
        >
          Home page
        </Link>
      </div>
    </footer>
  );
}
