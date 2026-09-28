// ArticleSearch.jsx = ช่องค้นหาบทความแบบ autocomplete
// ผู้ใช้พิมพ์คำค้น → เรียก API → แสดง dropdown รายชื่อบทความ → คลิกแล้วไปหน้าอ่านบทความ
// ถูกเรียกใช้จาก ArticleSection ทั้งบน mobile และ desktop

// useEffect = Hook สำหรับทำ side effect (เช่น เรียก API, ฟัง event) หลัง component render
// useRef = Hook สำหรับอ้างอิง DOM element โดยตรง (ไม่ทำให้ re-render เมื่อค่าเปลี่ยน)
// useState = Hook สำหรับเก็บ state (ข้อมูลที่เปลี่ยนได้) ใน component
import { useEffect, useRef, useState } from "react";
// useNavigate = Hook จาก react-router-dom สำหรับเปลี่ยนหน้าโดยไม่ reload ทั้งเว็บ
import { useNavigate } from "react-router-dom";
// Search = ไอคอนแว่นขยายจาก lucide-react แสดงด้านขวาของช่องค้นหา
import { Search } from "lucide-react";
// Input = ช่องกรอกข้อความจาก shadcn/ui
import { Input } from "@/components/ui/input";
import { fetchPublicPosts } from "@/lib/postsApi";
// cn = helper รวม className ของ Tailwind (ใช้กับรายการที่ highlight)
import { cn } from "@/lib/utils";

// ArticleSearch = component ช่องค้นหา
// className = class ของ container ภายนอก (parent ส่งมาเพื่อปรับขนาด/ความกว้าง)
// inputClassName = class ของช่อง input (parent ส่งมาเพื่อปรับความสูง/ขนาดตัวอักษร)
function ArticleSearch({ className, inputClassName }) {
  // navigate = function สำหรับเปลี่ยน route เช่น navigate('/post/3') → ไปหน้าอ่านบทความ id 3
  const navigate = useNavigate();
  // containerRef = อ้างอิง div ที่ครอบทั้ง input และ dropdown — ใช้ตรวจว่าคลิกนอกกล่องหรือไม่
  const containerRef = useRef(null);

  // --- State (ข้อมูลที่เปลี่ยนได้และทำให้ UI re-render) ---

  // query = ข้อความที่ผู้ใช้พิมพ์ในช่องค้นหา
  const [query, setQuery] = useState("");
  // results = รายการบทความที่ API ส่งกลับมาตามคำค้น
  const [results, setResults] = useState([]);
  // isOpen = true เมื่อ dropdown เปิดอยู่, false เมื่อปิด
  const [isOpen, setIsOpen] = useState(false);
  // activeIndex = index ของรายการที่ highlight อยู่ (-1 = ยังไม่ได้เลือก)
  // ใช้กับ keyboard navigation (ลูกศร ↑↓) และ hover เมาส์
  const [activeIndex, setActiveIndex] = useState(-1);

  // trimmedQuery = query หลังตัดช่องว่างหัว-ท้าย — ใช้ตรวจว่ามีคำค้นจริงหรือไม่
  const trimmedQuery = query.trim();

  // useEffect นี้ทำงานเมื่อ trimmedQuery เปลี่ยน (ผู้ใช้พิมพ์หรือลบข้อความ)
  // [trimmedQuery] = dependency array — ระบุว่า effect นี้ขึ้นกับค่า trimmedQuery
  useEffect(() => {
    // ถ้าไม่มีคำค้น → ไม่ต้องเรียก API
    if (!trimmedQuery) {
      return;
    }

    // AbortController = ใช้ยกเลิก request เก่าเมื่อผู้ใช้พิมพ์ต่อก่อน request เสร็จ
    // ป้องกัน race condition (ผลลัพธ์เก่ามาทับผลลัพธ์ใหม่)
    const controller = new AbortController();

    // debounce 300ms = รอ 300 มิลลิวินาทีหลังหยุดพิมพ์แล้วค่อยเรียก API
    // ถ้าไม่ debounce จะยิง request ทุกตัวอักษร → ช้าและเปลืองทรัพยากร
    const timer = window.setTimeout(async () => {
      try {
        // เรียก GET /posts?keyword=...&limit=6
        // keyword = คำค้น (API ค้นจาก title, description, content ให้)
        // limit = จำกัดผลลัพธ์สูงสุด 6 รายการ
        const data = await fetchPublicPosts({
          page: 1,
          keyword: trimmedQuery,
          limit: 6,
          signal: controller.signal,
        });
        setResults(data.posts);
        setIsOpen(true); // เปิด dropdown แสดงผลลัพธ์
        setActiveIndex(-1); // รีเซ็ต highlight (รีเซตที่เอาเม้า hover อยู่)
      } catch {
        // ถ้า request ถูกยกเลิก (abort) — ไม่ต้องอัปเดต state
        if (!controller.signal.aborted) {
          setResults([]);
          setIsOpen(false);
        }
      }
    }, 300);

    // cleanup function = ทำงานก่อน effect รอบถัดไป หรือก่อน component ถูกลบ
    // ยกเลิก timer และ request ที่ยังค้างอยู่
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [trimmedQuery]);

  // useEffect นี้ทำงานครั้งเดียวตอน mount — ฟัง event คลิกนอก dropdown
  // [] = dependency array ว่าง → ไม่ re-run เมื่อ state เปลี่ยน
  useEffect(() => {
    function handleClickOutside(event) {
      // ถ้าคลิกอยู่นอก container (input + dropdown) → ปิด dropdown
      if (
        // containerRef.current = มี DOM element ให้ใช้หรือยัง (ไม่เกี่ยวกับ dropdown เปิด/ปิด)
        // !containerRef.current.contains(event.target) = คลิกนอกกล่องค้นหา → ปิด dropdown
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    // cleanup = ลบ event listener เมื่อ component ถูกลบ (ป้องกัน memory leak)
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // handleQueryChange = เรียกเมื่อผู้ใช้พิมพ์หรือลบข้อความในช่องค้นหา
  function handleQueryChange(event) {
    const value = event.target.value;
    setQuery(value);
    setActiveIndex(-1);

    // ลบข้อความจนหมด → ล้างผลลัพธ์และปิด dropdown ทันที
    if (!value.trim()) {
      setResults([]);
      setIsOpen(false);
    }
  }

  // handleSelect = เรียกเมื่อผู้ใช้เลือกบทความจาก dropdown (คลิกหรือกด Enter)
  function handleSelect(postId) {
    setQuery(""); // ล้างช่องค้นหา
    setResults([]);
    setIsOpen(false);
    // เปลี่ยน route ไปหน้าอ่านบทความ — React Router จะ render ViewPostPage
    navigate(`/post/${postId}`);
  }

  // handleKeyDown = รองรับการใช้งานด้วยคีย์บอร์ด
  function handleKeyDown(event) {
    // ถ้า dropdown ปิดหรือไม่มีผลลัพธ์ → ไม่ต้องทำอะไร
    if (!isOpen || results.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault(); // ป้องกัน cursor เลื่อนในช่อง input
      // % results.length = วนกลับไปรายการแรกเมื่อถึงรายการสุดท้าย (% คือ modulo — เอาเศษหลังหาร ถ้าเศษ 0 กลับไปหาตัวแรก)
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      // ถ้าอยู่รายการแรกแล้วกด ↑ → ไปรายการสุดท้าย
      setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      handleSelect(results[activeIndex].id);
    } else if (event.key === "Escape") {
      setIsOpen(false); // กด Escape → ปิด dropdown
    }
  }

  // id สำหรับเชื่อม input กับ dropdown (accessibility)
  const listboxId = "article-search-results";

  return (
    // ref={containerRef} = ผูก ref กับ div นี้ เพื่อใช้ตรวจ click outside
    // relative = ทำให้ dropdown (absolute) จัดตำแหน่งเทียบกับ container นี้
    <div ref={containerRef} className={cn("relative", className)}>
      <Input
        type="search"
        value={query} // controlled input — ค่าใน input มาจาก state query
        onChange={handleQueryChange}
        onFocus={() => {
          // กด focus กลับมาที่ช่องค้นหา → เปิด dropdown ถ้ามีคำค้นและผลลัพธ์อยู่แล้ว
          if (trimmedQuery && results.length > 0) {
            setIsOpen(true);
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search"
        aria-label="Search articles" // บอก screen reader ว่าช่องค้นหาเป็นช่องค้นหาบทความ
        aria-expanded={isOpen} // บอก screen reader ว่า dropdown เปิดหรือปิด
        aria-controls={isOpen ? listboxId : undefined} // เชื่อม input กับ dropdown (บอก ID ของกล่อง dropdown)
        aria-autocomplete="list" // บอก screen reader ว่าช่องค้นหาแบบ autocomplete (ช่องที่มีให้พิมพ์ด้วย และมีลูกศรให้กดเลือกรายการที่หล่นลงมาได้ด้วย)
        role="combobox" // บทบาท accessibility สำหรับช่องค้นหาแบบ autocomplete
        className={cn(
          "rounded-xl border-stone-200 bg-white pr-11 text-stone-950 placeholder:text-stone-400",
          inputClassName,
        )}
      />
      {/* ไอคอนแว่นขยาย — pointer-events-none = คลิกทะลุไปที่ input ด้านล่างได้ */}
      <Search
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-stone-400 md:right-4 md:size-5"
        aria-hidden="true"
      />

      {/* แสดง dropdown เมื่อเปิดอยู่และมีคำค้น */}
      {isOpen && trimmedQuery && (
        <ul
          id={listboxId}
          role="listbox" // บทบาท accessibility สำหรับรายการตัวเลือก
          aria-label="Search results"
          className="absolute top-full z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-stone-200 bg-white py-2 shadow-md"
        >
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-stone-500">
              No articles found
            </li>
          ) : (
            // .map() วนลูปสร้างรายการจาก results
            results.map((post, index) => (
              <li
                key={post.id}
                role="option"
                aria-selected={activeIndex === index}
              >
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)} // hover → highlight รายการนั้น
                  onClick={() => handleSelect(post.id)}
                  className={cn(
                    "w-full px-4 py-3 text-left text-sm text-stone-950 transition-colors",
                    // รายการที่ activeIndex ตรง → พื้นหลังสีเทาอ่อน (ตาม mockup)
                    activeIndex === index
                      ? "bg-stone-100"
                      : "hover:bg-stone-100",
                  )}
                >
                  {post.title}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default ArticleSearch;
