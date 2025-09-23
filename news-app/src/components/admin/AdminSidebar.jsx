import { useState } from 'react';

export default function AdminSidebar({ activeTab, onTabChange }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        {
            id: 'stats',
            label: 'Thống kê',
            icon: '📊',
            description: 'Tổng quan hệ thống'
        },
        {
            id: 'users',
            label: 'Người dùng',
            icon: '👥',
            description: 'Quản lý tài khoản'
        },
        {
            id: 'posts',
            label: 'Bài viết',
            icon: '📝',
            description: 'Kiểm duyệt nội dung'
        },
        {
            id: 'categories',
            label: 'Danh mục',
            icon: '📂',
            description: 'Quản lý phân loại'
        }
    ];

    return (
        <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-50 ${isCollapsed ? 'w-16' : 'w-64'
            }`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    {!isCollapsed && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
                            <p className="text-sm text-gray-500">Quản trị hệ thống</p>
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-lg">
                            {isCollapsed ? '→' : '←'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => onTabChange(item.id)}
                                className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${activeTab === item.id
                                        ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <span className="text-xl mr-3">{item.icon}</span>
                                {!isCollapsed && (
                                    <div className="text-left">
                                        <div className="font-medium">{item.label}</div>
                                        <div className="text-xs text-gray-500">{item.description}</div>
                                    </div>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer */}
            {!isCollapsed && (
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">A</span>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-900">Admin User</div>
                            <div className="text-xs text-gray-500">Quản trị viên</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

