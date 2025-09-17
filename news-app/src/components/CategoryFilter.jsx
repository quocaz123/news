import { useState, useEffect } from "react";
import { getCategories } from "../services/postService";
export const CategoryFilter = ({ activeCategory, onCategoryChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then((response) => {
        const categoriesData = response.data.result || [];
        setCategories(categoriesData);
      })
      .catch(() => setCategories([]));
  }, []);

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-1 overflow-x-auto py-4">
          {/* 👉 Nút Tất cả */}
          <button
            onClick={() => onCategoryChange("all")}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeCategory === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tất cả
          </button>

          {/* 👉 Các category khác */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.name)} // dùng name để search
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === category.name
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
