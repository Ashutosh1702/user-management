import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/api";
import UserList from "../components/UserList";
import UserForm from "../components/UserForm";
import SkeletonLoader from "../components/SkeletonLoader";

/**
 * Home component - Main User Management Dashboard
 */
const Home = ({ users = [], setUsers }) => {
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load users from API
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
      setError("");
    } catch (err) {
      setError("Failed to load users. Please try again later.");
      console.error("Error loading users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load users when component mounts
  useEffect(() => {
    loadUsers();
  }, []);

  // Handle create user
  const handleCreate = async (userData) => {
    try {
      const tempId = `temp-${Date.now()}`;
      const newUser = {
        ...userData,
        id: tempId,
        username:
          userData.name?.toLowerCase().replace(/\s+/g, "") ||
          `user${Date.now()}`,
        website: "example.com",
        company: { name: "Example Inc" },
        address: { city: "Example City" },
      };

      // Optimistic UI update
      setUsers((prev) => [...prev, newUser]);

      try {
        const created = await createUser(newUser);
        setUsers((prev) => prev.map((u) => (u.id === tempId ? created : u)));
      } catch {
        setError("User created locally but not saved to server.");
      }
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Failed to create user.");
    }
  };

  // Handle update user
  const handleUpdate = async (userData) => {
    if (!editingUser) return;
    try {
      const updated = await updateUser(editingUser.id, {
        ...editingUser,
        ...userData,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? updated : u))
      );
      setEditingUser(null);
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user.");
    }
  };

  // Handle edit
  const handleEdit = (user) => {
    setEditingUser(user);
    document
      .getElementById("user-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user.");
    }
  };

  // Handle view — navigate to details page
  const handleView = (user) => {
    navigate(`/users/${user.id}`);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          User Management Dashboard
        </h1>
        <button
          onClick={loadUsers}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-white text-sm font-medium ${
            isLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Refreshing..." : "Refresh Users"}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Form */}
        <div id="user-form" className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editingUser ? `Edit User: ${editingUser.name}` : "Add New User"}
            </h2>
            <UserForm
              key={editingUser ? `edit-${editingUser.id}` : "create"}
              user={editingUser}
              onSubmit={editingUser ? handleUpdate : handleCreate}
              onCancel={() => setEditingUser(null)}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* User List */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Users</h2>

            {isLoading ? (
              <SkeletonLoader count={5} />
            ) : users.length > 0 ? (
              <UserList
                users={users}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No users found. Add your first user using the form.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
