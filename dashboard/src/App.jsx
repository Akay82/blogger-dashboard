import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import PostList from "./pages/PostList";
import PostPreview from "./pages/PostPreview ";


export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/:id" element={<PostPreview />} />
      </Routes>
    </Layout>
  );
}