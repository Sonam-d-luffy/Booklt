import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { User, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { AdminContext } from "../Context/AdminContext";

// interface UserType {
//   _id: string;
//   name?: string;
// }

// interface AdminType {
//   _id: string;
//   name?: string;
// }

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const loginPage = () => navigate("/login");
  const adminLoginPage = () => navigate("/adminLogin");
  const post = () => navigate("/post");

  // ✅ Just use the context as is — don’t override its type
  const userCtx = useContext(UserContext);
  const adminCtx = useContext(AdminContext);

  const currentUser = userCtx?.currentUser;
  const currentAdmin = adminCtx?.currentAdmin;

  const bookings = () => {
    if (currentUser?._id) navigate(`/yourBookings/${currentUser._id}`);
  };

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="relative h-[60vh] mx-4 sm:mx-6 mt-4 rounded-2xl sm:rounded-3xl overflow-hidden"
      style={{
        backgroundImage: `url(${assets.t1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-between px-4 sm:px-[5vw] py-4 text-white font-semibold font-[Poppins] z-50">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src={assets.blogo}
            alt="Logo"
            className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-full border border-white"
          />
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide">
            Booklt
          </h1>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-5 text-base sm:text-lg">
          <p
            onClick={bookings}
            className="cursor-pointer text-yellow-400 hover:text-white transition"
          >
            YOUR BOOKINGS
          </p>
          <p
            onClick={loginPage}
            className="cursor-pointer hover:text-gray-300 transition"
          >
            Login
          </p>
          <p
            onClick={currentAdmin ? post : adminLoginPage}
            className="cursor-pointer hover:text-gray-300 transition"
          >
            Post
          </p>

          {currentUser || currentAdmin ? (
            <span className="text-yellow-400 ml-2 font-bold tracking-wide uppercase">
              {(currentUser?.name || currentAdmin?.name)?.split(" ")[0]}
            </span>
          ) : (
            <User className="cursor-pointer hover:scale-110 transition" size={26} />
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden z-50">
          {menuOpen ? (
            <X
              size={28}
              onClick={() => setMenuOpen(false)}
              className="cursor-pointer text-white"
            />
          ) : (
            <Menu
              size={28}
              onClick={() => setMenuOpen(true)}
              className="cursor-pointer text-white"
            />
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-[70px] left-0 w-full bg-black/80 text-white flex flex-col items-center space-y-4 py-4 text-lg z-40 md:hidden">
          <p
            onClick={bookings}
            onTouchStart={bookings}
            className="cursor-pointer text-yellow-400 hover:text-white"
          >
            YOUR BOOKINGS
          </p>
          <p onClick={loginPage} className="cursor-pointer hover:text-gray-300">
            Login
          </p>
          <p
            onClick={currentAdmin ? post : adminLoginPage}
            className="cursor-pointer hover:text-gray-300"
          >
            Post
          </p>
          {currentUser || currentAdmin ? (
            <span className="text-yellow-400 font-bold uppercase">
              {(currentUser?.name || currentAdmin?.name)?.split(" ")[0]}
            </span>
          ) : (
            <User className="cursor-pointer hover:scale-110 transition" size={26} />
          )}
        </div>
      )}

      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-20 pointer-events-none px-3">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 font-[Poppins] drop-shadow-lg tracking-wide animate-slideOnce">
          Get Best <span className="text-yellow-400">Travel</span> Experiences
        </h2>
        <button
          className="px-6 sm:px-8 py-2 sm:py-3 bg-white text-black font-bold text-base sm:text-lg rounded-full shadow-md hover:scale-105 transition-all duration-300 cursor-pointer pointer-events-auto"
          onClick={() => navigate("/login")}
        >
          Get Started
        </button>
      </div>

      <style>{`
        @keyframes slideOnce {
          0% { transform: translateY(40px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slideOnce {
          animation: slideOnce 1.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Navbar;
