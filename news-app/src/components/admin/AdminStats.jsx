import { useState, useEffect } from 'react';
import { getAdminStats, getUsers, getCategories, getAllPosts } from '../../services/adminService';

export default function AdminStats() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPosts: 0,
        publishedPosts: 0,
        pendingPosts: 0,
        totalViews: 0,
        totalLikes: 0,
        totalCategories: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoading(true);

                // Load all stats in parallel
                const [statsResponse, usersResponse, categoriesResponse, postsResponse] = await Promise.all([
                    getAdminStats(),
                    getUsers(),
                    getCategories(),
                    getAllPosts(1, 1000) // Get all posts for counting
                ]);

                const statsData = statsResponse.data.result || {};
                const usersData = usersResponse.data.result || [];
                const categoriesData = categoriesResponse.data.result || [];
                const postsData = postsResponse.data.result?.data || [];

                // Calculate additional stats
                const publishedPosts = postsData.filter(post => post.status === 'PUBLISHED').length;
                const pendingPosts = postsData.filter(post => post.status === 'PENDING').length;

                setStats({
                    totalUsers: usersData.length,
                    totalPosts: postsData.length,
                    publishedPosts: publishedPosts,
                    pendingPosts: pendingPosts,
                    totalViews: statsData.totalViews || 0,
                    totalLikes: statsData.totalLikes || 0,
                    totalCategories: categoriesData.length
                });
            } catch (error) {
                console.error('Error loading admin stats:', error);
                // Fallback to default values
                setStats({
                    totalUsers: 0,
                    totalPosts: 0,
                    publishedPosts: 0,
                    pendingPosts: 0,
                    totalViews: 0,
                    totalLikes: 0,
                    totalCategories: 0
                });
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    const statCards = [
        {
            title: 'Tổng người dùng',
            value: stats.totalUsers,
            icon: '👥',
            color: 'blue',
            change: '+12%',
            changeType: 'positive'
        },
        {
            title: 'Tổng bài viết',
            value: stats.totalPosts,
            icon: '📝',
            color: 'green',
            change: '+8%',
            changeType: 'positive'
        },
        {
            title: 'Bài viết đã xuất bản',
            value: stats.publishedPosts,
            icon: '✅',
            color: 'emerald',
            change: '+15%',
            changeType: 'positive'
        },
        {
            title: 'Bài viết chờ duyệt',
            value: stats.pendingPosts,
            icon: '⏳',
            color: 'yellow',
            change: '-5%',
            changeType: 'negative'
        },
        {
            title: 'Tổng lượt xem',
            value: stats.totalViews.toLocaleString(),
            icon: '👁️',
            color: 'purple',
            change: '+23%',
            changeType: 'positive'
        },
        {
            title: 'Tổng lượt thích',
            value: stats.totalLikes.toLocaleString(),
            icon: '❤️',
            color: 'pink',
            change: '+18%',
            changeType: 'positive'
        },
        {
            title: 'Danh mục',
            value: stats.totalCategories,
            icon: '📂',
            color: 'indigo',
            change: '+2',
            changeType: 'positive'
        }
    ];

    const getColorClasses = (color, changeType) => {
        const colorMap = {
            blue: 'bg-blue-50 border-blue-200 text-blue-700',
            green: 'bg-green-50 border-green-200 text-green-700',
            emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
            yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
            purple: 'bg-purple-50 border-purple-200 text-purple-700',
            pink: 'bg-pink-50 border-pink-200 text-pink-700',
            indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700'
        };

        return colorMap[color] || 'bg-gray-50 border-gray-200 text-gray-700';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className={`p-6 rounded-lg border-2 ${getColorClasses(stat.color)}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium opacity-75">{stat.title}</p>
                                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                            </div>
                            <div className="text-3xl">{stat.icon}</div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <span
                                className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {stat.change}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">so với tháng trước</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Posts Activity Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Hoạt động bài viết (7 ngày qua)
                    </h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        <div className="text-center">
                            <div className="text-4xl mb-2">📈</div>
                            <p className="text-gray-500">Biểu đồ hoạt động</p>
                            <p className="text-sm text-gray-400">Sẽ được tích hợp với thư viện chart</p>
                        </div>
                    </div>
                </div>

                {/* User Growth Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Tăng trưởng người dùng (30 ngày qua)
                    </h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        <div className="text-center">
                            <div className="text-4xl mb-2">📊</div>
                            <p className="text-gray-500">Biểu đồ tăng trưởng</p>
                            <p className="text-sm text-gray-400">Sẽ được tích hợp với thư viện chart</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Hoạt động gần đây
                </h3>
                <div className="space-y-4">
                    {[
                        { action: 'Người dùng mới đăng ký', user: 'user123', time: '5 phút trước', type: 'user' },
                        { action: 'Bài viết mới được tạo', user: 'writer456', time: '12 phút trước', type: 'post' },
                        { action: 'Bài viết được xuất bản', user: 'editor789', time: '1 giờ trước', type: 'publish' },
                        { action: 'Danh mục mới được tạo', user: 'admin001', time: '2 giờ trước', type: 'category' }
                    ].map((activity, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm">
                                    {activity.type === 'user' && '👤'}
                                    {activity.type === 'post' && '📝'}
                                    {activity.type === 'publish' && '✅'}
                                    {activity.type === 'category' && '📂'}
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                <p className="text-xs text-gray-500">bởi {activity.user}</p>
                            </div>
                            <div className="text-xs text-gray-400">{activity.time}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
