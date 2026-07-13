// ArticleSection.jsx = ส่วนแสดงบทความล่าสุด พร้อมตัวกรองหมวดหมู่และช่องค้นหา
// ดึงข้อมูลจาก API แทนการ import จากไฟล์ local

// useEffect = Hook สำหรับทำ side effect (เช่น เรียก API) หลัง component render
// useState = Hook สำหรับเก็บ state (ข้อมูลที่เปลี่ยนได้) ใน component
import { useEffect, useState } from "react";
// axios = library สำหรับส่ง HTTP request ไปยัง server (ดึงข้อมูลบทความจาก API)
import axios from "axios";
// Search = ไอคอนแว่นขยายจาก lucide-react ใช้ในช่องค้นหา
import ArticleSearch from "@/components/ArticleSearch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// ArticleCard = การ์ดแสดงบทความแต่ละชิ้น (รูป, หัวข้อ, คำอธิบาย ฯลฯ)
import ArticleCard from "@/components/ArticleCard";
// ArticleCardSkeleton = placeholder ขณะโหลด — รักษาความสูงกริดไม่ให้ scroll กระโดด
import ArticleCardSkeleton from "@/components/ArticleCardSkeleton";
// formatBlogDate = function แปลงวันที่ ISO เป็นข้อความอ่านง่าย เช่น "11 September 2024"
import { formatBlogDate } from "@/lib/formatDate";
// cn = helper รวม className ของ Tailwind (ใช้กับปุ่มหมวดหมู่ที่เปลี่ยนสีตามสถานะ)
import { cn } from "@/lib/utils";

import { API_BASE_URL } from "@/lib/api";

// จำนวนบทความที่โหลดต่อ 1 ครั้ง — ใช้กับ query params page และ limit ของ API
const ARTICLES_PER_PAGE = 6;

// class กริดร่วมกัน — ใช้ทั้ง skeleton และการ์ดจริงให้ layout เท่ากัน
const ARTICLE_GRID_CLASS =
  "mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-12";

// รูปโปรไฟล์ผู้เขียนเริ่มต้น — API ไม่ส่ง authorAvatar มา จึงใช้ URL นี้แทน
const DEFAULT_AUTHOR_AVATAR =
  "https://res.cloudinary.com/dcbpjtd1r/image/upload/c_fill,w_80,h_80,g_face,r_max/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg";

// รายการหมวดหมู่บทความ
// value = ค่าภายในใน state (ใช้เปรียบเทียบ/เก็บใน useState)
// label = ข้อความที่แสดงบนหน้าจอ และส่งให้ API เป็นพารามิเตอร์ category
const CATEGORIES = [
  { value: "highlight", label: "Highlight" },
  { value: "cat", label: "Cat" },
  { value: "inspiration", label: "Inspiration" },
  { value: "general", label: "General" },
];

// mapPostToArticle = แปลงข้อมูลจาก API ให้ตรงกับ props ที่ ArticleCard ต้องการ
// API ใช้ชื่อฟิลด์ต่างจาก component เช่น description แทน excerpt
function mapPostToArticle(post) {
  return {
    id: post.id,
    category: post.category,
    title: post.title,
    excerpt: post.description, // API ส่งมาเป็น description — map เป็น excerpt ให้ ArticleCard
    author: post.author,
    authorAvatar: DEFAULT_AUTHOR_AVATAR, // API ไม่มีรูปผู้เขียน — ใช้ค่า default
    date: formatBlogDate(post.date), // แปลงวันที่ ISO เป็นข้อความอ่านง่าย
    dateTime: post.date, // เก็บวันที่ ISO ต้นฉบับไว้สำหรับแอตทริบิวต์ dateTime ใน <time>
    image: post.image,
    imageAlt: post.title, // API ไม่มี imageAlt — ใช้หัวข้อบทความเป็นคำอธิบายรูป
  };
}

// getCategoryParam = แปลงค่าหมวดหมู่ใน state เป็นพารามิเตอร์ส่งให้ API
// Highlight = แสดงทุกหมวด → ไม่ส่ง category (return undefined)
// หมวดอื่น → ส่ง label เช่น "Cat", "Inspiration"
function getCategoryParam(categoryValue) {
  if (categoryValue === "highlight") {
    return undefined;
  }

  // .find() ค้นหารายการใน CATEGORIES ที่ value ตรงกัน
  // ?.label = optional chaining — ถ้าไม่เจอจะได้ undefined แทน error
  return CATEGORIES.find((item) => item.value === categoryValue)?.label;
}

// ArticleSection = component หลักของส่วนนี้
function ArticleSection() {
  // --- State (ข้อมูลที่เปลี่ยนได้และทำให้ UI re-render) ---

  // category = หมวดหมู่ที่เลือกอยู่ — ค่าเริ่มต้น "highlight" (แสดงทุกบทความ)
  const [category, setCategory] = useState("highlight");
  // articles = รายการบทความที่ดึงมาจาก API แล้ว map เรียบร้อย
  const [articles, setArticles] = useState([]);
  // page = หน้าปัจจุบันของ pagination — เริ่มที่ 1 แล้วเพิ่มทีละ 1 เมื่อกด View more
  const [page, setPage] = useState(1);
  // hasMore = true เมื่อยังมีบทความหน้าถัดไปให้โหลด — false แล้วจะซ่อนปุ่ม View more
  const [hasMore, setHasMore] = useState(false);
  // isLoading = true ขณะโหลดครั้งแรก หรือเปลี่ยนหมวดหมู่ (แทนที่รายการเดิม)
  const [isLoading, setIsLoading] = useState(true);
  // isLoadingMore = true ขณะกด View more แล้วรอโหลดบทความเพิ่ม (ต่อท้ายรายการเดิม)
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // error = ข้อความ error เมื่อเรียก API ไม่สำเร็จ (null = ไม่มี error)
  const [error, setError] = useState(null);

  // useEffect ทำงานเมื่อ component mount ครั้งแรก และเมื่อ category เปลี่ยน
  // [category] = dependency array — ระบุว่า effect นี้ขึ้นกับค่า category
  useEffect(() => {
    // AbortController = ยกเลิก request เก่าเมื่อผู้ใช้เปลี่ยนหมวดเร็ว ๆ (ป้องกัน race condition)
    // AbortController ไม่ได้ import จากแพ็กเกจ — เป็น Web API ของเบราว์เซอร์ (มีใน Node ใหม่ๆ ด้วย) ใช้ได้เลยเหมือน fetch, localStorage
    const controller = new AbortController();

    // async function = function ที่ใช้ await ได้ (รอผลจาก API)
    async function fetchPosts() {
      setIsLoading(true);
      setError(null);
      // เปลี่ยนหมวดหมู่ → เริ่ม pagination ใหม่จากหน้า 1
      setPage(1);

      try {
        const categoryParam = getCategoryParam(category);
        // params ส่ง page, limit ให้ API และ category (ถ้าไม่ใช่ Highlight)
        const params = {
          page: 1,
          limit: ARTICLES_PER_PAGE,
          ...(categoryParam ? { category: categoryParam } : {}),
          // ... (spread) = เอา key จาก object ข้างในมาใส่ใน params
          //  ถ้ามีค่า → ใส่ { category: "Cat" } ถ้าไม่มี → ใส่ {} (ว่าง ไม่เพิ่ม key)

          //          เลือก Highlight → getCategoryParam("highlight") คืน undefined:
          // ตัวอย่างการใช้งาน
          // const params = {
          //   page: 1,
          //   limit: 6,
          //   // ไม่มี category
          // };
          // // → ?page=1&limit=6

          //           เลือก Cat → getCategoryParam("cat") คืน "Cat":

          // const params = {
          //   page: 1,
          //   limit: 6,
          //   category: "Cat",
          // };
          // // → ?page=1&limit=6&category=Cat
        };

        // axios.get = ส่ง GET request ไปยัง API
        // params = query string เช่น ?page=1&limit=6&category=Cat
        // signal = เชื่อมกับ AbortController เพื่อยกเลิก request ได้
        const { data } = await axios.get(`${API_BASE_URL}/posts`, {
          params,
          signal: controller.signal,
        });

        // data.posts = array บทความจาก API → map แปลงทีละชิ้นแล้วเก็บใน state
        setArticles(data.posts.map(mapPostToArticle));
        // currentPage < totalPages = ยังมีหน้าถัดไป → แสดงปุ่ม View more ได้
        setHasMore(data.currentPage < data.totalPages);
      } catch {
        // ถ้า request ถูกยกเลิก (ผู้ใช้เปลี่ยนหมวดก่อนโหลดเสร็จ) — ไม่ต้องแสดง error
        if (controller.signal.aborted) {
          return;
        }

        setError("Unable to load articles. Please try again later.");
        setArticles([]);
        setHasMore(false);
      } finally {
        // finally ทำงานเสมอหลัง try/catch — ปิดสถานะ loading ถ้า request ยังไม่ถูกยกเลิก
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchPosts();

    // cleanup function = ทำงานก่อน effect รอบถัดไป หรือก่อน component ถูกลบ
    // ยกเลิก request ที่ยังค้างอยู่
    return () => controller.abort();
  }, [category]);

  // handleViewMore = โหลดบทความหน้าถัดไปแล้วต่อท้ายรายการเดิม (ไม่ลบของเก่า)
  async function handleViewMore() {
    // ถ้ากำลังโหลดอยู่แล้ว หรือไม่มีหน้าถัดไป — ไม่ทำอะไร
    if (isLoadingMore || !hasMore) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const nextPage = page + 1;
      const categoryParam = getCategoryParam(category);
      const params = {
        page: nextPage,
        limit: ARTICLES_PER_PAGE,
        ...(categoryParam ? { category: categoryParam } : {}),
      };

      const { data } = await axios.get(`${API_BASE_URL}/posts`, { params });
      const newArticles = data.posts.map(mapPostToArticle);

      // [...prev, ...newArticles] = เอาของเก่า + ของใหม่รวมกันใน state
      setArticles((prev) => [...prev, ...newArticles]);
      setPage(data.currentPage);
      // ถ้าอยู่หน้าสุดท้ายแล้ว → hasMore เป็น false → ปุ่ม View more จะหายไป
      setHasMore(data.currentPage < data.totalPages);
    } catch {
      setError("Unable to load more articles. Please try again later.");
    } finally {
      setIsLoadingMore(false);
    }
  }

  // return (...) = JSX ที่จะแสดงบนหน้าจอ
  return (
    // <section> = แท็ก HTML semantic สำหรับส่วนเนื้อหาหลัก
    <section className="bg-blog-page px-4 pb-12 md:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white px-5 py-8 md:px-8 md:py-10">
        <h2 className="text-2xl font-bold text-stone-950 md:text-3xl">
          Latest articles
        </h2>

        {/* --- เลย์เอาต์มือถือ (md:hidden = แสดงเฉพาะหน้าจอเล็กกว่า 768px) --- */}
        <div className="mt-6 flex flex-col gap-6 md:hidden">
          <ArticleSearch
            className="w-full"
            inputClassName="h-12 w-full text-base"
          />

          {/* Dropdown เลือกหมวดหมู่ — ใช้บนมือถือแทนปุ่มหมวดหมู่แนวนอน */}
          <div className="flex w-full flex-col gap-1">
            <Label //Label  ส่วนนี้เกี่ยวกับ accessibility ข้อความ "Category" — screen reader
              htmlFor="article-category"
              className="text-sm font-medium text-stone-500"
            >
              Category
            </Label>
            {/* value = หมวดที่เลือกอยู่ | onValueChange = เรียก setCategory เมื่อผู้ใช้เปลี่ยนหมวด */}
            <Select value={category} onValueChange={setCategory}>
              {/* select trigger กดแล้วแสดง dropdown เลือกหมวดหมู่ของ SelectContent */}
              <SelectTrigger
                id="article-category"
                className="h-12 w-full min-w-0 rounded-xl border-stone-200 bg-white px-4 text-base text-stone-950 data-[size=default]:h-12 [&_svg]:size-5 [&_svg]:text-stone-400"
              >
                <SelectValue placeholder="Highlight" />
              </SelectTrigger>

              {/* select content แสดง dropdown */}
              <SelectContent
                position="popper"
                side="bottom"
                sideOffset={4}
                align="start"
                className="w-(--radix-select-trigger-width) rounded-xl border-stone-200 bg-white shadow-md"
              >
                {/* .map() วนลูปสร้างตัวเลือกจาก CATEGORIES */}
                {CATEGORIES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* --- เลย์เอาต์เดสก์ท็อป (hidden md:flex = ซ่อนบนมือถือ, แสดงเมื่อ ≥768px) --- */}
        <div className="mt-6 hidden items-center justify-between gap-6 rounded-2xl bg-stone-100 p-3 md:flex">
          <ul
            className="flex flex-wrap items-center gap-2"
            aria-label="Article categories"
          >
            {CATEGORIES.map((item) => {
              // isActive = หมวดนี้ถูกเลือกอยู่หรือไม่
              const isActive = category === item.value;

              return (
                <li key={item.value}>
                  <button
                    type="button"
                    disabled={isActive}
                    // onClick = เมื่อกดปุ่ม → เปลี่ยน category → useEffect จะ fetch ข้อมูลใหม่
                    onClick={() => setCategory(item.value)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-stone-800 text-white"
                        : "text-stone-500 hover:bg-white",
                    )}
                  >
                    {item.label} {/* แสดงข้อความหมวดหมู่ */}
                  </button>
                </li>
              );
            })}
          </ul>

          <ArticleSearch
            className="w-full max-w-xs shrink-0"
            inputClassName="h-11 text-sm"
          />
        </div>

        {/* --- แสดงผลตามสถานะ: กำลังโหลด / error / รายการบทความ --- */}
        {/* skeleton แทนข้อความ Loading... — รักษาความสูงกริดไม่ให้ scroll กระโดด */}
        {isLoading && (
          <ul
            className={ARTICLE_GRID_CLASS}
            aria-busy="true"
            aria-label="Loading articles"
          >
            {Array.from({ length: ARTICLES_PER_PAGE }, (_, index) => (
              <li key={index}>
                <ArticleCardSkeleton />
              </li>
            ))}
          </ul>
        )}

        {/* แสดง error เมื่อโหลดไม่สำเร็จและไม่ได้อยู่ในสถานะ loading */}
        {error && !isLoading && (
          <p className="mt-10 text-center text-red-600" role="alert">
            {error}
          </p>
        )}

        {/* แสดงกริดบทความเมื่อโหลดเสร็จและไม่มี error */}
        {!isLoading && !error && (
          <ul className={ARTICLE_GRID_CLASS}>
            {articles.map((article) => (
              <li key={article.id}>
                {/* {...article} = spread props ส่งทุกฟิลด์ของ article เข้า ArticleCard */}
                <ArticleCard {...article} />
              </li>
            ))}
          </ul>
        )}

        {/* แสดง Loading... ขณะกด View more แล้วรอข้อมูลจาก Server */}
        {isLoadingMore && (
          <p className="mt-12 text-center text-stone-500 md:mt-16">
            Loading...
          </p>
        )}

        {/* แสดงปุ่ม View more เฉพาะเมื่อโหลดเสร็จ ไม่มี error และยังมีหน้าถัดไป (hasMore) */}
        {!isLoading && !error && hasMore && !isLoadingMore && (
          <div className="mt-12 flex justify-center md:mt-16">
            <button
              type="button"
              onClick={handleViewMore}
              className="text-base font-medium text-stone-800 underline underline-offset-4 transition-colors hover:text-stone-600"
            >
              View more
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// export default = ให้ไฟล์อื่น (เช่น App.jsx) import ArticleSection ไปใช้ได้
export default ArticleSection;
