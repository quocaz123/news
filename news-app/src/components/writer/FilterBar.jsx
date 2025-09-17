import { useState, useRef, useEffect } from 'react';

export default function FilterBar({ search, setSearch, filter, setFilter, categories = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lấy tên category hiện tại
  const getCurrentCategoryName = () => {
    const category = categories.find(c => c.id === filter);
    return category ? category.name : categories[0]?.name || 'Không có danh mục';
  };

  return (
    <div className="flex gap-4 mb-6 items-center">
      <input
        type="text"
        placeholder="Tìm kiếm bài viết..."
        className="border px-4 py-2 rounded w-1/2"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="relative inline-block" ref={dropdownRef}>
        <button
          type="button"
          className="w-48 px-4 py-2 text-left bg-white border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:border-blue-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center justify-between">
            <span>{getCurrentCategoryName()}</span>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
              viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-48 mt-1 bg-white border border-gray-300 rounded shadow-lg">
            <ul className="py-1">
              {categories.map(category => (
                <li key={category.id}>
                  <button
                    type="button"
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${filter === category.id ? 'bg-blue-50 text-blue-600' : ''}`}
                    onClick={() => {
                      setFilter(category.id);
                      setIsOpen(false);
                    }}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}