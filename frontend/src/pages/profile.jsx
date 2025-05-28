import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

export default function NewProfilePage() {
  const { user, logout } = useContext(AuthContext);

  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "johndoe@example.com",
    studentId: "123456",
    grade: "10",
    section: "A",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEdit = () => setEditMode((prev) => !prev);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white text-gray-800 flex flex-col">
      <Navbar />

      <main className="container mx-auto p-6 mt-6 bg-white rounded-lg shadow-md flex-grow">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Image */}
          <div className="relative">
            <img
              src="/image.png"
              alt="User Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500"
            />
            <label
              htmlFor="profileUpload"
              className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-2 py-1 rounded-full cursor-pointer"
            >
              Change
              <input
                id="profileUpload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={() => alert("Profile photo change feature coming soon.")}
              />
            </label>
          </div>

          {/* Profile Info Section */}
          <div className="w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold text-indigo-700">My Profile</h2>

              {/* Edit Profile Button */}
              <div className="ml-auto flex justify-end w-full">
                <button
                  onClick={toggleEdit}
                  className="text-blue-500 font-semibold border-2 border-blue-500 px-6 py-2 rounded-lg hover:bg-blue-100"
                >
                  {editMode ? "Cancel" : "Edit Profile"}
                </button>
              </div>
            </div>

            {editMode ? (
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Grade</label>
                    <input
                      type="text"
                      name="grade"
                      value={profile.grade}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Section</label>
                    <input
                      type="text"
                      name="section"
                      value={profile.section}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    toggleEdit();
                    alert("Profile updated!");
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg mt-4 w-full sm:w-auto"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="text-gray-700 space-y-4">
                <p className="text-lg"><strong>Name:</strong> {profile.name}</p>
                <p className="text-lg"><strong>Email:</strong> {profile.email}</p>
                <p className="text-lg"><strong>Student ID:</strong> {profile.studentId}</p>
                <p className="text-lg"><strong>Grade:</strong> {profile.grade}</p>
                <p className="text-lg"><strong>Section:</strong> {profile.section}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
