import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isTokenExpired, getRoleFromToken } from '../../utils/jwtUtils';
import { getToken } from '../../services/localStorageService';

export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthorization();
  }, []);

  const checkAuthorization = () => {
    setIsLoading(true);
    const token = getToken();

    if (!token) {
      setIsAuthorized(false);
      setIsLoading(false);
      return;
    }

    if (isTokenExpired(token)) {
      // 🚨 Không redirect ngay
      // Cho phép axios interceptor tự xử lý refresh khi có request
      console.log('Token hết hạn, chờ interceptor refresh...');
      setIsAuthorized(true);
      setIsLoading(false);
      return;
    }

    const userRole = getRoleFromToken(token);
    if (!userRole) {
      setIsAuthorized(false);
      setIsLoading(false);
      return;
    }

    setIsAuthorized(allowedRoles.includes(userRole));
    setIsLoading(false);
  };

  // 🚩 phần render UI phải nằm ngoài checkAuthorization
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
