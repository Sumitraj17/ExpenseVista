import { useEffect, useState } from "react";
import axios from "axios";

function UserProfile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    profilePicture: "",
    monthTotals: [],
  });

  const fetchData = async () => {
    try {
      const resp = await axios.get("https://expensevista.onrender.com/expense/details", {
        withCredentials: true,
      });
      const data = resp.data;
      console.log(data);
      setUser({
        name: data.user.firstname + " " + data.user.lastname,
        email: data.user.email,
        profilePicture: data.user.profilePicture || "https://via.placeholder.com/150", // Fallback image
        monthTotals: data.monthTotals,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error occurred while fetching user data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* User Info */}
      <h1 className="text-3xl font-bold text-center mb-6">User Profile</h1>
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Expenses Section */}
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Last 3 Months' Expenses
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {user.monthTotals.map((expense, index) => (
          <div
            key={index}
            className="bg-blue-50 shadow-md border border-blue-200 rounded-lg p-4"
          >
            <p className="font-semibold text-blue-700 text-lg">
              {expense.month}
            </p>
            <p className="text-gray-800 font-bold text-xl">
              ₹{expense.totalExpense.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserProfile;
