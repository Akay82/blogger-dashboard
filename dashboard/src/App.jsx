import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import PostList from "./pages/PostList";
import PostPreview from "./pages/PostPreview ";
import { useAuth } from "./context/AuthContext";
import LoginModal from "./components/modals/LoginModal";


export default function App() {
    const { isAuthenticated } = useAuth();
  return (
 <>
      {!isAuthenticated && <LoginModal />}

      {isAuthenticated && (
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/posts/:id" element={<PostPreview />} />
          </Routes>
        </Layout>
      )}
    </>
  );
}