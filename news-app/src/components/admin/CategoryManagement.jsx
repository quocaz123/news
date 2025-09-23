import { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/adminService';

export default function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                const response = await getCategories();
                const categoriesData = response.data.result || [];

                // Transform data to match frontend format
                const transformedCategories = categoriesData.map(category => ({
                    id: category.id,
                    name: category.name,
                    description: category.description || 'Không có mô tả',
                    postsCount: category.postCount || 0,
                    createdAt: category.createdAt || new Date().toISOString().split('T')[0],
                    status: 'ACTIVE' // Backend doesn't have status field, default to ACTIVE
                }));

                setCategories(transformedCategories);
            } catch (error) {
                console.error('Error loading categories:', error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateCategory = async () => {
        if (newCategory.name.trim()) {
            try {
                const response = await createCategory({
                    name: newCategory.name.trim(),
                    description: newCategory.description.trim()
                });

                const newCategoryData = response.data.result;
                const transformedCategory = {
                    id: newCategoryData.id,
                    name: newCategoryData.name,
                    description: newCategoryData.description || 'Không có mô tả',
                    postsCount: 0,
                    createdAt: new Date().toISOString().split('T')[0],
                    status: 'ACTIVE'
                };

                setCategories(prev => [...prev, transformedCategory]);
                setNewCategory({ name: '', description: '' });
                setShowCreateModal(false);
            } catch (error) {
                console.error('Error creating category:', error);
                alert('Có lỗi xảy ra khi tạo danh mục');
            }
        }
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setNewCategory({ name: category.name, description: category.description });
        setShowCreateModal(true);
    };

    const handleUpdateCategory = async () => {
        if (editingCategory && newCategory.name.trim()) {
            try {
                const response = await updateCategory(editingCategory.id, {
                    name: newCategory.name.trim(),
                    description: newCategory.description.trim()
                });

                const updatedCategoryData = response.data.result;
                setCategories(prev => prev.map(cat =>
                    cat.id === editingCategory.id
                        ? {
                            ...cat,
                            name: updatedCategoryData.name,
                            description: updatedCategoryData.description || 'Không có mô tả'
                        }
                        : cat
                ));
                setEditingCategory(null);
                setNewCategory({ name: '', description: '' });
                setShowCreateModal(false);
            } catch (error) {
                console.error('Error updating category:', error);
                alert('Có lỗi xảy ra khi cập nhật danh mục');
            }
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            try {
                await deleteCategory(categoryId);
                setCategories(prev => prev.filter(cat => cat.id !== categoryId));
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Có lỗi xảy ra khi xóa danh mục');
            }
        }
    };

    const handleToggleStatus = (categoryId) => {
        setCategories(prev => prev.map(cat =>
            cat.id === categoryId
                ? { ...cat, status: cat.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
                : cat
        ));
    };

    const getStatusBadge = (status) => {
        const statusStyles = {
            ACTIVE: 'bg-green-100 text-green-800',
            INACTIVE: 'bg-gray-100 text-gray-800'
        };
        const statusLabels = {
            ACTIVE: 'Hoạt động',
            INACTIVE: 'Tạm dừng'
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>
                {statusLabels[status]}
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
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm danh mục..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400">🔍</span>
                        </div>
                    </div>
                </div>

                {/* Create Button */}
                <button
                    onClick={() => {
                        setEditingCategory(null);
                        setNewCategory({ name: '', description: '' });
                        setShowCreateModal(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <span>➕</span>
                    Tạo danh mục mới
                </button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                    <div key={category.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                                <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                                {getStatusBadge(category.status)}
                                <div className="text-xs text-gray-500">
                                    {category.postsCount} bài viết
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <span>Tạo: {category.createdAt}</span>
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleEditCategory(category)}
                                className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                                Sửa
                            </button>
                            <button
                                onClick={() => handleToggleStatus(category.id)}
                                className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${category.status === 'ACTIVE'
                                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                            >
                                {category.status === 'ACTIVE' ? 'Tạm dừng' : 'Kích hoạt'}
                            </button>
                            <button
                                onClick={() => handleDeleteCategory(category.id)}
                                className="flex-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {editingCategory ? 'Sửa danh mục' : 'Tạo danh mục mới'}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên danh mục <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Nhập tên danh mục..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mô tả
                                </label>
                                <textarea
                                    value={newCategory.description}
                                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Nhập mô tả danh mục..."
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {editingCategory ? 'Cập nhật' : 'Tạo mới'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
