import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchUserById } from "../services/api";

/**
 * UserDetails Component - Displays detailed information about a specific user
 * Handles loading, error, and navigation
 */
const UserDetails = ({ users = [] }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUser = async () => {
    if (!id) {
      setError("No user ID provided");
      setIsLoading(false);
      return;
    }

    // First check if user exists in local state
    const localUser = users.find(u => u.id.toString() === id || u.id === id);
    if (localUser) {
      setUser(localUser);
      setIsLoading(false);
      return;
    }

    // If not found locally, try to fetch from API
    setIsLoading(true);
    setError("");

    try {
      const data = await fetchUserById(id);
      if (!data || Object.keys(data).length === 0) {
        throw new Error("No user data received from server");
      }
      setUser(data);
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Failed to load user details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [id]);

  const handleBack = () => navigate("/");

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Loading user details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={handleBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">User Details</h1>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
          >
            ← Back to Users
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600">{user.phone}</p>
          <p className="text-gray-600">{user.website}</p>

          {user.company && (
            <div className="mt-4">
              <h3 className="font-semibold">Company</h3>
              <p>{user.company.name}</p>
              <p className="text-sm text-gray-500">{user.company.catchPhrase}</p>
            </div>
          )}

          {user.address && (
            <div className="mt-4">
              <h3 className="font-semibold">Address</h3>
              <p>{user.address.street}, {user.address.city}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
