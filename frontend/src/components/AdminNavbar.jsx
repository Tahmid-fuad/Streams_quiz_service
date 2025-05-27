import { Link } from "react-router-dom";

export default function AdminNavbar() {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <img src="/STL-Logo-250.png" alt="Logo" className="h-10" />
        <span className="text-xl font-bold text-indigo-700">Admin Panel</span>
      </div>
      <div className="space-x-6 hidden md:flex">
        <Link to="/admin/dashboard" className="hover:text-indigo-600">Dashboard</Link>
        <Link to="/admin/exams" className="hover:text-indigo-600">Exams</Link>
        <Link to="/admin/users" className="hover:text-indigo-600">Users</Link>
        <Link to="/admin" className="hover:text-indigo-600">Profile</Link>
      </div>
    </nav>
  );
}
