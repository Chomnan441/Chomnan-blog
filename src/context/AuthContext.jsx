import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  authenticateUser,
  clearSession,
  getStoredSession,
  isAdmin as checkIsAdmin,
  registerUser,
  resetUserPassword,
  saveSession,
  updateUserProfile,
  validateSignUpFields,
} from "@/lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredSession());

  const login = useCallback((email, password) => {
    const authenticatedUser = authenticateUser(email, password);
    // useCallback ไม่ได้เปลี่ยนพฤติกรรมการ login — แค่ทำให้ reference ของ login นิ่ง เพื่อลด re-render ที่ไม่จำเป็นใน Context
    if (!authenticatedUser) {
      return false;
    }

    setUser(authenticatedUser);
    saveSession(authenticatedUser);
    return true;
  }, []);

  const signUp = useCallback((formData) => {
    const errors = validateSignUpFields(formData);
    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    const newUser = registerUser(formData);
    return { success: true, user: newUser };
  }, []);

  // ฟังก์ชันนี้ = ยืนยันสมัครเสร็จแล้ว (กด Continue → เรียก completeRegistration → ค่อยล็อกอิน แล้วไปหน้าแรก)
  const completeRegistration = useCallback((registeredUser) => {
    setUser(registeredUser);
    saveSession(registeredUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearSession();
  }, []);

  const updateProfile = useCallback(
    (profileData) => {
      if (!user) {
        return { success: false, error: "Not authenticated" };
      }

      const result = updateUserProfile(user.id, profileData);
      if (result.success) {
        setUser(result.user);
      }
      return result;
    },
    [user],
  );

  const resetPassword = useCallback(
    (passwordData) => {
      if (!user) {
        return { success: false, error: "Not authenticated" };
      }

      return resetUserPassword(user.id, passwordData);
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
