import React, { useState } from "react";

const Form = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    cost: "",
    description: "",
  });

  const [useCurrentDate, setUseCurrentDate] = useState(false); // Toggle for current date

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateToggle = () => {
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in "YYYY-MM-DD"
    setUseCurrentDate(!useCurrentDate);
    setFormData({
      ...formData,
      date: !useCurrentDate ? currentDate : "", // Toggle between current date and blank
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: "", date: "", cost: "", description: "" }); // Reset form
    if (onClose) onClose(false); // Close the form on submission
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Bill</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
              aria-label="Close form"
            >
              &times;
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bill Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Bill Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Bill title"
              className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>

          {/* Bill Date */}
          <div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useCurrentDate"
                checked={useCurrentDate}
                onChange={handleDateToggle}
                className="mr-2"
              />
              <label
                htmlFor="useCurrentDate"
                className="text-sm font-medium text-gray-700"
              >
                Use current date
              </label>
            </div>
            {!useCurrentDate && (
              <div className="mt-2">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
            )}
          </div>

          {/* Bill Cost */}
          <div>
            <label
              htmlFor="cost"
              className="block text-sm font-medium text-gray-700"
            >
              Bill Cost
            </label>
            <input
              type="number"
              id="cost"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              required
              placeholder="Enter Cost"
              className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>

          {/* Bill Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Description"
              rows="4"
              className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
