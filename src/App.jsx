import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import ViewPostPage from "@/pages/ViewPostPage";
import NotFoundPage from "@/pages/NotFoundPage";
import SignUpPage from "@/pages/SignUpPage";
import LoginPage from "@/pages/LoginPage";
import RegistrationSuccessPage from "@/pages/RegistrationSuccessPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/sign-up/success" element={<RegistrationSuccessPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/post/:postId" element={<ViewPostPage />} />
      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
