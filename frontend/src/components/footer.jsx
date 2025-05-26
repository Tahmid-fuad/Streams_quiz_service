export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-700">
        
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-indigo-600">EduStream</h2>
          <p className="mt-2 text-sm text-gray-600">
            Empowering students with insightful tools for academic success.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:text-indigo-600 transition">Dashboard</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Exams</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Profile</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Support</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <p className="text-sm">Email: support@edustream.com</p>
          <p className="text-sm">Phone: +1 (800) 123-4567</p>
          <p className="text-sm mt-2">123 Learning Lane, EduCity, 98765</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center py-4 border-t text-sm text-gray-500 bg-gray-50">
        &copy; {new Date().getFullYear()} EduStream. All rights reserved.
      </div>
    </footer>
  );
}
