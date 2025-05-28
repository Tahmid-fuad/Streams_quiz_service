import Navbar from "../components/NavBar";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4">
        <section className="text-center py-12 bg-white rounded-lg shadow-md mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Streams Quiz Admin
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your streams and quizzes with ease. Monitor performance, update content, and engage users.
          </p>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-gray-800">Analytics</h2>
            <p className="text-gray-600">Track quiz performance and user engagement.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-gray-800">Content</h2>
            <p className="text-gray-600">Manage quiz questions and streams.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-gray-800">Users</h2>
            <p className="text-gray-600">View and manage user accounts.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
