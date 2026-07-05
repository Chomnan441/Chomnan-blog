// formatDate.js = ไฟล์ยูทิลิตี้สำหรับแปลงวันที่ให้อ่านง่าย
// แยก logic การจัดรูปแบบวันที่ออกจาก component เพื่อให้นำกลับมาใช้ซ้ำได้ในหลายที่

// export = ส่ง function นี้ออกไปให้ไฟล์อื่น import ได้
// function formatBlogDate = ชื่อ function ที่บอกหน้าที่ชัดเจน: แปลงวันที่สำหรับแสดงในบล็อก
// (isoDate) = parameter รับค่าวันที่เข้ามา — ชื่อ isoDate บอกว่าเราคาดหวังรูปแบบ ISO 8601
export function formatBlogDate(isoDate) {
  // new Date(isoDate) = สร้าง Object วันที่ของ JavaScript จาก string
  // ตัวอย่าง input จาก API: "2024-09-11T00:00:00.000Z"
  //   - 2024-09-11 = ปี-เดือน-วัน
  //   - T = ตัวคั่นระหว่างวันที่กับเวลา
  //   - 00:00:00.000 = เวลา (ชั่วโมง:นาที:วินาที.มิลลิวินาที)
  //   - Z = โซนเวลา UTC (เวลามาตรฐานโลก)
  //
  // .toLocaleDateString() = แปลง Object วันที่กลับเป็น string ที่อ่านง่ายตาม locale ที่กำหนด
  return new Date(isoDate).toLocaleDateString(
    // "en-GB" = รูปแบบภาษาอังกฤษแบบสหราชอาณาจักร
    // ทำให้ได้รูปแบบ "11 September 2024" (วัน เดือนเต็ม ปี)
    "en-GB",
    {
      // day: "numeric" = แสดงวันเป็นตัวเลข เช่น 11 (ไม่ใช่ "11th")
      day: "numeric",
      // month: "long" = แสดงชื่อเดือนเต็ม เช่น September (ไม่ใช่ Sep หรือ 09)
      month: "long",
      // year: "numeric" = แสดงปี 4 หลัก เช่น 2024
      year: "numeric",
    },
  );
  // ผลลัพธ์ที่ได้: "11 September 2024"
  // ใช้ใน ArticleSection ผ่าน mapPostToArticle() ก่อนส่งไปแสดงใน ArticleCard
}

export function formatCommentDate(isoDate) {
  return new Date(isoDate)
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(", ", " at ");
}
