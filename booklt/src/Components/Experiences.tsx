import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

// ✅ Define the Experience type
interface Experience {
  _id: string;
  title: string;
  description?: string;
  image?: string;
}

const Experiences: React.FC = () => {
  const [exp, setExp] = useState<Experience[]>([]);
  const [filteredExp, setFilteredExp] = useState<Experience[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExp = async () => {
      try {
        const res = await axios.get<{ experiences: Experience[] }>(
          `${import.meta.env.VITE_API_URL}/exp/all`
        );
        setExp(res.data.experiences);
        setFilteredExp(res.data.experiences);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Server Error");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExp();
  }, []);

  // 🔍 Filter logic
  useEffect(() => {
    const results = exp.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExp(results);
  }, [searchTerm, exp]);

  const details = (id: string) => {
    navigate(`${id}/details`);
  };

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-20 text-base sm:text-lg">
        Loading experiences...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-20 text-base sm:text-lg">
        {error}
      </p>
    );

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 py-16">
      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl font-bold text-yellow-500 text-center mb-8 tracking-wide uppercase">
        Experiences For You
      </h2>

      {/* 🔍 Search Bar */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-md">
          <Search
            size={20}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search experiences..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-sm sm:text-base rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {filteredExp.length > 0 ? (
          filteredExp.map((item) => (
            <div
              key={item._id}
              className="bg-white text-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-200 transform hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-[30vh] object-cover"
                />
              )}

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-semibold text-yellow-500 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base">
                  {item.description || "No description available."}
                </p>

                <button
                  onClick={() => details(item._id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 transition w-full text-sm sm:text-base"
                >
                  Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center col-span-full text-base sm:text-lg">
            No experiences found for “{searchTerm}”.
          </p>
        )}
      </div>
    </div>
  );
};

export default Experiences;
