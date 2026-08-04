import axios from "axios";
import { API_BASE_URL, clearAccessToken, setAccessToken } from "@/lib/api";
import { ADMIN_ROLE, DEFAULT_AVATAR, USER_ROLE } from "@/lib/auth";

export async function loginWithApi(email, password) {
  const loginRes = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
  });

  const accessToken = loginRes.data?.access_token;
  if (!accessToken) {
    throw new Error("Missing access token");
  }

  setAccessToken(accessToken);

  const userRes = await axios.get(`${API_BASE_URL}/auth/get-user`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const profile = userRes.data;
  return {
    id: profile.id,
    name: profile.name || "",
    username: profile.username || "",
    email: profile.email || email.trim().toLowerCase(),
    avatar: profile.profilePic || profile.profile_pic || DEFAULT_AVATAR,
    role: profile.role === ADMIN_ROLE ? ADMIN_ROLE : USER_ROLE,
    bio: typeof profile.bio === "string" ? profile.bio : "",
  };
}

export function logoutApiSession() {
  clearAccessToken();
}
