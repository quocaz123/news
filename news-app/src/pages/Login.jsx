import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/userService';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // gọi API login
      const res = await login(username, password);

      console.log('Login response:', res);

     if (res.data.code === 1000 && res.data.result?.token) {
      const token = res.data.result.token;

      // lưu token + username vào localStorage
      localStorage.setItem("accessToken", token);
      localStorage.setItem("username", username);

        navigate('/'); // chuyển về trang chủ
      } else {
        setError('Đăng nhập thất bại, vui lòng thử lại.');
      }
    } catch (err) {
      console.error(err);
      setError('Sai username hoặc mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          NewsHub Đăng nhập
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Nhập username..."
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Mật khẩu</label>
            <input
              type="password"
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
              autoComplete="current-password"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <div className="mt-6 text-center text-gray-500 text-sm">
          Chưa có tài khoản?{' '}
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => navigate('/register')}
          >
            Đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  );
}
