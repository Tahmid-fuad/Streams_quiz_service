import { useState, useContext } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { AuthContext } from "./../context/AuthContext";
import { changeEmail, updateUser, changePassword } from "../services/api/auth";

export default function AdminProfile() {
  const { user } = useContext(AuthContext);

  const [adminInfo, setAdminInfo] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "admin@example.com",
    role: user?.role || "Admin",
  });

  const [editMode, setEditMode] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ email: "", newRole: "student" });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [roleMessage, setRoleMessage] = useState({ type: "", text: "" });

  const handleSave = async (e) => {
    e.preventDefault();
    let success = [];
    let failure = [];

    try {
      if (adminInfo.name !== user.name) {
        await updateUser({ email: user.email, newName: adminInfo.name });
        success.push("Name");
      }

      if (adminInfo.email !== user.email) {
        await changeEmail({ email: user.email, newEmail: adminInfo.email });
        success.push("Email");
      }

      if (passwords.currentPassword && passwords.newPassword) {
        try {
          await changePassword({
            email: user.email,
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
          });
          success.push("Password");
        } catch (err) {
          const msg =
            err?.response?.data?.message || "Failed to change Password";
          failure.push("Password (" + msg + ")");
        }
      }

      if (success.length > 0 && failure.length === 0) {
        setMessage({
          type: "success",
          text: `${success.join(", ")} updated successfully.`,
        });
      } else if (success.length > 0 && failure.length > 0) {
        setMessage({
          type: "warning",
          text: `${success.join(", ")} updated. But ${failure.join(
            ", "
          )} failed.`,
        });
      } else if (failure.length > 0) {
        setMessage({
          type: "error",
          text: `Update failed: ${failure.join(", ")}`,
        });
      } else {
        setMessage({
          type: "info",
          text: "No changes made.",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred." });
    } finally {
      setPasswords({ currentPassword: "", newPassword: "" });
      setEditMode(false);
    }
  };

  const handleRoleSwitch = async (e) => {
    e.preventDefault();
    const roleToDisplay = newAdmin.newRole;
    try {
      await updateUser({
        email: newAdmin.email,
        newRole: roleToDisplay,
      });
      setRoleMessage({
        type: "success",
        text: `User role updated to ${roleToDisplay}.`,
      });
      setNewAdmin({ email: "", newRole: "student" });
    } catch {
      setRoleMessage({ type: "error", text: "Failed to update user role." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="container mx-auto p-6">
        <h2 className="text-4xl font-extrabold text-blue-800 mb-8 text-center tracking-wide">
          👤 Admin Profile
        </h2>

        {/* Personal Information */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 border-2 border-blue-300">
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
              <button
                onClick={() => setEditMode(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg"
              >
                Edit Info
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSave}
              className="space-y-4 text-blue-900 font-semibold"
            >
              <input
                type="text"
                name="name"
                value={adminInfo.name}
                onChange={(e) =>
                  setAdminInfo({ ...adminInfo, name: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="email"
                name="email"
                value={adminInfo.email}
                onChange={(e) =>
                  setAdminInfo({ ...adminInfo, email: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords((p) => ({
                    ...p,
                    currentPassword: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords((p) => ({ ...p, newPassword: e.target.value }))
                }
                className="w-full p-2 border rounded"
              />

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-6 py-2 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="bg-red-500 text-white px-6 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {message.text && (
            <p
              className={`mt-4 text-center font-semibold ${
                message.type === "success"
                  ? "text-green-600"
                  : message.type === "error"
                  ? "text-red-600"
                  : message.type === "warning"
                  ? "text-yellow-600"
                  : "text-gray-600"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>

        {/* Admin Settings Section */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 border-2 border-blue-300 mt-12">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4 border-b border-blue-300 pb-2">
            Admin Settings
          </h3>

          <form onSubmit={handleRoleSwitch} className="space-y-4 max-w-md">
            <input
              type="email"
              placeholder="User Email"
              value={newAdmin.email}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, email: e.target.value })
              }
              className="w-full p-3 border rounded"
              required
            />
            <select
              value={newAdmin.newRole}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, newRole: e.target.value })
              }
              className="w-full p-3 border rounded"
            >
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded"
            >
              Change Role
            </button>

            {roleMessage.text && (
              <p
                className={`mt-4 font-semibold text-center ${
                  roleMessage.type === "success"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {roleMessage.text}
              </p>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
