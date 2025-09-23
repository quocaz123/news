import { useState, useEffect } from 'react';
import { getAllPosts, getCategories, deletePost } from '../../services/postService';

export default function PostManagement() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [selectedPosts, setSelectedPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [postsResponse, categoriesResponse] = await Promise.all([
                    getAllPosts(currentPage, pageSize),
                    getCategories()
                ]);

                const postsData = postsResponse.data.result?.data || [];
                const categoriesData = categoriesResponse.data.result || [];

                setPosts(postsData);
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error loading data:', error);
                setPosts([]);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [currentPage, pageSize]);

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
        const matchesCategory = filterCategory === 'all' || post.categoryId === filterCategory;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Pagination logic
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    const totalFilteredPages = Math.ceil(filteredPosts.length / pageSize);

    const handleSelectPost = (postId) => {
        setSelectedPosts(prev =>
            prev.includes(postId)
                ? prev.filter(id => id !== postId)
                : [...prev, postId]
        );
    };

    const handleSelectAll = () => {
        setSelectedPosts(
            selectedPosts.length === paginatedPosts.length
                ? []
                : paginatedPosts.map(post => post.id)
        );
    };

    const handleBulkAction = async (action) => {
        try {
            switch (action) {
                case 'delete':
                    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedPosts.length} bài viết?`)) {
                        await Promise.all(selectedPosts.map(id => deletePost(id)));
                        setPosts(prev => prev.filter(post => !selectedPosts.includes(post.id)));
                        setSelectedPosts([]);
                    }
                    break;
                default:
                    console.log(`Unknown action: ${action}`);
            }
        } catch (error) {
            console.error(`Error performing bulk action ${action}:`, error);
            alert('Có lỗi xảy ra khi thực hiện hành động');
        }
    };

    const handlePostAction = async (postId, action) => {
        try {
            switch (action) {
                case 'view':
                    console.log('View post:', postId);
                    break;
                case 'edit':
                    console.log('Edit post:', postId);
                    break;
                case 'delete':
                    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
                        await deletePost(postId);
                        setPosts(prev => prev.filter(post => post.id !== postId));
                    }
                    break;
                default:
                    console.log(`Unknown action: ${action}`);
            }
        } catch (error) {
            console.error(`Error performing action ${action}:`, error);
            alert('Có lỗi xảy ra khi thực hiện hành động');
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterChange = (filterType, value) => {
        if (filterType === 'status') {
            setFilterStatus(value);
        } else if (filterType === 'category') {
            setFilterCategory(value);
        }
        setCurrentPage(1);
    };

    const getStatusBadge = (status) => {
        const statusStyles = {
            PUBLISHED: 'bg-green-100 text-green-800',
            PENDING: 'bg-yellow-100 text-yellow-800',
            DRAFT: 'bg-gray-100 text-gray-800',
            REJECTED: 'bg-red-100 text-red-800'
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Không xác định';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col space-y-4">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý bài viết</h1>

                {/* Search and Filters */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm bài viết..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-400">🔍</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <select
                            value={filterStatus}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="PUBLISHED">Đã xuất bản</option>
                            <option value="PENDING">Chờ duyệt</option>
                            <option value="DRAFT">Bản nháp</option>
                            <option value="REJECTED">Bị từ chối</option>
                        </select>

                        <select
                            value={filterCategory}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả danh mục</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedPosts.length > 0 && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleBulkAction('delete')}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Xóa ({selectedPosts.length})
                        </button>
                    </div>
                )}
            </div>

            {/* Posts Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="w-12 px-3 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedPosts.length === paginatedPosts.length && paginatedPosts.length > 0}
                                        onChange={handleSelectAll}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                <th className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Bài viết
                                </th>
                                <th className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Danh mục
                                </th>
                                <th className="w-20 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="w-20 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tương tác
                                </th>
                                <th className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày tạo
                                </th>
                                <th className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50">
                                    <td className="w-12 px-3 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedPosts.includes(post.id)}
                                            onChange={() => handleSelectPost(post.id)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="w-1/3 px-6 py-4">
                                        <div className="flex items-start space-x-3">
                                            {post.thumbnailUrl && (
                                                <img
                                                    src={post.thumbnailUrl}
                                                    alt={post.title}
                                                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                                />
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <div className="text-sm font-medium text-gray-900 truncate">
                                                    {post.title}
                                                </div>
                                                <div className="text-sm text-gray-500 truncate">
                                                    {post.description}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    bởi {post.authorName || 'Không xác định'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="w-24 px-6 py-4 text-sm text-gray-900">
                                        {getCategoryName(post.categoryId)}
                                    </td>
                                    <td className="w-20 px-6 py-4">
                                        {getStatusBadge(post.status)}
                                    </td>
                                    <td className="w-20 px-6 py-4 text-sm text-gray-900">
                                        <div className="text-center">
                                            <div>👁️ {post.views || 0}</div>
                                            <div>❤️ {post.likeCount || 0}</div>
                                        </div>
                                    </td>
                                    <td className="w-32 px-6 py-4 text-sm text-gray-500">
                                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="w-24 px-6 py-4">
                                        <div className="flex flex-col space-y-1">
                                            <button
                                                onClick={() => handlePostAction(post.id, 'view')}
                                                className="text-blue-600 hover:text-blue-900 text-xs"
                                            >
                                                Xem
                                            </button>
                                            <button
                                                onClick={() => handlePostAction(post.id, 'edit')}
                                                className="text-green-600 hover:text-green-900 text-xs"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handlePostAction(post.id, 'delete')}
                                                className="text-red-600 hover:text-red-900 text-xs"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Trước
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalFilteredPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Sau
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-4">
                            <p className="text-sm text-gray-700">
                                Hiển thị <span className="font-medium">{startIndex + 1}</span> đến <span className="font-medium">{Math.min(endIndex, filteredPosts.length)}</span> của{' '}
                                <span className="font-medium">{filteredPosts.length}</span> kết quả
                            </p>
                            {totalFilteredPages > 10 && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500">Đi đến trang:</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max={totalFilteredPages}
                                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                const page = parseInt(e.target.value);
                                                if (page >= 1 && page <= totalFilteredPages) {
                                                    handlePageChange(page);
                                                    e.target.value = '';
                                                }
                                            }
                                        }}
                                        placeholder={currentPage.toString()}
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Trước
                                </button>

                                {/* Smart pagination */}
                                {(() => {
                                    const pages = [];
                                    const maxVisiblePages = 5;
                                    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                                    let endPage = Math.min(totalFilteredPages, startPage + maxVisiblePages - 1);

                                    if (endPage - startPage + 1 < maxVisiblePages) {
                                        startPage = Math.max(1, endPage - maxVisiblePages + 1);
                                    }

                                    if (startPage > 1) {
                                        pages.push(
                                            <button
                                                key={1}
                                                onClick={() => handlePageChange(1)}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                            >
                                                1
                                            </button>
                                        );
                                        if (startPage > 2) {
                                            pages.push(
                                                <span key="ellipsis1" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                    ...
                                                </span>
                                            );
                                        }
                                    }

                                    for (let i = startPage; i <= endPage; i++) {
                                        pages.push(
                                            <button
                                                key={i}
                                                onClick={() => handlePageChange(i)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${i === currentPage
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {i}
                                            </button>
                                        );
                                    }

                                    if (endPage < totalFilteredPages) {
                                        if (endPage < totalFilteredPages - 1) {
                                            pages.push(
                                                <span key="ellipsis2" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                    ...
                                                </span>
                                            );
                                        }
                                        pages.push(
                                            <button
                                                key={totalFilteredPages}
                                                onClick={() => handlePageChange(totalFilteredPages)}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                            >
                                                {totalFilteredPages}
                                            </button>
                                        );
                                    }

                                    return pages;
                                })()}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalFilteredPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Sau
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}