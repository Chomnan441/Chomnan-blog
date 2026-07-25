import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import ViewPostPage from "@/pages/ViewPostPage";
import NotFoundPage from "@/pages/NotFoundPage";
import SignUpPage from "@/pages/SignUpPage";
import LoginPage from "@/pages/LoginPage";
import RegistrationSuccessPage from "@/pages/RegistrationSuccessPage";
import ProfilePage from "@/pages/ProfilePage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import AdminArticlesPage from "@/pages/admin/AdminArticlesPage";
import AdminArticleFormPage from "@/pages/admin/AdminArticleFormPage";
import AdminCategoriesPage from "@/pages/admin/AdminCategoriesPage";
import AdminCategoryFormPage from "@/pages/admin/AdminCategoryFormPage";
import AdminProfilePage from "@/pages/admin/AdminProfilePage";
import AdminNotificationsPage from "@/pages/admin/AdminNotificationsPage";
import AdminResetPasswordPage from "@/pages/admin/AdminResetPasswordPage";
import AdminLayout from "@/components/AdminLayout";
import RequireAuth from "@/components/RequireAuth";
import RequireAdmin from "@/components/RequireAdmin";

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
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<Navigate to="articles" replace />} />
        <Route path="articles" element={<AdminArticlesPage />} />
        <Route path="articles/create" element={<AdminArticleFormPage />} />
        <Route
          path="articles/:articleId/edit"
          element={<AdminArticleFormPage />}
        />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="categories/create" element={<AdminCategoryFormPage />} />
        <Route
          path="categories/:categoryId/edit"
          element={<AdminCategoryFormPage />}
        />
        <Route path="profile" element={<AdminProfilePage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="reset-password" element={<AdminResetPasswordPage />} />
      </Route>
      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
