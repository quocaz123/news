const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        NewsHub
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Your trusted source for the latest news and stories from around the world
                    </p>
                    <div className="flex justify-center space-x-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-gray-700 transition-colors duration-200">About</a>
                        <a href="#" className="hover:text-gray-700 transition-colors duration-200">Contact</a>
                        <a href="#" className="hover:text-gray-700 transition-colors duration-200">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-700 transition-colors duration-200">Terms of Service</a>
                    </div>
                    <div className="mt-6 text-sm text-gray-400">
                        © 2024 NewsHub. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
