import { useContext, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../Context/AdminContext";

// Define form data structure
interface FormData {
  name: string;
  email: string;
  password: string;
  secretCode: string;
}

// Define Admin structure (should match your backend)
interface Admin {
  _id?: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

// Define expected context shape
interface AdminContextType {
  currentAdmin: Admin | null;
  setCurrentAdmin: React.Dispatch<React.SetStateAction<Admin | null>>;
  logoutAdmin: () => void;
}

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    secretCode: "",
  });

  const { setCurrentAdmin } = useContext(AdminContext) as AdminContextType;
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // toggle login/signup
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage("");
  };

  // handle form submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    try {
      const endpoint = isLogin
        ? `${import.meta.env.VITE_API_URL}/admin/login`
        : `${import.meta.env.VITE_API_URL}/admin/signup`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(isLogin ? "Admin login successful!" : "Admin signup successful!");
        setFormData({ name: "", email: "", password: "", secretCode: "" });
        setCurrentAdmin(data.admin);
        navigate("/");
      } else {
        setMessage(data.message || "Something went wrong ❌");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error ❌");
    }
  };

  return (
    <div
      className="relative h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${assets.t2})` }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Navbar section */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center px-8 py-4 text-white z-50">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={assets.blogo}
            alt="Logo"
            className="h-12 w-12 rounded-full border border-white"
          />
          <h1 className="text-2xl font-bold tracking-wide font-[Poppins]">
            Booklt Admin
          </h1>
        </div>
        <button
          onClick={() => navigate("/")}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-full font-semibold transition"
        >
          Home
        </button>
      </div>

      {/* Login / Signup Form */}
      <div className="relative bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg w-[90%] sm:w-[400px] z-50 text-center">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
          {isLogin ? "Admin Login 🔐" : "Admin Signup ✨"}
        </h2>
        <p className="text-gray-600 mb-6">
          {isLogin
            ? "Login with your admin credentials"
            : "Enter admin details and secret code"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
              <input
                type="text"
                name="secretCode"
                placeholder="1234567890(for testing)"
                value={formData.secretCode}
                onChange={handleChange}
                required
                className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 outline-none"
          />

          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-full transition-all duration-300"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {message && <p className="text-red-600 mt-3">{message}</p>}

        <p className="mt-5 text-gray-700">
          {isLogin
            ? "Don’t have an admin account?"
            : "Already have an account?"}{" "}
          <span
            onClick={toggleForm}
            className="text-yellow-600 font-semibold cursor-pointer hover:underline"
          >
            {isLogin ? "Sign up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
