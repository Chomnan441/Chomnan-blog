import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import ViewPostPage from "@/pages/ViewPostPage";
import NotFoundPage from "@/pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/post/:postId" element={<ViewPostPage />} />
      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
