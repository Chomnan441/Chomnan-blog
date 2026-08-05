const SESSION_KEY = "chomnan_blog_session";

export const DEFAULT_AVATAR = "/default-avatar.svg";
export const USER_ROLE = "user";
export const ADMIN_ROLE = "admin";

function normalizeRole(role) {
  return role === ADMIN_ROLE ? ADMIN_ROLE : USER_ROLE;
}

export function isAdmin(user) {
  return normalizeRole(user?.role) === ADMIN_ROLE;
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * ตรวจฟอร์มสมัครฝั่ง client ก่อนยิง API
 * (ไม่เช็ก email ซ้ำใน localStorage แล้ว — ให้ server เป็นคนตัดสิน)
 */
export function validateSignUpFields({ name, username, email, password }) {
  const errors = {};

  if (!name.trim()) {
    errors.name = "Name is required";
  }

  if (!username.trim()) {
    errors.username = "Username is required";
  }

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email = "Email must be a valid email";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}

/** แคชโปรไฟล์ใน localStorage เพื่อเปิดหน้าแล้วเห็นชื่อเร็วๆ (ไม่เก็บรหัสผ่าน) */
export function getStoredSession() {
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) {
    return null;
  }

  try {
    const session = JSON.parse(stored);
    if (!session?.id) {
      return null;
    }

    return {
      ...session,
      role: normalizeRole(session.role),
      bio: typeof session.bio === "string" ? session.bio : "",
      avatar: session.avatar || DEFAULT_AVATAR,
    };
  } catch {
    return null;
  }
}

export function saveSession(user) {
  if (!user) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar || DEFAULT_AVATAR,
      role: normalizeRole(user.role),
      bio: typeof user.bio === "string" ? user.bio : "",
    }),
  );
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
