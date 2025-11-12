import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

/**
 * UserForm Component - Handles user creation and editing
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Form submission handler
 * @param {Object} props.user - Initial form data for editing
 * @param {Function} props.onCancel - Cancel edit mode handler
 * @param {boolean} props.isLoading - Loading state indicator
 */
const UserForm = ({ onSubmit, user, onCancel, isLoading = false }) => {
  const { register, handleSubmit, reset, formState: { errors, isDirty, isValid } } = useForm({
    defaultValues: user || { name: "", email: "", phone: "" },
    mode: 'onChange'
  });

  // Reset form when user data changes
  useEffect(() => {
    reset(user || { name: "", email: "", phone: "" });
  }, [user, reset]);

  const onSubmitForm = async (data) => {
    if (isLoading) return;
    await onSubmit(data);
    if (!user) {
      // Reset form after successful submission for new users
      reset({ name: "", email: "", phone: "" });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          {user ? 'Edit User' : 'Add New User'}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {user 
            ? 'Update user information below.' 
            : 'Fill in the form to add a new user.'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmitForm)} className="p-6">
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                id="name"
                type="text"
                {...register("name", { 
                  required: "Name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" }
                })}
                className={`block w-full rounded-md shadow-sm ${
                  errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                id="email"
                type="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className={`block w-full rounded-md shadow-sm ${
                  errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="mt-1">
              <input
                id="phone"
                type="tel"
                {...register("phone", {
                  pattern: {
                    value: /^[0-9\-\+\(\)\s]*$/,
                    message: "Please enter a valid phone number"
                  }
                })}
                className={`block w-full rounded-md shadow-sm ${
                  errors.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="(123) 456-7890"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {user ? 'Cancel' : 'Clear'}
          </button>
          <button
            type="submit"
            disabled={isLoading || !isDirty || !isValid}
            className={`inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
              isLoading || !isDirty || !isValid 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {user ? 'Updating...' : 'Adding...'}
              </>
            ) : user ? (
              'Update User'
            ) : (
              'Add User'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
