import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    city: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (Object.values(form).some(v => !v)) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      setSuccess('');
      return;
    }
    setError('');
    setSuccess('Đăng ký thành công!');
    // Thực hiện đăng ký ở đây (gọi API nếu có)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Đăng ký NewsHub
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Tên đăng nhập" name="username" value={form.username} onChange={handleChange} autoComplete="username" />
          <Input label="Mật khẩu" name="password" type="password" value={form.password} onChange={handleChange} autoComplete="new-password" />
          <div className="flex gap-2">
            <Input label="Họ" name="lastName" value={form.lastName} onChange={handleChange} />
            <Input label="Tên" name="firstName" value={form.firstName} onChange={handleChange} />
          </div>
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" />
          <Input label="Ngày sinh" name="dob" type="date" value={form.dob} onChange={handleChange} />
          <Input label="Thành phố" name="city" value={form.city} onChange={handleChange} />
          <div>
            <label className="block text-gray-700 mb-1">Vai trò</label>
            <select
              name="role"
              className="w-full border px-4 py-2 rounded"
              value={form.role}
              onChange={handleChange}
            >
              <option value="user">Người dùng</option>
              <option value="publisher">Nhà xuất bản</option>
            </select>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            Đăng ký
          </button>
        </form>
        <div className="mt-6 text-center text-gray-500 text-sm">
          Đã có tài khoản?{' '}
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => navigate('/login')}
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}

// Component input nhỏ gọn
function Input({ label, name, type = "text", value, onChange, autoComplete }) {
  return (
    <div className="flex-1">
      <label className="block text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        className="w-full border px-4 py-2 rounded"
        value={value}
        onChange={onChange}
        placeholder={label}
        autoComplete={autoComplete}
      />
    </div>
  );
}