import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import "./index.css";
import App from "./App.jsx";

// อีเมลรีเซ็ตที่ redirect URL ไม่ตรง allow list จะเด้งมาที่ Site URL (/)
// พร้อมโทเคนใน hash — ส่งต่อไปฟอร์มตั้งรหัสก่อนที่หน้า Home จะวาด
function forwardRecoveryLink() {
  if (window.location.pathname === "/auth/recovery") {
    return false;
  }

  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  const search = window.location.search.startsWith("?")
    ? window.location.search.slice(1)
    : window.location.search;
  const params = [hash, search]
    .filter(Boolean)
    .map((part) => new URLSearchParams(part))
    .find((part) => {
      if (part.get("error_code") === "otp_expired" || part.get("error") === "access_denied") {
        return true;
      }
      if (part.get("type") !== "recovery") {
        return false;
      }
      if (part.get("token_hash")) {
        return true;
      }
      return Boolean(part.get("access_token") && part.get("refresh_token"));
    });

  if (!params) {
    return false;
  }

  window.location.replace(
    `/auth/recovery${window.location.search}${window.location.hash}`,
  );
  return true;
}

if (!forwardRecoveryLink()) {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster position="bottom-right" richColors closeButton />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>,
  );
}
