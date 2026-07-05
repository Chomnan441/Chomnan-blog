import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  authenticateUser,
  clearSession,
  getStoredSession,
  registerUser,
  saveSession,
  validateSignUpFields,
} from "@/lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredSession());

  const login = useCallback((email, password) => {
    const authenticatedUser = authenticateUser(email, password);
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

  const completeRegistration = useCallback((registeredUser) => {
    setUser(registeredUser);
    saveSession(registeredUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearSession();
  }, []);

  const value = useMemo(
    () => ({ user, login, signUp, completeRegistration, logout }),
    [user, login, signUp, completeRegistration, logout],
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
