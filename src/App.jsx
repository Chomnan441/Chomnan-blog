import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import ViewPostPage from "@/pages/ViewPostPage";
import NotFoundPage from "@/pages/NotFoundPage";
import SignUpPage from "@/pages/SignUpPage";
import LoginPage from "@/pages/LoginPage";
import RegistrationSuccessPage from "@/pages/RegistrationSuccessPage";
import ProfilePage from "@/pages/ProfilePage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import AdminPage from "@/pages/AdminPage";
import RequireAuth from "@/components/RequireAuth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/sign-up/success" element={<RegistrationSuccessPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/post/:postId" element={<ViewPostPage />} />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        }
      />
      <Route
        path="/reset-password"
        element={
          <RequireAuth>
            <ResetPasswordPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminPage />
          </RequireAuth>
        }
      />
      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
