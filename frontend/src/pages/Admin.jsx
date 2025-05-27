import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Admin() {
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState('Dashboard');

  return (
    <div>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p>Welcome, {user?.name}! You have admin privileges.</p>
      </div>
    </div>
  );
}