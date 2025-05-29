import { Link } from "react-router-dom";

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <img src="/STL-Logo-250.png" alt="Logo" className="h-10 w-auto" />
          <h1 className="text-2xl font-bold text-indigo-700">EduStream</h1>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page, or the page does not exist.
        </p>
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Go to Home
          </Link>
          <Link
            to="/login"
            className="inline-block w-full text-indigo-600 hover:underline"
          >
            Log in with a different account
          </Link>
        </div>
      </div>
    </div>
  );
}