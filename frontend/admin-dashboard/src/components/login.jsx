// pages/Login.jsx
import BrandHeader from "./BrandHeader";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <BrandHeader />
        <h2 className="text-xl font-semibold text-center mb-6">Log in to your account</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Log In
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account? <a href="/signup" className="text-indigo-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}
