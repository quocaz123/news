import { useState, useEffect, useRef } from 'react';
import EditNewsModal from './EditNewsModal';
import { deletePost } from '../../services/postService';

export default function NewsItem({ news, onUpdate }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center bg-gray-50 rounded-lg p-6 shadow">
      <div className="flex-1">
        {/* Status + Category */}
        <div className="flex gap-2 mb-2">
          {news.status === "PUBLISHED" && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
              Đã xuất bản
            </span>
          )}
          {news.status === "DRAFT" && (
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
              Bản nháp
            </span>
          )}
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
            {news.categoryName}
          </span>
        </div>

        <div className="font-bold text-lg">{news.title}</div>
        <div className="text-gray-600 mb-2">{news.description}</div>

        <div className="text-xs text-gray-400 mb-1">
          Tạo lúc: {news.createdDate ? new Date(news.createdDate).toLocaleString('vi-VN') : 'Không rõ'}
        </div>
        <div className="text-xs text-gray-400 mb-2">
          Cập nhật: {news.publishedAt ? new Date(news.publishedAt).toLocaleString('vi-VN') : 'Chưa xuất bản'}
        </div>

        <div className="flex gap-6 text-sm text-gray-500">
          <span>👁️ {news.views}</span>
          <span>❤️ {news.likes}</span>
          <span>👎 {news.dislikes}</span>
        </div>
      </div>

      {news.image && (
        <img
          src={news.image}
          alt={news.title}
          className="w-20 h-20 object-cover rounded-lg ml-6"
          onError={e => { e.target.src = "https://via.placeholder.com/80x80?text=No+Image"; }}
        />
      )}

      <div className="ml-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-1 px-2 py-1 border rounded text-sm hover:bg-gray-100"
          >
            <span>✏️</span> Chỉnh sửa
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center px-2 py-1 border rounded text-sm hover:bg-gray-100"
            >
              <span>⋯</span>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10 py-1">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                  onClick={() => {
                    // TODO: chuyển về nháp
                    setIsMenuOpen(false);
                  }}
                >
                  Chuyển về nháp
                </button>
                <button
                  onClick={async () => {
                    setIsMenuOpen(false);
                    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
                      try {
                        await deletePost(news.id);
                        if (onUpdate) await onUpdate();
                      } catch (err) {
                        console.error(err);
                        alert('Có lỗi xảy ra khi xóa bài viết');
                      }
                    }
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm"
                >
                  Xóa bài viết
                </button>
              </div>
            )}
          </div>
        </div>

        <EditNewsModal
          news={news}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSave={async updatedNews => {
            if (onUpdate) await onUpdate();
            setIsEditOpen(false);
          }}
        />
      </div>
    </div>
  );
}
