import { useNavigate } from 'react-router-dom';
export const NewsCard = ({ news }) => {


    const navigate = useNavigate();

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/news/${news.id}`)}>

            <img
                src={news.thumbnailUrl}
                alt={news.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {news.categoryName}
                    </span>
                    <span>{formatDate(news.publishedAt)}</span>
                </div>

                <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer">
                    {news.title}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {news.description}
                </p>

                {/* Tags nằm trên phần tác giả, nhỏ lại */}
                {news.tags && news.tags.length > 0 && (
                    <div className="mt-2 mb-2 flex flex-wrap gap-1">
                        {news.tags.map((tag, idx) => (
                            <span
                                key={idx}
                                className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span >Bởi {news.username}</span>
                    <div className="flex items-center space-x-4">
                        <span>👀 {news.views}</span>
                        <span>👍 {news.likeCount}</span>
                        <span>👎 {news.dislikeCount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};