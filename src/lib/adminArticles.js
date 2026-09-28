import { ARTICLE_STATUS } from "@/data/categories";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";

export const ADMIN_ARTICLES_PAGE_SIZE = 15;

/**
 * แปลงสถานะจาก DB → ค่าที่ UI ใช้
 * DB อาจเก็บ "publish" ส่วน UI ใช้ "published"
 */
function mapStatusFromApi(status) {
  const normalized = String(status || "")
    .trim()
    .toLowerCase();

  if (normalized === "publish" || normalized === "published") {
    return ARTICLE_STATUS.PUBLISHED;
  }

  return ARTICLE_STATUS.DRAFT;
}

/**
 * แปลงแถวจาก API ให้เป็นรูปที่หน้า admin คุ้นเคย
 * (title, category ชื่อ, status draft/published, ...)
 */
export function mapApiPostToArticle(post) {
  return {
    id: post.id,
    title: post.title || "",
    category: post.category || "",
    categoryId: post.category_id || null,
    status: mapStatusFromApi(post.status),
    statusId: post.status_id ?? null,
    image: post.image || "",
    author: post.author || "",
    description: post.description || "",
    content: post.content || "",
    createdAt: post.date || null,
    updatedAt: post.date || null,
    likesCount: post.likes_count ?? 0,
  };
}

/** ดึง categories + statuses จาก DB (uuid / id จริง) */
export async function fetchPostLookups() {
  const { data } = await api.get("/posts/lookups");
  return {
    categories: Array.isArray(data?.categories) ? data.categories : [],
    statuses: Array.isArray(data?.statuses) ? data.statuses : [],
  };
}

function findCategoryIdByName(categories, categoryNameOrId) {
  const raw = String(categoryNameOrId || "").trim();
  if (!raw) return null;

  // ถ้าส่งมาเป็น id อยู่แล้ว ใช้เลย
  const byId = categories.find((item) => String(item.id) === raw);
  if (byId) return String(byId.id);

  const match = categories.find(
    (item) => item.name?.toLowerCase() === raw.toLowerCase(),
  );
  return match?.id != null ? String(match.id) : null;
}

function findStatusId(statuses, articleStatus) {
  const wantPublished = articleStatus === ARTICLE_STATUS.PUBLISHED;

  const match = statuses.find((item) => {
    const name = String(item.status || "").toLowerCase();
    if (wantPublished) {
      return name === "publish" || name === "published";
    }
    return name === "draft";
  });

  return match?.id ?? null;
}

/** ดึงรายการบทความจาก API (สำหรับหน้า admin — pagination + filter ฝั่ง server) */
export async function fetchAdminArticles({
  page = 1,
  limit = ADMIN_ARTICLES_PAGE_SIZE,
  keyword = "",
  category = "all",
  status = "all",
} = {}) {
  try {
    const params = { page, limit };
    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword) {
      params.keyword = trimmedKeyword;
    }

    if (category && category !== "all") {
      params.category = category;
    }

    if (status && status !== "all") {
      params.status = status;
    }

    const { data } = await api.get("/posts", { params });

    const posts = Array.isArray(data?.posts) ? data.posts : [];
    return {
      success: true,
      articles: posts.map(mapApiPostToArticle),
      currentPage: data.currentPage ?? page,
      totalPages: data.totalPages ?? 0,
      totalPosts: data.totalPosts ?? posts.length,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to load articles"),
      articles: [],
      currentPage: page,
      totalPages: 0,
      totalPosts: 0,
    };
  }
}

/** ดึงบทความทีละชิ้นด้วย id (uuid) */
export async function fetchAdminArticleById(articleId) {
  try {
    const { data } = await api.get(`/posts/${articleId}`);
    return {
      success: true,
      article: mapApiPostToArticle(data),
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Article not found"),
      article: null,
    };
  }
}

/** สร้างโพสต์ผ่าน Backend + อัปโหลดรูปไป Supabase Storage */
export async function createAdminArticleWithUpload({
  title,
  category,
  description,
  content,
  status,
  imageFile,
}) {
  if (!imageFile) {
    return { success: false, error: "Image file is required" };
  }

  try {
    const lookups = await fetchPostLookups();
    const categoryId = findCategoryIdByName(lookups.categories, category);
    const statusId = findStatusId(lookups.statuses, status);

    if (!categoryId) {
      return { success: false, error: "Invalid category" };
    }

    if (!statusId) {
      return { success: false, error: "Invalid status" };
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("category_id", String(categoryId));
    formData.append("description", description.trim());
    formData.append("content", content.trim());
    formData.append("status_id", String(statusId));
    formData.append("imageFile", imageFile);

    const response = await api.post("/posts", formData);
    return {
      success: true,
      message: response.data?.message,
      image: response.data?.image,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to create post"),
    };
  }
}

/**
 * อัปเดตโพสต์ผ่าน API
 * - ถ้ามี imageFile ใหม่ → ส่ง multipart
 * - ถ้าไม่มี → ส่ง JSON พร้อม URL รูปเดิม
 */
export async function updateAdminArticle(articleId, articleData) {
  try {
    const lookups = await fetchPostLookups();
    const categoryId = findCategoryIdByName(
      lookups.categories,
      articleData.category,
    );
    const statusId = findStatusId(lookups.statuses, articleData.status);

    if (!categoryId) {
      return { success: false, error: "Invalid category" };
    }

    if (!statusId) {
      return { success: false, error: "Invalid status" };
    }

    if (articleData.imageFile) {
      const formData = new FormData();
      formData.append("title", articleData.title.trim());
      formData.append("category_id", String(categoryId));
      formData.append("description", articleData.description.trim());
      formData.append("content", articleData.content.trim());
      formData.append("status_id", String(statusId));
      formData.append("image", articleData.image || "");
      formData.append("imageFile", articleData.imageFile);

      const response = await api.put(`/posts/${articleId}`, formData);
      return {
        success: true,
        message: response.data?.message,
        image: response.data?.image,
      };
    }

    const response = await api.put(`/posts/${articleId}`, {
      title: articleData.title.trim(),
      image: articleData.image || "",
      category_id: categoryId,
      description: articleData.description.trim(),
      content: articleData.content.trim(),
      status_id: statusId,
    });

    return {
      success: true,
      message: response.data?.message,
      image: response.data?.image,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to update post"),
    };
  }
}

/** ลบบทความผ่าน API */
export async function deleteAdminArticle(articleId) {
  try {
    await api.delete(`/posts/${articleId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to delete post"),
    };
  }
}
