import { jwtDecode } from "jwt-decode";

export const decodeToken = (token) => {
    if (!token) {
        console.log('🔑 Token is missing');
        return null;
    }

    try {
        const decoded = jwtDecode(token);
        console.log('🔓 Decoded token:', decoded);
        return decoded;
    } catch (error) {
        console.error('❌ Error decoding token:', error);
        return null;
    }
};

export const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        const isExpired = decoded.exp < currentTime;

        console.log('⏰ Token expiration:', {
            currentTime: new Date(currentTime * 1000).toLocaleString(),
            expirationTime: new Date(decoded.exp * 1000).toLocaleString(),
            isExpired
        });

        return isExpired;
    } catch {
        return true;
    }
};

export const getRoleFromToken = (token) => {
    try {
        const decoded = jwtDecode(token);
        const scope = decoded.scope;
        let role = null;

        if (scope && scope.startsWith('ROLE_')) {
            role = scope.substring(5);
        }

        console.log('👤 User role:', {
            scope,
            extractedRole: role
        });

        return role;
    } catch {
        return null;
    }
};
