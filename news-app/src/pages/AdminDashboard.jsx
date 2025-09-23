import { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import UserManagement from '../components/admin/UserManagement';
import PostManagement from '../components/admin/PostManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import AdminStats from '../components/admin/AdminStats';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('stats');

    const renderContent = () => {
        switch (activeTab) {
            case 'stats':
                return <AdminStats />;
            case 'users':
                return <UserManagement />;
            case 'posts':
                return <PostManagement />;
            case 'categories':
                return <CategoryManagement />;
            default:
                return <AdminStats />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex">
                {/* Sidebar */}
                <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Main Content */}
                <div className="flex-1 ml-64">
                    <div className="p-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {activeTab === 'stats' && 'Thống kê tổng quan'}
                                {activeTab === 'users' && 'Quản lý người dùng'}
                                {activeTab === 'posts' && 'Quản lý bài viết'}
                                {activeTab === 'categories' && 'Quản lý danh mục'}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {activeTab === 'stats' && 'Tổng quan về hệ thống và hoạt động'}
                                {activeTab === 'users' && 'Quản lý tài khoản người dùng và phân quyền'}
                                {activeTab === 'posts' && 'Kiểm duyệt và quản lý bài viết'}
                                {activeTab === 'categories' && 'Quản lý danh mục bài viết'}
                            </p>
                        </div>

                        {/* Content */}
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}
