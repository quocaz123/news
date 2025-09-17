import { useState, useEffect, useMemo, useCallback } from "react";
import Header from "../components/Header";
import { CategoryFilter } from "../components/CategoryFilter";
import { NewsCard } from "../components/NewsCard";
import Footer from "../components/Footer";
import Pagination from "../components/writer/Pagination";
import { getPublishedPosts } from "../services/postService";
import { searchByTitle, searchByCategory } from "../services/searchService";
import { usePostFeed } from "../hooks/usePostFeed";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 🔹 Fetch data từ API
  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        let response;

        if (debouncedQuery) {
          // Search theo title
          response = await searchByTitle(
            debouncedQuery,
            currentPage,
            itemsPerPage
          );
        } else if (activeCategory !== "all") {
          // Search theo category
          response = await searchByCategory(
            activeCategory,
            currentPage,
            itemsPerPage
          );
        } else {
          // 👉 Trường hợp TẤT CẢ
          response = await getPublishedPosts(currentPage, itemsPerPage);
        }

        const result = response.data.result;
        setPosts(result.data || []);
        setTotalPages(result.totalPages || 1);
      } catch (error) {
        console.error("Error fetching data:", error);
        setPosts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedQuery, activeCategory, currentPage]);

  // 🔹 Refetch API (dùng cho server-mode realtime)
  const refetchPage = useCallback(() => {
    setLoading(true);
    getPublishedPosts(currentPage, itemsPerPage)
      .then((response) => {
        const result = response.data.result;
        setPosts(result.data || []);
        setTotalPages(result.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [currentPage, itemsPerPage]);

  // 🔹 WebSocket feed (client-mode: cập nhật state trực tiếp)
  usePostFeed({
    mode: "client", // đổi sang "server" nếu muốn fetch lại từ API
    onRefetch: refetchPage,
    setPosts,
  });

  const visibleNews = useMemo(() => posts, [posts]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Category Filter */}
      <CategoryFilter
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading */}
        {loading && <p className="text-gray-500">Đang tải...</p>}

        {/* Grid posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {visibleNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>

        {/* Empty state */}
        {visibleNews.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Không tìm thấy bài viết nào</p>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
