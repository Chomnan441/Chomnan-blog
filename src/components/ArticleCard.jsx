// ArticleCard = การ์ดแสดงบทความหนึ่งชิ้น (รูป, หมวดหมู่, หัวข้อ, คำอธิบาย, ผู้เขียน, วันที่)
// ถูกเรียกใช้จาก ArticleSection โดยส่งข้อมูลผ่าน props เช่น <ArticleCard {...article} />
import { Link } from "react-router-dom";

function ArticleCard({
  // props = ข้อมูลที่ parent ส่งเข้ามา — ใช้ destructuring ดึงฟิลด์ออกมาใช้โดยตรง
  id,
  category, // หมวดหมู่บทความ เช่น "Cat", "Inspiration"
  title, // หัวข้อบทความ
  excerpt, // คำอธิบายสั้น ๆ ของบทความ
  author, // ชื่อผู้เขียน
  authorAvatar, // URL รูปโปรไฟล์ผู้เขียน
  date, // วันที่เผยแพร่ (แสดงเป็นข้อความ)
  dateTime, // วันที่รูปแบบ ISO สำหรับแอตทริบิวต์ dateTime
  image, // URL รูปปกบทความ
  imageAlt, // ข้อความอธิบายรูป (สำคัญสำหรับ accessibility และ SEO)
}) {
  // return (...) = สิ่งที่ component นี้จะแสดงบนหน้าจอ (เรียกว่า JSX)
  return (
    // <article> = แท็ก HTML สำหรับเนื้อหาบทความอิสระ (semantic HTML)
    <article className="flex flex-col gap-4">
      {/* ลิงก์รูปปก — href="#" ยังเป็น placeholder ยังไม่เชื่อมหน้าบทความจริง */}
      <Link to={`/post/${id}`} className="block overflow-hidden rounded-2xl">
        {/* {image} = แสดงค่าจาก props ใน JSX ต้องอยู่ในเครื่องหมาย {} */}
        <img
          src={image}
          alt={imageAlt}
          className="aspect-3/2 w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
        />
      </Link>

      {/* ป้ายหมวดหมู่ */}
      <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
        {category}
      </span>

      {/* หัวข้อบทความ — ใช้ <h3> เพราะอยู่ใต้หัวข้อหลักของ section */}
      <h3 className="text-xl font-bold leading-snug text-stone-950">
        <Link
          to={`/post/${id}`}
          className="transition-colors hover:text-stone-700"
        >
          {title}
        </Link>
      </h3>

      {/* line-clamp-3 = จำกัดข้อความไม่เกิน 3 บรรทัด แล้วตัดด้วย ... */}
      <p className="line-clamp-3 text-sm leading-relaxed text-stone-600 md:text-base">
        {excerpt}
      </p>

      {/* <footer> = ส่วนท้ายของ article — แสดงผู้เขียนและวันที่ */}
      <footer className="mt-auto flex items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <img
            src={authorAvatar}
            alt={`${author} profile`}
            className="size-10 rounded-full object-cover"
          />
          <span className="text-sm font-semibold text-stone-950">{author}</span>
        </div>
        {/* <time> = แท็ก HTML สำหรับวันที่ — dateTime ควรเป็นรูปแบบ ISO (เช่น 2024-09-11) */}
        <time dateTime={dateTime} className="text-sm text-stone-500">
          {date}
        </time>
      </footer>
    </article>
  );
}

// export default = ส่ง component นี้ออกไปให้ไฟล์อื่น import ได้
export default ArticleCard;
