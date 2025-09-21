import { useState, useEffect } from 'react';
import DashboardStats from '../components/writer/StatCard';
import NewsItem from '../components/writer/NewsItem';
import Pagination from '../components/writer/Pagination';
import FilterBar from '../components/writer/FilterBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CreatePostModal from '../components/writer/CreatePostModal';
import { getCategories, getMyPosts, getDashboardStats } from '../services/postService';

export default function WriterDashboard() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    totalViews: 0,
    totalLikes: 0
  });

  const itemsPerPage = 10;

  // Load categories
  useEffect(() => {
    getCategories()
      .then(res => setCategories(res.data.result || []))
      .catch(() => setCategories([]));
  }, []);

  // Hàm reload posts
  const reloadPosts = async (page = currentPage) => {
    try {
      setIsLoading(true);
      const response = await getMyPosts(page, itemsPerPage);
      const result = response.data.result || {};
      const postsData = result.data || [];
      setPosts(postsData);
      setTotalPages(result.totalPages || 0);

      // Load dashboard stats từ API
      try {
        const statsResponse = await getDashboardStats();
        const statsData = statsResponse.data.result;
        setStats({
          totalPosts: statsData.totalPosts || 0,
          publishedPosts: statsData.publishedPosts || 0,
          totalViews: statsData.totalViews || 0,
          totalLikes: statsData.totalLikes || 0
        });
      } catch (statsError) {
        console.error('Error loading dashboard stats:', statsError);
        // Fallback: tính thống kê từ posts data
        const publishedPosts = postsData.filter(p => p.status === 'PUBLISHED').length;
        const totalViews = postsData.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
        const totalLikes = postsData.reduce((sum, p) => sum + (Number(p.likes) || 0), 0);
        setStats({
          totalPosts: result.totalElements || 0,
          publishedPosts,
          totalViews,
          totalLikes
        });
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([]);
      setTotalPages(0);
      setStats({ totalPosts: 0, publishedPosts: 0, totalViews: 0, totalLikes: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  // Load posts khi currentPage thay đổi
  useEffect(() => {
    reloadPosts();
  }, [currentPage]);

  // Lọc bài viết
  const filteredPosts = posts.filter(post =>
    (filter === 'all' || post.categoryId === filter) &&
    (post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen px-8 py-10">
        <DashboardStats
          totalPosts={stats.totalPosts}
          publishedPosts={stats.publishedPosts}
          totalViews={stats.totalViews}
          totalLikes={stats.totalLikes}
        />

        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Quản lý bài viết</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
              Tạo bài viết mới
            </button>
          </div>

          <FilterBar
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
            categories={categories}
          />

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="space-y-6">
              {filteredPosts.map(post => (
                <NewsItem
                  key={post.id}
                  news={post}
                  onUpdate={() => reloadPosts()}
                  categories={categories}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Không có bài viết nào
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      <Footer />

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        onSuccess={() => reloadPosts(1)}
      />
    </>
  );
}
