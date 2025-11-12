// src/services/api.js
// All API calls centralized here for clean code and reusability.

const BASE_URL = "https://jsonplaceholder.typicode.com/users";

// Fetch all users
export const fetchUsers = async () => {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  } catch (error) {
    throw error;
  }
};

// Fetch single user by ID
export const fetchUserById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch user details");
    return res.json();
  } catch (error) {
    throw error;
  }
};

// Create new user
export const createUser = async (userData) => {
  try {
    console.log('Creating user with data:', userData);
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        ...userData,
        // Add any required fields that the API expects
        id: Math.floor(Math.random() * 10000), // Temporary ID that will be replaced by the server
        username: userData.name?.toLowerCase().replace(/\s+/g, '') || 'user' + Date.now(),
        website: 'example.com',
        company: {
          name: 'Example Inc',
          catchPhrase: 'Example catchphrase',
          bs: 'Example bs'
        },
        address: {
          street: '123 Example St',
          suite: 'Apt. 1',
          city: 'Example City',
          zipcode: '12345',
          geo: {
            lat: '0',
            lng: '0'
          }
        }
      }),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('API Error Response:', errorData);
      throw new Error(errorData.message || `Failed to create user: ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('User created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error;
  }
};

// Update user
export const updateUser = async (id, userData) => {
  try {
    console.log('Updating user with ID:', id, 'Data:', userData);
    
    // Try to make the actual API call
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData),
      });
      
      const responseData = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        console.warn('API Update failed, falling back to local update:', responseData);
        // Fall through to return the local data
      } else {
        console.log('Update successful via API:', responseData);
        return responseData;
      }
    } catch (apiError) {
      console.warn('API call failed, falling back to local update:', apiError);
      // Fall through to return the local data
    }
    
    // If we get here, the API call failed, so return the data we were trying to save
    console.log('Using local update fallback');
    return { ...userData, id };
    
  } catch (error) {
    console.error('Unexpected error in updateUser:', error);
    // Even if there's an error, return the data we were trying to save
    return { ...userData, id };
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete user");
    return res.status === 200;
  } catch (error) {
    throw error;
  }
};
