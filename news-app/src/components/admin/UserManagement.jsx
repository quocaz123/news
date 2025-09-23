import { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../../services/adminService';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                const response = await getUsers();
                const usersData = response.data.result || [];

                // Transform data to match frontend format
                const transformedUsers = usersData.map(user => ({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.roles?.[0]?.name || 'USER',
                    status: 'ACTIVE', // Backend doesn't have status field, default to ACTIVE
                    createdAt: user.createdAt || new Date().toISOString().split('T')[0],
                    lastLogin: user.lastLogin || 'Chưa đăng nhập',
                    postsCount: 0 // Will be calculated separately if needed
                }));

                setUsers(transformedUsers);
            } catch (error) {
                console.error('Error loading users:', error);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, [pageSize]);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    // Pagination logic
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    const totalFilteredPages = Math.ceil(filteredUsers.length / pageSize);

    const handleSelectUser = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        setSelectedUsers(
            selectedUsers.length === paginatedUsers.length
                ? []
                : paginatedUsers.map(user => user.id)
        );
    };

    const handleBulkAction = (action) => {
        console.log(`Bulk action: ${action}`, selectedUsers);
        // Implement bulk actions
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleFilterChange = (e) => {
        setFilterRole(e.target.value);
        setCurrentPage(1); // Reset to first page when filtering
    };

    const handleUserAction = async (userId, action) => {
        try {
            switch (action) {
                case 'edit':
                    // Open edit modal or navigate to edit page
                    console.log('Edit user:', userId);
                    break;
                case 'view':
                    // Open view modal or navigate to view page
                    console.log('View user:', userId);
                    break;
                case 'delete':
                    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
                        await deleteUser(userId);
                        setUsers(prev => prev.filter(user => user.id !== userId));
                    }
                    break;
                default:
                    console.log(`Unknown action: ${action}`, userId);
            }
        } catch (error) {
            console.error(`Error performing action ${action}:`, error);
            alert('Có lỗi xảy ra khi thực hiện hành động');
        }
    };

    const getRoleBadge = (role) => {
        const roleStyles = {
            ADMIN: 'bg-red-100 text-red-800',
            PUBLISHER: 'bg-blue-100 text-blue-800',
            USER: 'bg-gray-100 text-gray-800'
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleStyles[role]}`}>
                {role}
            </span>
        );
    };

    const getStatusBadge = (status) => {
        const statusStyles = {
            ACTIVE: 'bg-green-100 text-green-800',
            BANNED: 'bg-red-100 text-red-800',
            INACTIVE: 'bg-yellow-100 text-yellow-800'
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>
                {status}
            </span>
        );
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
                <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>

                {/* Search and Filter */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm người dùng..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-400">🔍</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-48">
                        <select
                            value={filterRole}
                            onChange={handleFilterChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả vai trò</option>
                            <option value="ADMIN">Admin</option>
                            <option value="PUBLISHER">Publisher</option>
                            <option value="USER">User</option>
                        </select>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedUsers.length > 0 && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleBulkAction('delete')}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Xóa ({selectedUsers.length})
                        </button>
                    </div>
                )}
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="w-12 px-3 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                                        onChange={handleSelectAll}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                <th className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Người dùng
                                </th>
                                <th className="w-20 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vai trò
                                </th>
                                <th className="w-20 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="w-16 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Bài viết
                                </th>
                                <th className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Đăng nhập cuối
                                </th>
                                <th className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="w-12 px-3 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => handleSelectUser(user.id)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="w-1/3 px-6 py-4">
                                        <div className="flex items-center min-w-0">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-blue-600 font-medium">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="ml-4 min-w-0 flex-1">
                                                <div className="text-sm font-medium text-gray-900 truncate">{user.username}</div>
                                                <div className="text-sm text-gray-500 truncate">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="w-20 px-6 py-4">
                                        {getRoleBadge(user.role)}
                                    </td>
                                    <td className="w-20 px-6 py-4">
                                        {getStatusBadge(user.status)}
                                    </td>
                                    <td className="w-16 px-6 py-4 text-sm text-gray-900 text-center">
                                        {user.postsCount}
                                    </td>
                                    <td className="w-32 px-6 py-4 text-sm text-gray-500">
                                        <div className="truncate" title={user.lastLogin}>
                                            {user.lastLogin}
                                        </div>
                                    </td>
                                    <td className="w-24 px-6 py-4">
                                        <div className="flex flex-col space-y-1">
                                            <button
                                                onClick={() => handleUserAction(user.id, 'edit')}
                                                className="text-blue-600 hover:text-blue-900 text-xs"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleUserAction(user.id, 'view')}
                                                className="text-green-600 hover:text-green-900 text-xs"
                                            >
                                                Xem
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
                                Hiển thị <span className="font-medium">{startIndex + 1}</span> đến <span className="font-medium">{Math.min(endIndex, filteredUsers.length)}</span> của{' '}
                                <span className="font-medium">{filteredUsers.length}</span> kết quả
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

                                {/* Page Numbers - Smart pagination */}
                                {(() => {
                                    const pages = [];
                                    const maxVisiblePages = 5;
                                    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                                    let endPage = Math.min(totalFilteredPages, startPage + maxVisiblePages - 1);

                                    // Adjust start page if we're near the end
                                    if (endPage - startPage + 1 < maxVisiblePages) {
                                        startPage = Math.max(1, endPage - maxVisiblePages + 1);
                                    }

                                    // First page + ellipsis
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

                                    // Visible pages
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

                                    // Ellipsis + last page
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
