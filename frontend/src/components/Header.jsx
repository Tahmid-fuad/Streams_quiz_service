import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:text-blue-200">Home</Link></li>
            <li><Link to="/users" className="hover:text-blue-200">Users</Link></li>
            <li><Link to="/settings" className="hover:text-blue-200">Settings</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;