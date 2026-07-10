// ส่วนบนสุดของหน้าแรก (Hero) — แสดงหัวข้อใหญ่ รูปภาพ และข้อมูลผู้เขียน

// เก็บ URL รูปภาพไว้ในตัวแปร constant (ค่าคงที่ ไม่เปลี่ยนระหว่างรันแอป)
// แยกออกมาไว้ด้านบนเพื่อให้อ่านโค้ดง่าย และแก้ลิงก์รูปได้ที่เดียว
const HERO_IMAGE_URL = "https://i.ibb.co/Z1wqS9vj/Profile.jpg";
const HERO_IMAGE_HOVER_URL = "https://i.ibb.co/W48T8Vpw/Profile-Hover.png";

// object เก็บข้อมูลผู้เขียน — ใช้ key เช่น label, name, bio แล้วเรียก AUTHOR.name ใน JSX
const AUTHOR = {
  label: "Author",
  name: "Chomnan P.",
  bio: "I’m an everyday person who always questions why astrologers make the predictions they do during a reading. It makes me wonder: the astrologer is human, bringing their own experiential lens to the table, and they deliver the reading from that viewpoint. What if we applied our own lens instead? If we changed our role from the one receiving the prophecy to the one reading our own destiny, what would that look like? Would the narrative stay the same, or how would it change? (Disclaimer: I mean no disrespect to the predictions or perspectives of others; I simply always hold space for different points of view)",
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
            Decoding
            {/* <br /> = ขึ้นบรรทัดใหม่ */}
            <br />
            the Cosmic Blueprint
          </h1>

          <p className="text-base leading-relaxed text-stone-600 md:text-lg">
            Move beyond daily newspaper horoscopes and explore the profound
            concepts of Western Astrology. Discover the planetary positions at
            your birth, and let them reveal the gifts you were given to create
            something new in this lifetime. Seek knowledge to move forward, not
            to fear
          </p>
        </div>

        {/* คอลัมน์ที่ 2: รูปภาพ — <figure> เหมาะกับรูปหรือสื่อประกอบ */}
        <figure className="group mx-auto w-full max-w-xs shrink-0 lg:w-80 lg:max-w-sm">
          <span className="relative block aspect-3/4 w-full overflow-hidden rounded-2xl shadow-xl shadow-stone-900/20">
            <img
              src={HERO_IMAGE_URL}
              alt="Chomnan P. standing on a coastal rock overlooking a calm turquoise sea under an overcast sky"
              className="absolute inset-0 h-full w-full object-cover opacity-100 transition-opacity duration-300 ease-in-out group-hover:opacity-0"
            />
            <img
              src={HERO_IMAGE_HOVER_URL}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
            />
          </span>
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
