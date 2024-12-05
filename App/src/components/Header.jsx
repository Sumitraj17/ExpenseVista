import { useState } from "react";
import { FaRegUserCircle, FaHome, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // Import react-hot-toast

const Header = (props) => {
  const [user, setUser] = useState(true);
  const [home, setHome] = useState(false);
  const navigate = useNavigate();
    const {update} = props
  // Logout function
  const handleLogout = async () => {
    try {
      // Call your API to log out the user (e.g., clearing session or token)
      // Example: await axios.post('your_logout_endpoint', { withCredentials: true });

      // Clear any authentication data (e.g., localStorage, cookies)
    //   localStorage.removeItem("userToken"); // Replace with your method for handling authentication
        
      // Show a success toast for logout
      toast.success("You have logged out successfully!");

      // Redirect the user to the login page or home page
      navigate("/login"); // Or any other route as per your needs
      update(false);
      // Reset states
      setUser(true);
      setHome(false);
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <>
      <div className="text-3xl flex justify-end mr-4 mt-4">
        {user && (
          <FaRegUserCircle
            onClick={() => {
              setUser(false);
              setHome(true);
              navigate("/user");
            }}
          />
        )}

        {home && (
          <FaHome
            onClick={() => {
              setUser(true);
              setHome(false);
              navigate("/calendar");
            }}
          />
        )}

       
          <FaSignOutAlt
            onClick={handleLogout}
            className="ml-4 cursor-pointer text-red-500 hover:text-red-700"
          />
       
      </div>
    </>
  );
};

export default Header;
