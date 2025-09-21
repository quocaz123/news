import { useState, useEffect } from "react";
import { updatePost } from "../../services/postService";

export default function EditNewsModal({ news, isOpen, onClose, onSave, categories = [] }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        content: "",
        categoryId: "",
        tags: "",
        status: "DRAFT",
        file: null,
    });

    // Load dữ liệu khi mở modal
    useEffect(() => {
        if (isOpen && news) {
            setFormData({
                title: news.title || "",
                description: news.description || "",
                content: news.content || "",
                categoryId: news.categoryId || (categories.length > 0 ? categories[0].id : ""),
                tags: news.tags ? (Array.isArray(news.tags) ? news.tags.join(", ") : news.tags) : "",
                status: news.status || "DRAFT",
                file: null,
            });
        }
    }, [isOpen, news, categories]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {

            if (!formData.title.trim()) throw new Error("Tiêu đề không được để trống");
            if (!formData.description.trim()) throw new Error("Mô tả không được để trống");
            if (!formData.content.trim()) throw new Error("Nội dung không được để trống");
            if (!formData.categoryId) throw new Error("Vui lòng chọn danh mục");


            const tagsArray = formData.tags
                ? formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== "")
                : [];


            const postData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                content: formData.content.trim(),
                categoryId: formData.categoryId.trim(),
                tags: tagsArray,
                status: formData.status,
            };


            await updatePost(news.id, postData, formData.file);


            if (onSave) onSave();


            onClose();
        } catch (error) {
            console.error("Error updating post:", error);
            setError(error.response?.data?.message || error.message || "Có lỗi xảy ra khi cập nhật bài viết");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === "file") {
            setFormData((prev) => ({
                ...prev,
                file: files[0],
            }));
        } else if (name === "tags") {
            // Lưu giá trị input trực tiếp
            setFormData((prev) => ({
                ...prev,
                tags: value
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-3xl mx-4 overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Chỉnh sửa bài viết</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tiêu đề <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Nhập tiêu đề bài viết..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    {/* Category + Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Danh mục <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md h-11"
                                required
                            >
                                {categories.length > 0 ? (
                                    categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">Không có danh mục nào</option>
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Trạng thái
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md h-11"
                            >
                                <option value="DRAFT">Bản nháp</option>
                                <option value="PENDING">Chờ duyệt</option>
                                <option value="PUBLISHED">Xuất bản</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Mô tả ngắn gọn về bài viết..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            rows="3"
                            required
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nội dung <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Viết nội dung bài viết của bạn ở đây..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            rows="6"
                            required
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tags
                        </label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags || ''}
                            onChange={handleChange}
                            placeholder="Ví dụ: react, javascript, web"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Phân cách các tags bằng dấu phẩy
                        </p>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ảnh bìa
                        </label>
                        <input
                            type="file"
                            name="file"
                            onChange={handleChange}
                            accept="image/*"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Chọn ảnh mới để thay thế ảnh bìa hiện tại (tùy chọn)
                        </p>
                    </div>

                    {/* Actions */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Đang cập nhật...
                                </>
                            ) : (
                                'Lưu thay đổi'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}