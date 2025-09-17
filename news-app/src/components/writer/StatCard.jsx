function StatCard({ icon, label, value, color, valueColor, extra }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center flex flex-col items-center">
      <div className={`mb-2 ${color} text-2xl`}>{icon}</div>
      <div className="text-gray-500 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${valueColor || ''}`}>{value}</div>
      {extra}
    </div>
  );
}

export default function DashboardStats({ totalPosts, publishedPosts, totalViews, totalLikes }) {
  return (
    <div className="grid grid-cols-4 gap-6 mb-10">
      <StatCard icon="📄" label="Tổng bài viết" value={totalPosts} color="text-blue-500" />
      <StatCard icon="📈" label="Đã xuất bản" value={publishedPosts} color="text-green-500" valueColor="text-green-600" />
      <StatCard
        icon="👁️"
        label="Tổng lượt xem"
        value={`${(totalViews / 1000).toFixed(1)}k`}
        color="text-purple-500"
        extra={<div className="text-xs text-gray-400">Trung bình {(totalViews / totalPosts).toFixed(0)} lượt xem/bài</div>}
      />
      <StatCard icon="❤️" label="Tổng lượt thích" value={totalLikes} color="text-pink-500" valueColor="text-pink-600" />
    </div>
  );
}