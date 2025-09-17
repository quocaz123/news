import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect, useState, useRef } from 'react';
import { getPublishedPostById, likePost, dislikePost } from '../services/postService';

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [dislikeAnim, setDislikeAnim] = useState(false);
  const didFetch = useRef(false); // flag chống gọi 2 lần

  // Fetch bài viết
 useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    setLoading(true);
    getPublishedPostById(id)
      .then((response) => {
        setNews(response.data.result);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Hàm format ngày an toàn
  const formatDate = (date) => {
    if (!date) return "Không xác định";
    const d = new Date(date);
    if (isNaN(d)) return "Không xác định";
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(d);
  };

  // Like bài viết
  const handleLike = async () => {
    
    if (loading) return;
    setLoading(true);

    setNews(prev => ({ ...prev, likes: prev.likes + (liked ? -1 : 1) }));
    setLiked(prev => !prev);
    setLikeAnim(true);

    if (disliked && !liked) {
      setNews(prev => ({ ...prev, dislikes: prev.dislikes - 1 }));
      setDisliked(false);
    }

    try {
      await likePost(id);
      setMessage("You liked this post.");
    } catch (error) {
      setNews(prev => ({ ...prev, likes: prev.likes + (liked ? 1 : -1) }));
      setLiked(prev => !prev);
      setMessage("Failed to like the post.");
    } finally {
      setLoading(false);
      setTimeout(() => setLikeAnim(false), 600); // reset animation
    }
  };

  // Dislike bài viết
  const handleDislike = async () => {
    if (loading) return;
    setLoading(true);

    setNews(prev => ({ ...prev, dislikes: prev.dislikes + (disliked ? -1 : 1) }));
    setDisliked(prev => !prev);
    setDislikeAnim(true);

    if (liked && !disliked) {
      setNews(prev => ({ ...prev, likes: prev.likes - 1 }));
      setLiked(false);
    }

    try {
      await dislikePost(id);
      setMessage("You disliked this post.");
    } catch (error) {
      setNews(prev => ({ ...prev, dislikes: prev.dislikes + (disliked ? 1 : -1) }));
      setDisliked(prev => !prev);
      setMessage("Failed to dislike the post.");
    } finally {
      setLoading(false);
      setTimeout(() => setDislikeAnim(false), 600); // reset animation
    }
  };

  if (loading && !news) {
    return (
      <div>
        <Header />
        <div className="max-w-2xl mx-auto py-20 text-center text-gray-500">
          Đang tải dữ liệu...
        </div>
        <Footer />
      </div>
    );
  }

  if (!news) {
    return (
      <div>
        <Header />
        <div className="max-w-2xl mx-auto py-20 text-center text-gray-500">
          Không tìm thấy bài viết
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8 mt-8 mb-8">
        <button
          className="text-blue-600 mb-4 hover:underline"
          onClick={() => navigate(-1)}
        >
          &lt; Quay lại danh sách
        </button>

        {news.thumbnailUrl && (
          <img
            src={news.thumbnailUrl}
            alt={news.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}

        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
          {news.categoryName}
        </span>

        <div className="mt-4 mb-2 flex items-center space-x-2 text-gray-500 text-sm">
          <span>Tác giả:</span>
          <span>{news.username}</span>
          <span>•</span>
          <span>{formatDate(news.createdDate)}</span>
          <span>•</span>
          <span>{news.created} trước</span>
          
        </div>

        <h1 className="text-2xl font-bold mb-4">{news.title}</h1>

        <div className="flex items-center space-x-6 mb-6">
          <span className="flex items-center gap-1 text-gray-600">
            <svg width="18" height="18" fill="currentColor"><circle cx="9" cy="9" r="8" /></svg> {news.views} views
          </span>
          <span className="flex items-center gap-1 text-green-600 relative">
            👍 {news.likeCount}
            {likeAnim && <span className="absolute -top-4 text-green-700 animate-bounce">+1</span>}
          </span>
          <span className="flex items-center gap-1 text-red-600 relative">
            👎 {news.dislikeCount}
            {dislikeAnim && <span className="absolute -top-4 text-red-700 animate-bounce">+1</span>}
          </span>
        </div>

        <div className="mb-6 text-gray-700 space-y-4">
          {news.content.split("\\n").map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {news.tags && news.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {news.tags.map((tag, idx) => (
              <span key={idx} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="font-semibold mb-2">Did you find this article helpful?</div>
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded transition ${
                liked ? "bg-green-500 text-white" : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
              onClick={handleLike}
              disabled={loading}
            >
              👍 Yes
            </button>

            <button
              className={`px-4 py-2 rounded transition ${
                disliked ? "bg-red-500 text-white" : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
              onClick={handleDislike}
              disabled={loading}
            >
              👎 No
            </button>
          </div>
          {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
        </div>

        <div className="mt-4">
          <div className="font-semibold mb-2">Share this article</div>
          <div className="flex gap-3">
            <a href="#" className="text-blue-500 hover:underline">Facebook</a>
            <a href="#" className="text-blue-400 hover:underline">Twitter</a>
            <a href="#" className="text-green-500 hover:underline">WhatsApp</a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
