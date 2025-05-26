export default function Navbar({ currentPage, setCurrentPage }) {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <img src="/STL-Logo-250.png" alt="Logo" className="h-10 w-100" />
        <span className="text-xl font-bold">EduStream</span>
      </div>
      <div className="space-x-6 hidden md:flex">
        {['Dashboard', 'Exams', 'Profile'].map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`${
              currentPage === page ? 'text-indigo-600 font-semibold' : 'text-gray-700'
            } hover:text-indigo-600 transition`}
          >
            {page}
          </button>
        ))}
      </div>
    </nav>
  );
}
