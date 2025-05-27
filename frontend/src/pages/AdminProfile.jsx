import { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminProfile() {
  const [adminInfo, setAdminInfo] = useState({
    name: "John Doe",
    email: "admin@example.com",
    role: "Super Admin",
    joined: "2022-01-15",
    phone: "+1 555 123 4567",
    address: "123 Admin St, Exam City, USA",
  });

  const [editMode, setEditMode] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setMessage("Personal info updated successfully!");
    setEditMode(false);
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (!newAdmin.email || !newAdmin.password) {
      setMessage("Please fill in all new admin fields.");
      return;
    }
    setMessage(`New admin (${newAdmin.email}) added successfully!`);
    setNewAdmin({ email: "", password: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <AdminNavbar />

      <div className="container mx-auto p-6">
        <h2 className="text-4xl font-extrabold text-blue-800 mb-8 text-center tracking-wide">
          👤 Admin Profile
        </h2>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 border-2 border-blue-300">
          {/* Profile Details */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-4 border-b border-blue-300 pb-2">
              Personal Information
            </h3>
            {!editMode ? (
              <div className="space-y-3 text-gray-700 text-lg">
                <p>
                  <strong>Name:</strong> {adminInfo.name}
                </p>
                <p>
                  <strong>Email:</strong> {adminInfo.email}
                </p>
                <p>
                  <strong>Role:</strong> {adminInfo.role}
                </p>
                <p>
                  <strong>Joined On:</strong>{" "}
                  {new Date(adminInfo.joined).toLocaleDateString()}
                </p>
                <p>
                  <strong>Phone:</strong> {adminInfo.phone}
                </p>
                <p>
                  <strong>Address:</strong> {adminInfo.address}
                </p>
                <button
                  onClick={() => {
                    setEditMode(true);
                    setMessage("");
                  }}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition"
                >
                  Edit Info
                </button>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4 text-blue-900 font-semibold">
                <input
                  type="text"
                  name="name"
                  value={adminInfo.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-blue-300 rounded focus:outline-blue-500"
                  placeholder="Name"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={adminInfo.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-blue-300 rounded focus:outline-blue-500"
                  placeholder="Email"
                  required
                />
                <input
                  type="text"
                  name="role"
                  value={adminInfo.role}
                  onChange={handleChange}
                  className="w-full p-2 border border-blue-300 rounded focus:outline-blue-500"
                  placeholder="Role"
                />
                <input
                  type="tel"
                  name="phone"
                  value={adminInfo.phone}
                  onChange={handleChange}
                  className="w-full p-2 border border-blue-300 rounded focus:outline-blue-500"
                  placeholder="Phone"
                />
                <input
                  type="text"
                  name="address"
                  value={adminInfo.address}
                  onChange={handleChange}
                  className="w-full p-2 border border-blue-300 rounded focus:outline-blue-500"
                  placeholder="Address"
                />

                <div className="flex gap-4 mt-2">
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setMessage("");
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <hr className="my-8 border-blue-300" />

          {/* Add New Admin */}
          <div>
            <h3 className="text-2xl font-semibold text-blue-700 mb-4 border-b border-blue-300 pb-2">
              Add New Admin
            </h3>
            <form onSubmit={handleAddAdmin} className="space-y-4 max-w-md">
              <input
                type="email"
                placeholder="Email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                className="w-full p-3 border border-blue-300 rounded-lg focus:outline-blue-500 text-blue-900 font-semibold"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                className="w-full p-3 border border-blue-300 rounded-lg focus:outline-blue-500 text-blue-900 font-semibold"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
              >
                Add Admin
              </button>
            </form>
          </div>

          {message && (
            <p className="mt-6 text-center text-teal-700 font-semibold text-lg animate-pulse">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
