import { useNavigate } from 'react-router-dom';

export default function Forbidden() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-gray-800">403</h1>
                <h2 className="text-2xl font-semibold text-gray-600 mt-4">Access Forbidden</h2>
                <p className="text-gray-500 mt-2">You don't have permission to access this page</p>
                <div className="mt-6 space-x-4">
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Go Home
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}
