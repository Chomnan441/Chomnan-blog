import axios from "axios";
import {
  api,
  API_BASE_URL,
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/lib/api";
import { ADMIN_ROLE, DEFAULT_AVATAR, USER_ROLE } from "@/lib/auth";

function getErrorMessage(error, fallback) {
  return (
    error.response?.data?.error ||
    error.response?.data?.message ||
    error.message ||
    fallback
  );
}

/** แปลงข้อมูลจาก /auth/get-user หรือ /auth/profile ให้เป็นรูปที่ UI ใช้ */
export function mapApiUser(profile, fallbackEmail = "") {
  return {
    id: profile.id,
    name: profile.name || "",
    username: profile.username || "",
    email: profile.email || fallbackEmail,
    avatar: profile.profilePic || profile.profile_pic || DEFAULT_AVATAR,
    role: profile.role === ADMIN_ROLE ? ADMIN_ROLE : USER_ROLE,
    bio: typeof profile.bio === "string" ? profile.bio : "",
  };
}

/** Login → ได้ token → ดึงโปรไฟล์ */
export async function loginWithApi(email, password) {
  const loginRes = await api.post("/auth/login", {
    email,
    password,
  });

  const accessToken = loginRes.data?.access_token;
  if (!accessToken) {
    throw new Error("Missing access token");
  }

  setAccessToken(accessToken);

  const userRes = await api.get("/auth/get-user");
  return mapApiUser(userRes.data, email.trim().toLowerCase());
}

/** สมัครสมาชิกผ่าน API (ยังไม่ login ให้เอง) */
export async function registerWithApi({ name, username, email, password }) {
  const response = await api.post("/auth/register", {
    name: name.trim(),
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password,
  });

  return {
    message: response.data?.message,
    user: response.data?.user,
  };
}

/** ดึงโปรไฟล์จาก token ที่มีอยู่ (ใช้ตอนรีเฟรชหน้า) */
export async function fetchCurrentUser() {
  const token = getAccessToken();
  if (!token) {
    throw new Error("No access token");
  }

  const userRes = await api.get("/auth/get-user");
  return mapApiUser(userRes.data);
}

/** โปรไฟล์สาธารณะของแอดมิน (หน้า Hero — ไม่ต้อง login) */
export async function fetchSiteAuthor() {
  const response = await api.get("/auth/site-author");
  return {
    name: response.data?.name || "",
    bio: typeof response.data?.bio === "string" ? response.data.bio : "",
    profilePic:
      typeof response.data?.profilePic === "string"
        ? response.data.profilePic
        : "",
  };
}

/** ขอลิงก์รีเซ็ตรหัสทางอีเมล (ลืมรหัส — ยังไม่ login) */
export async function forgotPasswordWithApi(email) {
  try {
    const response = await api.post("/auth/forgot-password", {
      email: email.trim().toLowerCase(),
    });
    return {
      success: true,
      message: response.data?.message || "Reset link sent",
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to send reset email"),
    };
  }
}

/**
 * ตั้งรหัสใหม่จากลิงก์ในอีเมล
 * ต้องส่งทั้ง access + refresh token เพื่อ setSession ก่อน updateUser
 */
export async function recoveryPasswordWithApi({
  accessToken,
  refreshToken,
  password,
}) {
  try {
    await axios.post(`${API_BASE_URL}/auth/recovery-password`, {
      accessToken,
      refreshToken,
      password,
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to update password"),
    };
  }
}

/** เปลี่ยนรหัสผ่าน (ต้องส่ง token + รหัสเก่า) */
export async function resetPasswordWithApi({
  currentPassword,
  newPassword,
}) {
  try {
    await api.put("/auth/reset-password", {
      oldPassword: currentPassword,
      newPassword,
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to reset password"),
    };
  }
}

/** อัปเดตชื่อ / username / รูปโปรไฟล์ / bio */
export async function updateProfileWithApi({ name, username, avatar, bio }) {
  try {
    const response = await api.put("/auth/profile", {
      name,
      username,
      profilePic: avatar,
      bio: typeof bio === "string" ? bio : "",
    });

    return {
      success: true,
      user: mapApiUser(response.data?.user || {}),
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to update profile"),
    };
  }
}

export function logoutApiSession() {
  clearAccessToken();
}

export { getErrorMessage };
