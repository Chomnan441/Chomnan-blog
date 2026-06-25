// นำเข้าไอคอน Search จาก lucide-react สำหรับแสดงในช่องค้นหา
import { Search } from "lucide-react";
// นำเข้า UI components ที่เตรียมไว้แล้วจาก shadcn/ui
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// ArticleCard = การ์ดแสดงบทความแต่ละชิ้น
import ArticleCard from "@/components/ArticleCard";
// ARTICLES = ข้อมูลบทความทั้งหมด (เก็บในไฟล์ data/articles.js)
import { ARTICLES } from "@/data/articles";

// รายการหมวดหมู่บทความ — value ใช้เป็นค่าภายใน, label ใช้แสดงบนหน้าจอ
const CATEGORIES = [
  { value: "highlight", label: "Highlight" },
  { value: "cat", label: "Cat" },
  { value: "inspiration", label: "Inspiration" },
  { value: "general", label: "General" },
];

// ArticleSection = ส่วนแสดงบทความล่าสุด พร้อมช่องค้นหาและตัวกรองหมวดหมู่
function ArticleSection() {
  return (
    // <section> = แท็ก HTML สำหรับส่วนเนื้อหาหลักของหน้า (semantic HTML)
    <section className="bg-blog-page px-4 pb-12 md:px-8 lg:px-16">
      {/* กล่องสีขาวตรงกลาง(ที่ครอปส่วนบทความทั้งหมด) — max-w-7xl จำกัดความกว้างไม่ให้กว้างเกินจอใหญ่ */}
      <div className="mx-auto max-w-7xl rounded-3xl bg-white px-5 py-8 md:px-8 md:py-10">
        <h2 className="text-2xl font-bold text-stone-950 md:text-3xl">
          Latest articles
        </h2>

        {/* --- เลย์เอาต์มือถือ (md:hidden = ซ่อนเมื่อหน้าจอกว้าง ≥768px) --- */}
        <div className="mt-6 flex flex-col gap-6 md:hidden">
          {/* ช่องค้นหา — readOnly หมายความว่ายังพิมพ์ไม่ได้ (แค่แสดง UI) */}
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search"
              readOnly
              aria-label="Search articles"
              className="h-12 w-full rounded-xl border-stone-200 bg-white pr-11 text-base text-stone-950 placeholder:text-stone-400"
            />
            {/* ไอคอนวางทับช่อง input — absolute + top-1/2 + -translate-y-1/2 จัดให้อยู่กลางแนวตั้ง */}
            <Search
              className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-stone-400"
              aria-hidden="true"
            />
          </div>

          {/* Dropdown เลือกหมวดหมู่ — ใช้บนมือถือแทนปุ่มหมวดหมู่ */}
          <div className="flex w-full flex-col gap-1">
            <Label
              htmlFor="article-category"
              className="text-sm font-medium text-stone-500"
            >
              Category
            </Label>
            <Select defaultValue="highlight">
              <SelectTrigger
                id="article-category"
                className="h-12 w-full min-w-0 rounded-xl border-stone-200 bg-white px-4 text-base text-stone-950 data-[size=default]:h-12 [&_svg]:size-5 [&_svg]:text-stone-400"
              >
                <SelectValue placeholder="Highlight" />
              </SelectTrigger>
              <SelectContent>
                {/* .map() วนลูปสร้าง <SelectItem> จากทุกรายการใน CATEGORIES */}
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* --- เลย์เอาต์เดสก์ท็อป (hidden md:flex = ซ่อนบนมือถือ, แสดงเมื่อ ≥768px) --- */}
        <div className="mt-6 hidden items-center justify-between gap-6 rounded-2xl bg-stone-100 p-3 md:flex">
          {/* ปุ่มหมวดหมู่แบบแนวนอน — ปุ่มแรก (index === 0) ถูกไฮไลต์เป็นสีเข้ม */}
          <ul
            className="flex flex-wrap items-center gap-2"
            aria-label="Article categories"
          >
            {CATEGORIES.map((category, index) => (
              <li key={category.value}>
                <button
                  type="button"
                  className={
                    index === 0
                      ? "rounded-full bg-stone-800 px-4 py-2 text-sm font-medium text-white"
                      : "rounded-full px-4 py-2 text-sm font-medium text-stone-500"
                  }
                >
                  {category.label}
                </button>
              </li>
            ))}
          </ul>

          {/* ช่องค้นหาฝั่งขวา — max-w-xs จำกัดความกว้างไม่ให้ยาวเกินไป */}
          <div className="relative w-full max-w-xs shrink-0">
            <Input
              type="search"
              placeholder="Search"
              readOnly
              aria-label="Search articles"
              className="h-11 rounded-xl border-stone-200 bg-white pr-11 text-sm text-stone-950 placeholder:text-stone-400"
            />
            <Search
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-stone-400"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* กริดแสดงการ์ดบทความ — 1 คอลัมน์บนมือถือ, 2 คอลัมน์บนเดสก์ท็อป */}
        <ul className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-12">
          {ARTICLES.map((article) => (
            <li key={article.id}>
              {/* {...article} = ส่ง props ทุกฟิลด์ของ article เข้า ArticleCard (เช่น title, image, category) */}
              <ArticleCard {...article} />
            </li>
          ))}
        </ul>

        {/* ลิงก์ "View more" — ยังไม่เชื่อมหน้าจริง (href="#") */}
        <div className="mt-12 flex justify-center md:mt-16">
          <a
            href="#"
            className="text-base font-medium text-stone-800 underline underline-offset-4 transition-colors hover:text-stone-600"
          >
            View more
          </a>
        </div>
      </div>
    </section>
  );
}

// export default = ให้ไฟล์อื่น import ArticleSection ไปใช้ได้
export default ArticleSection;
