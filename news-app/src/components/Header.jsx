import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { logout } from "../services/userService";
import { getToken, removeToken } from "../services/localStorageService";

const Header = ({ searchQuery, onSearchChange }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    if (savedUser) {
      setUsername(savedUser);
    }
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    const token = getToken();
    logout(token).catch((err) => {
      console.error("Logout failed:", err);
    });
    removeToken();
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <h1
            className="text-2xl font-bold text-blue-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            News
          </h1>

          {/* Ô tìm kiếm */}
          <div className="flex-1 max-w-lg mx-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm tin tức..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* User / Login */}
          <div className="flex items-center space-x-4">
            {username ? (
              <>
                <span className="font-medium text-gray-700">👋 {username}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <button
                onClick={handleLoginClick}
                className="text-gray-600 hover:text-blue-600"
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
