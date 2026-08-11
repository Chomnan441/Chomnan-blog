import { api } from "@/lib/api";

function getErrorMessage(error, fallback) {
  return (
    error.response?.data?.error ||
    error.response?.data?.message ||
    error.message ||
    fallback
  );
}

function mapCategory(row) {
  return {
    id: row.id,
    name: row.name || "",
  };
}

/** ดึงหมวดทั้งหมดจาก API */
export async function fetchAdminCategories() {
  try {
    const { data } = await api.get("/categories");
    const rows = Array.isArray(data?.categories) ? data.categories : [];
    return {
      success: true,
      categories: rows.map(mapCategory),
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to load categories"),
      categories: [],
    };
  }
}

/** ชื่อหมวดอย่างเดียว (dropdown / filter) */
export async function fetchCategoryNames() {
  const result = await fetchAdminCategories();
  if (!result.success) {
    return result;
  }

  return {
    success: true,
    names: result.categories.map((category) => category.name),
  };
}

/** ดึงหมวดทีละชิ้น */
export async function fetchAdminCategoryById(categoryId) {
  try {
    const { data } = await api.get(`/categories/${categoryId}`);
    return {
      success: true,
      category: mapCategory(data),
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Category not found"),
      category: null,
    };
  }
}

/** สร้างหมวดใหม่ */
export async function createAdminCategory({ name }) {
  const trimmedName = typeof name === "string" ? name.trim() : "";
  if (!trimmedName) {
    return { success: false, error: "Category name is required" };
  }

  try {
    const { data } = await api.post("/categories", { name: trimmedName });
    return {
      success: true,
      category: mapCategory(data?.category || {}),
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to create category"),
    };
  }
}

/** แก้ชื่อหมวด */
export async function updateAdminCategory(categoryId, { name }) {
  const trimmedName = typeof name === "string" ? name.trim() : "";
  if (!trimmedName) {
    return { success: false, error: "Category name is required" };
  }

  try {
    const { data } = await api.put(`/categories/${categoryId}`, {
      name: trimmedName,
    });
    return {
      success: true,
      category: mapCategory(data?.category || {}),
      previousName: data?.previousName,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to update category"),
    };
  }
}

/** ลบหมวด */
export async function deleteAdminCategory(categoryId) {
  try {
    await api.delete(`/categories/${categoryId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to delete category"),
    };
  }
}

/** กรองรายการฝั่ง client ตามคำค้น */
export function filterAdminCategories(categories, keyword = "") {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (!normalizedKeyword) {
    return categories;
  }

  return categories.filter((category) =>
    category.name.toLowerCase().includes(normalizedKeyword),
  );
}
