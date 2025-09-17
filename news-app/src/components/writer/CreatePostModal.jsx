import { useState, useEffect } from "react";
import { createPost } from "../../services/postService";

export default function CreatePostModal({ isOpen, onClose, categories = [], onSuccess }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const defaultForm = {
        title: "",
        description: "",
        content: "",
        categoryId: categories.length > 0 ? categories[0].id : "",
        tags: "",  // Lưu tags dưới dạng string
        status: "DRAFT",
        file: null,
    };

    const [formData, setFormData] = useState(defaultForm);

    // 🚀 Load dữ liệu draft từ localStorage khi mở modal
    useEffect(() => {
        if (isOpen) {
            const savedDraft = localStorage.getItem("postDraft");
            if (savedDraft) {
                setFormData(JSON.parse(savedDraft));
            }
        }
    }, [isOpen]);

    // 🚀 Lưu vào localStorage mỗi khi thay đổi form
    useEffect(() => {
        localStorage.setItem("postDraft", JSON.stringify(formData));
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            // Validate dữ liệu trước khi gửi
            if (!formData.title.trim()) throw new Error("Tiêu đề không được để trống");
            if (!formData.description.trim()) throw new Error("Mô tả không được để trống");
            if (!formData.content.trim()) throw new Error("Nội dung không được để trống");
            if (!formData.categoryId) throw new Error("Vui lòng chọn danh mục");
            if (!formData.file) throw new Error("Vui lòng chọn ảnh bìa");

            // Xử lý tags thành mảng
            const tagsArray = formData.tags
                ? formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== "")
                : [];

            // Build object post
            const postData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                content: formData.content.trim(),
                categoryId: formData.categoryId,
                tags: tagsArray,
                status: formData.status,
            };

            console.log("Submitting post JSON:", postData);
            console.log("Submitting file:", formData.file);

            // Gọi service
            await createPost(postData, formData.file);

            // Xóa draft sau khi tạo thành công
            localStorage.removeItem("postDraft");

            // Reset form
            setFormData(defaultForm);

            // Đóng modal
            onClose();

            // Callback để refresh danh sách bài viết
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error creating post:", error);
            setError(error.response?.data?.message || "Có lỗi xảy ra khi tạo bài viết");
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
                    <h2 className="text-2xl font-bold">Create New Article</h2>
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
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter article title..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    {/* Category + Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category <span className="text-red-500">*</span>
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
                                    <option value="">No categories available</option>
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md h-11"
                            >
                                <option value="DRAFT">Draft</option>
                                <option value="PENDING">Pending Review</option>
                                <option value="PUBLISHED">Published</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Brief description of the article..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            rows="3"
                            required
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Content <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Write your article content here..."
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
                            placeholder="Example: react, javascript, web"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Separate tags with commas
                        </p>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cover Image <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            name="file"
                            onChange={handleChange}
                            accept="image/*"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
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
                                    Đang tạo...
                                </>
                            ) : (
                                'Tạo bài viết'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
