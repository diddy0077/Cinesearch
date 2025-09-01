import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";

const RecommendedMovies = ({ movieId, apiKey }) => {
  const [recommended, setRecommended] = useState([]);
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${apiKey}&language=en-US&page=1`
        );
        const data = await res.json();
        setRecommended(data.results || []);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommended();
  }, [movieId, apiKey]);

  const scroll = (dir) => {
    const container = document.getElementById("recommended-scroll");
    const scrollAmount = dir === "left" ? -300 : 300;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    setScrollPos(container.scrollLeft + scrollAmount);
  };

  if (!recommended.length) return null;

  return (
    <div className="mt-10 relative">
  <h2 className="text-xl font-semibold text-white mb-4 ml-8">Recommended Movies</h2>

  {/* Left Button */}
  <button
    onClick={() => scroll("left")}
    className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full z-10"
  >
    <ChevronLeft />
  </button>

  {/* Scrollable Row */}
  <div
    id="recommended-scroll"
    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-12"
  >
    {recommended.map((movie) => (
      <Link
        key={movie.id}
        to={`/movie/${movie.id}`}
        className="min-w-[100px] flex-shrink-0 group cursor-pointer"
      >
        <img
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          alt={movie.title}
          className="rounded-lg shadow-md h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <p className="text-xs text-gray-300 mt-1 truncate">{movie.title}</p>
        <p className="text-[10px] text-yellow-400">⭐ {movie.vote_average.toFixed(1)}</p>
      </Link>
    ))}
  </div>

  {/* Right Button */}
  <button
    onClick={() => scroll("right")}
    className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full z-10"
  >
    <ChevronRight />
  </button>
</div>

  );
};

export default RecommendedMovies;
