import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";

/** ดึงการตั้งค่าเว็บ (สาธารณะ — รูป Hero) */
export async function fetchSiteSettings() {
  const response = await api.get("/site-settings");
  return {
    heroImage: response.data?.heroImage || null,
    heroImageHover: response.data?.heroImageHover || null,
  };
}

/**
 * อัปเดตรูป Hero (แอดมิน)
 * ส่ง File ที่เปลี่ยนเท่านั้น — ใบที่ไม่อัปโหลดคงของเดิม
 * clearHeroImage / clearHeroImageHover = true เพื่อกลับไปใช้ default
 */
export async function updateSiteSettings({
  heroImageFile,
  heroImageHoverFile,
  clearHeroImage = false,
  clearHeroImageHover = false,
} = {}) {
  try {
    const formData = new FormData();

    if (heroImageFile instanceof File) {
      formData.append("heroImageFile", heroImageFile);
    }
    if (heroImageHoverFile instanceof File) {
      formData.append("heroImageHoverFile", heroImageHoverFile);
    }
    if (clearHeroImage) {
      formData.append("clearHeroImage", "true");
    }
    if (clearHeroImageHover) {
      formData.append("clearHeroImageHover", "true");
    }

    const response = await api.put("/site-settings", formData);

    return {
      success: true,
      heroImage: response.data?.heroImage || null,
      heroImageHover: response.data?.heroImageHover || null,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to update site settings"),
    };
  }
}
