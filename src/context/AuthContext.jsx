import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  clearSession,
  getStoredSession,
  isAdmin as checkIsAdmin,
  saveSession,
  validateSignUpFields,
} from "@/lib/auth";
import { getAccessToken } from "@/lib/api";
import {
  fetchCurrentUser,
  getErrorMessage,
  loginWithApi,
  logoutApiSession,
  registerWithApi,
  resetPasswordWithApi,
  updateProfileWithApi,
} from "@/lib/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // เปิดหน้า → ใช้แคชก่อน (เร็ว) แล้วค่อยยืนยันกับ server
  const [user, setUser] = useState(() => getStoredSession());

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const token = getAccessToken();

      // ไม่มี token = ยังไม่ล็อกอินจริง → เคลียร์แคชเก่า
      if (!token) {
        if (!cancelled) {
          setUser(null);
          clearSession();
        }
        return;
      }

      try {
        const profile = await fetchCurrentUser();
        if (cancelled) return;

        setUser(profile);
        saveSession(profile);
      } catch {
        if (cancelled) return;
        logoutApiSession();
        clearSession();
        setUser(null);
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const authenticatedUser = await loginWithApi(email, password);
      setUser(authenticatedUser);
      saveSession(authenticatedUser);
      return true;
    } catch {
      logoutApiSession();
      return false;
    }
  }, []);

  /**
   * สมัคร → ถ้าสำเร็จจะ login ให้เลย เพื่อให้มี token ใช้งานต่อได้
   * คืน { success, user } หรือ { success: false, errors / error }
   */
  const signUp = useCallback(async (formData) => {
    const errors = validateSignUpFields(formData);
    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    try {
      await registerWithApi(formData);

      // สมัครเสร็จแล้ว login ทันที เพื่อได้ access_token
      const authenticatedUser = await loginWithApi(
        formData.email,
        formData.password,
      );

      setUser(authenticatedUser);
      saveSession(authenticatedUser);

      return { success: true, user: authenticatedUser };
    } catch (error) {
      const data = error.response?.data;
      // ถ้ามี message ละเอียดกว่า error ทั่วไป ให้ใช้ message
      const message =
        (data?.error === "Failed to create user" && data?.message
          ? data.message
          : null) ||
        data?.error ||
        data?.message ||
        error.message ||
        "Failed to create account";
      const lower = message.toLowerCase();

      // แปลง error จาก server → ช่องฟอร์มที่เกี่ยวข้อง
      if (lower.includes("username")) {
        return { success: false, errors: { username: message } };
      }
      if (lower.includes("email") || lower.includes("already")) {
        return { success: false, errors: { email: message } };
      }
      if (lower.includes("password")) {
        return { success: false, errors: { password: message } };
      }

      return {
        success: false,
        errors: { form: message },
        error: message,
      };
    }
  }, []);

  // หน้า success กด Continue — user login ไปแล้วตอน signUp
  const completeRegistration = useCallback((registeredUser) => {
    if (!registeredUser) return;
    setUser(registeredUser);
    saveSession(registeredUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearSession();
    logoutApiSession();
  }, []);

  const updateProfile = useCallback(
    async (profileData) => {
      if (!user) {
        return { success: false, error: "Not authenticated" };
      }

      const result = await updateProfileWithApi({
        name: profileData.name,
        username: profileData.username,
        bio: profileData.bio,
        avatarFile: profileData.avatarFile,
      });

      if (!result.success) {
        return result;
      }

      setUser(result.user);
      saveSession(result.user);
      return { success: true, user: result.user };
    },
    [user],
  );

  const resetPassword = useCallback(
    async (passwordData) => {
      if (!user) {
        return { success: false, error: "Not authenticated" };
      }

      if (!passwordData.newPassword) {
        return { success: false, error: "New password is required" };
      }

      if (passwordData.newPassword.length < 6) {
        return {
          success: false,
          error: "New password must be at least 6 characters",
        };
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        return { success: false, error: "Passwords do not match" };
      }

      return resetPasswordWithApi({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
    },
    [user],
  );

  const isAdmin = checkIsAdmin(user);

  const value = useMemo(
    () => ({
      user,
      isAdmin,
      login,
      signUp,
      completeRegistration,
      logout,
      updateProfile,
      resetPassword,
    }),
    [
      user,
      isAdmin,
      login,
      signUp,
      completeRegistration,
      logout,
      updateProfile,
      resetPassword,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
