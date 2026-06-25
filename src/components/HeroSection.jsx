// ส่วนบนสุดของหน้าแรก (Hero) — แสดงหัวข้อใหญ่ รูปภาพ และข้อมูลผู้เขียน

// เก็บ URL รูปภาพไว้ในตัวแปร constant (ค่าคงที่ ไม่เปลี่ยนระหว่างรันแอป)
// แยกออกมาไว้ด้านบนเพื่อให้อ่านโค้ดง่าย และแก้ลิงก์รูปได้ที่เดียว
const HERO_IMAGE_URL =
  "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg";

// object เก็บข้อมูลผู้เขียน — ใช้ key เช่น label, name, bio แล้วเรียก AUTHOR.name ใน JSX
const AUTHOR = {
  label: "Author",
  name: "Thompson P.",
  bio: "I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness. When I'm not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes.",
};

// React Component — ฟังก์ชันที่ return JSX (โครงสร้างหน้าจอที่ React แสดงผล)
function HeroSection() {
  return (
    // <section> = แท็ก HTML สำหรับส่วนเนื้อหาหลักของหน้า (semantic HTML)
    // className = ใส่ class ของ Tailwind CSS สำหรับจัดสไตล์ (เทียบเท่า class ใน HTML ธรรมดา)
    <section className="bg-blog-page">
      {/* grid 3 คอลัมน์บนจอใหญ่: ข้อความซ้าย | รูปกลาง | ข้อมูลผู้เขียนขวา */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:px-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-12 lg:px-16 lg:py-16">
        {/* คอลัมน์ที่ 1: หัวข้อหลักและคำอธิบายสั้น ๆ */}
        <div className="flex flex-col gap-6 lg:max-w-md">
          {/* h1 = หัวข้อระดับสูงสุดของหน้า (มีได้แค่หนึ่ง h1 ต่อหน้า) */}
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-stone-950 md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            Stay Informed,
            {/* <br /> = ขึ้นบรรทัดใหม่ */}
            <br />
            Stay Inspired
          </h1>

          <p className="text-base leading-relaxed text-stone-600 md:text-lg">
            Discover a World of Knowledge at Your Fingertips. Your Daily Dose of
            Inspiration and Information.
          </p>
        </div>

        {/* คอลัมน์ที่ 2: รูปภาพ — <figure> เหมาะกับรูปหรือสื่อประกอบ */}
        <figure className="mx-auto w-full max-w-xs lg:max-w-sm">
          {/* alt บังคับสำหรับ accessibility — อธิบายรูปให้ screen reader และเมื่อโหลดรูปไม่ได้ */}
          <img
            src={HERO_IMAGE_URL}
            alt="A man with a cat on his shoulder standing in a snowy forest with autumn leaves"
            className="aspect-3/4 w-full rounded-2xl object-cover"
          />
        </figure>

        {/* คอลัมน์ที่ 3: ข้อมูลผู้เขียน — <aside> ใช้กับเนื้อหาเสริมที่เกี่ยวข้อง */}
        <aside className="flex flex-col gap-3 lg:max-w-sm lg:justify-self-end">
          {/* {AUTHOR.label} = แทรกค่าจาก JavaScript เข้าใน JSX (วงเล็บปีกกา) */}
          <p className="text-sm font-medium text-stone-500">- {AUTHOR.label}</p>
          <h2 className="text-2xl font-bold text-stone-950">{AUTHOR.name}</h2>
          <p className="text-sm leading-relaxed text-stone-600 md:text-base">
            {AUTHOR.bio}
          </p>
        </aside>
      </div>
    </section>
  );
}

// export default ทำให้ไฟล์อื่น (เช่น App.jsx) import HeroSection มาใช้ได้
export default HeroSection;
