import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

export default function Profile() {
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

      <main className="container mx-auto p-6 mt-6 bg-white rounded-lg shadow flex-grow">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <img
              src="/image.png"
              alt="User Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500"
            />
            <label htmlFor="profileUpload" className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-2 py-1 rounded-full cursor-pointer">
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

          <div className="w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-indigo-700">My Profile</h2>
              <button
                onClick={toggleEdit}
                className="text-sm text-indigo-600 hover:underline"
              >
                {editMode ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {editMode ? (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium">Grade</label>
                    <input
                      type="text"
                      name="grade"
                      value={profile.grade}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium">Section</label>
                    <input
                      type="text"
                      name="section"
                      value={profile.section}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    toggleEdit();
                    alert("Profile updated!");
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg mt-2"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="text-gray-700 space-y-2">
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Student ID:</strong> {profile.studentId}</p>
                <p><strong>Grade:</strong> {profile.grade}</p>
                <p><strong>Section:</strong> {profile.section}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
