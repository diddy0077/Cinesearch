import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import Navbar2 from "../components/Navbar2";
import MovieCard from "../components/MovieCard";
import { Link } from "lucide-react";
import Footer from "../components/Footer";
import RecommendedMovies from "../components/Recommended";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [open, setOpen] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const api_key = "c4a65e04146301c65ab95db42f371f8a";
  const currentUser = auth.currentUser;
  const [similarMovies, setSimilarMovies] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [viewMoreText, setViewMoreText] = useState("View More")

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${api_key}&language=en-US&page=1`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return setSimilarMovies(data.results);
      })
      .catch((err) => console.error("Error fetching similar movies:", err));
  }, [id]);

  // 🔹 Fetch movie details
  useEffect(() => {
      setMovie(null);   // 🔹 clear old movie
    setCast([]);      // 🔹 clear old cast
    setCrew([]);
      setTrailerKey(null);
    setSimilarMovies([]);
    const fetchMovie = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}&language=en-US`
      );
      const data = await res.json();
      setMovie(data);
    };
    fetchMovie();
  }, [id]);

  // 🔹 Fetch credits
  useEffect(() => {
    if (!id) return;
    fetch(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${api_key}&language=en-US`
    )
      .then((res) => res.json())
      .then((data) => {
        setCast(data.cast.slice(0, 12));
        const topCrews = ["Director", "Writer", "Screenplay"];
        setCrew(data.crew.filter((person) => topCrews.includes(person.job)));
      })
      .catch((err) => console.error("Error fetching credits:", err));
  }, [id]);

  // 🔹 Fetch trailer
  useEffect(() => {
    if (!id) return;
    fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${api_key}&language=en-US`
    )
      .then((res) => res.json())
      .then((data) => {
        const trailer = data.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        if (trailer) setTrailerKey(trailer.key);
      });
  }, [id]);

  // 🔹 Check watchlist
  useEffect(() => {
    const checkWatchlist = async () => {
      if (!currentUser || !movie) return;
      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const exists = docSnap
            .data()
            .watchlist?.some((m) => m.id === movie.id);
          setInWatchlist(exists);
        }
      } catch (err) {
        console.error("Error checking watchlist:", err);
      }
    };
    checkWatchlist();
  }, [currentUser, movie]);

  // 🔹 Toggle watchlist
  async function toggleWatchlist() {
    if (!currentUser || !movie) return;
    const docRef = doc(db, "users", currentUser.uid);
    const movieData = {
      id: movie.id,
      original_title: movie.original_title || movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      overview: movie.overview,
    };
    try {
      if (inWatchlist) {
        await updateDoc(docRef, { watchlist: arrayRemove(movieData) });
        setInWatchlist(false);
      } else {
        await updateDoc(docRef, { watchlist: arrayUnion(movieData) });
        setInWatchlist(true);
      }
    } catch (err) {
      console.error("Error updating watchlist:", err);
    }
  }

function viewMore() {
  if (visibleCount < similarMovies.length) {
    setVisibleCount((prev) => {
      const newCount = prev + 10;
      return newCount >= similarMovies.length ? similarMovies.length : newCount;
    });
    setViewMoreText("View Less");
  } else {
    // Reset back to initial count (e.g., 10)
    setVisibleCount(10);
    setViewMoreText("View More");
  }
}


  if (!movie) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="min-h-screen text-white">
      <Navbar2 currentUser={currentUser}/>
      {/* 🔹 Hero Banner */}
      {/* 🔹 Hero Banner */}
      <div
        className="relative w-full h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex items-center justify-center h-full px-6 md:px-16">
          <h1 className="text-5xl md:text-7xl font-extrabold text-center">
            {movie.title}
          </h1>
        </div>
      </div>

      {/* 🔹 Movie Details Section */}
      <div className="px-2 md:px-16 -mt-20 relative z-20">
        <div className="flex flex-col md:flex-row gap-10 p-8 rounded-2xl shadow-lg">
          {/* Poster */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-48 md:w-64 rounded-xl shadow-lg"
          />

          {/* Info */}
          <div className="flex-1 mt-[5rem]">
            <h2 className="text-4xl font-bold">{movie.title}</h2>
            <p className="text-yellow-400 mt-2 text-lg">
              ⭐ {movie.vote_average?.toFixed(1)}
            </p>
            <p className="text-gray-300 mt-4">{movie.overview}</p>

            {/* Buttons */}
            <div className="mt-6 flex gap-4">
              {trailerKey && (
                <button
                  onClick={() => setOpen(true)}
                  className="px-6 py-3 bg-red-600 rounded-full hover:bg-red-700 transition font-semibold cursor-pointer"
                >
                  ▶ Watch Trailer
                </button>
              )}
              <button
                onClick={toggleWatchlist}
                className="px-6 py-3 bg-gray-800 rounded-full hover:bg-gray-700 transition font-semibold cursor-pointer"
              >
                {inWatchlist ? "✓ Remove from Watchlist" : "+ Add to Watchlist"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Cast Section */}
     <div className="px-6 md:px-16 py-12 relative">
  {/* Background Accent */}
  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 to-gray-950 pointer-events-none rounded-xl"></div>

  {/* Content */}
  <h2 className="relative text-2xl font-bold mb-6 text-white">Cast</h2>
  <div className="relative flex gap-6 overflow-x-auto scrollbar-hide pb-4">
    {cast.map((actor) => (
      <div
        key={actor.id}
        className="w-28 flex-shrink-0 text-center group"
      >
        <div className="relative">
          <img
            src={
              actor.profile_path
                ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                : "/default-avatar.png"
            }
            alt={actor.name}
            className="rounded-lg mb-2 h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-pink-500/30"
          />
          {/* Glow overlay on hover */}
          <div className="absolute inset-0 rounded-lg bg-pink-500/20 opacity-0 group-hover:opacity-100 transition duration-300"></div>
        </div>
        <p className="text-sm font-semibold truncate text-white">
          {actor.name}
        </p>
        <p className="text-gray-400 text-xs truncate">
          as {actor.character}
        </p>
      </div>
    ))}
  </div>
</div>


      {/* 🔹 Crew Section */}
      <div className="relative px-6 md:px-16 pb-12 mx-[1rem] md:mx-[2rem]">
  {/* Section background */}
  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-800/60 to-gray-900/80 rounded-2xl shadow-2xl border border-gray-800" />

  {/* Content */}
  <div className="relative z-10 p-6 md:p-10">
    <h2 className="text-3xl font-extrabold mb-6 text-white tracking-wide flex items-center gap-2">
      <span className="text-pink-500">★</span> Crew
    </h2>

    {crew.find((c) => c.job === "Director") && (
      <p className="text-gray-300 mb-4 text-lg">
        🎬 Directed by{" "}
        <span className="text-white font-medium">
          {crew.find((c) => c.job === "Director").name}
        </span>
      </p>
    )}

    {crew.filter((c) => c.job === "Writer").length > 0 && (
      <p className="text-gray-300 text-lg">
        ✍️ Written by{" "}
        <span className="text-white font-medium">
          {crew
            .filter((c) => c.job === "Writer")
            .map((w) => w.name)
            .join(", ")}
        </span>
      </p>
    )}
  </div>
</div>


      {/* 🔹 Trailer Modal */}
      {trailerKey && open && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl px-4">
            <button
              className="absolute -top-12 right-4 text-white text-3xl hover:text-red-600 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            <iframe
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title={`${movie.title} Trailer`}
              allowFullScreen
              className="rounded-xl"
            ></iframe>
          </div>
        </div>
      )}
      <RecommendedMovies movieId={id} apiKey={api_key} />
      {similarMovies.length > 0 && (
        <div className="flex flex-col items-center gap-6 py-6 mt-16">
          {/* Heading */}
          <div className="flex items-center gap-2">
            <Link className="w-6 h-6 text-pink-500" />
            <h2 className="text-2xl md:text-3xl font-semibold text-white">
              Similar Movies
            </h2>
          </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10 px-4 md:px-6">
            {similarMovies.slice(0, visibleCount).map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.original_title}
                poster={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                rating={movie.vote_average.toFixed(1)}
              />
            ))}
          </div>
          
            <button
              onClick={viewMore}
              className="mt-6 flex items-center gap-2 px-6 py-3 bg-pink-600 text-white font-semibold rounded-full shadow-md hover:bg-pink-500 transition duration-300 cursor-pointer"
            >
             {viewMoreText}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
         
        </div>
      )}
      <Footer />
    </div>
  );
}
