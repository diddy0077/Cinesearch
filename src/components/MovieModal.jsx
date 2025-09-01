import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc, getDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import MovieCard from "./MovieCard";

export default function MovieModal({ movie, onClose }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [open, setOpen] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [cast, setCast] = useState([])
  const [crew, setCrew] = useState([])
  const api_key = "c4a65e04146301c65ab95db42f371f8a";
  const currentUser = auth.currentUser;

  

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${api_key}&language=en-US`)
      .then((response) => {
      return response.json()
      })
      .then((data) => {
        const cast = data.cast.slice(0, 10)
        setCast(cast)
        const topCrews =  ["Director", "Writer", "Screenplay"]
        const crew = data.crew.filter((person) => {
          return topCrews.includes(person.job)
        })
        setCrew(crew)
      })
    .catch((err) => console.error("Error fetching credits:", err));
  }, [movie])

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${movie.id}/recommendations?api_key=${api_key}`)
      .then((res) => {
      return res.json()
      })
      .then((data) => {
      return console.log(data.results)
    })
  }, [movie])



  // ✅ Fetch trailer
  useEffect(() => {
    if (!movie?.id) return;

    fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${api_key}&language=en-US`
    )
      .then((res) => res.json())
      .then((data) => {
        const trailer = data.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        if (trailer) setTrailerKey(trailer.key);
      })
      .catch((err) => console.error(err));
  }, [movie]);

  // ✅ Check if movie is in user’s watchlist
  useEffect(() => {
    const checkWatchlist = async () => {
      if (!currentUser) return;
      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const exists = data.watchlist?.some((m) => m.id === movie.id);
          setInWatchlist(exists);
        }
      } catch (err) {
        console.error("Error checking watchlist:", err);
      }
    };

    checkWatchlist();
  }, [currentUser, movie]);

  // ✅ Toggle add/remove in Firestore
  async function toggleWatchlist() {
    if (!currentUser) return;

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
        await updateDoc(docRef, {
          watchlist: arrayRemove(movieData),
        });
        setInWatchlist(false);
      } else {
        await updateDoc(docRef, {
          watchlist: arrayUnion(movieData),
        });
        setInWatchlist(true);
      }
    } catch (err) {
      console.error("Error updating watchlist:", err);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50 p-4">
  <div className="bg-gray-900 py-8 rounded-2xl max-w-4xl w-full p-6 relative flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto md:overflow-y-auto scrollbar-hide">
    
    {/* Close button */}
    <button
      className="absolute top-4 right-4 text-white text-3xl hover:text-red-600 transition cursor-pointer"
      onClick={onClose}
    >
      ×
    </button>

    {/* Poster */}
    <div className="flex-shrink-0">
      <img
        src={
          movie.poster ||
          `https://image.tmdb.org/t/p/original${movie.poster_path}`
        }
        alt={movie.title}
        className="w-64 h-full object-cover rounded-xl shadow-2xl"
      />
    </div>

    {/* Movie Details */}
    <div className="flex-1 flex flex-col">
      <h2 className="text-4xl font-extrabold text-white">{movie.title}</h2>
      <p className="text-yellow-400 mt-2 text-lg">
        ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
      </p>
      <p className="text-gray-300 mt-4">{movie.overview}</p>

      {/* Buttons */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => setOpen(true)}
          className="px-5 py-2 bg-red-600 rounded-full hover:bg-red-700 shadow-lg transform hover:scale-105 transition cursor-pointer"
        >
          ▶ Trailer
        </button>
        <button
          onClick={toggleWatchlist}
          className="px-5 py-2 bg-gray-800/70 rounded-full hover:bg-gray-700 shadow-lg transform hover:scale-105 transition cursor-pointer text-white"
        >
          {inWatchlist ? "✓ Remove from Watchlist" : "+ Add to Watchlist"}
        </button>
      </div>

      {/* Cast Section */}
      <div className="mt-8">
        <h3 className="text-xl text-white font-bold mb-3">Cast</h3>
        <div className="flex gap-4 max-w-[600px] overflow-x-auto scrollbar-hide scroll-smooth pb-2 px-2">
          {cast.map((actor) => (
            <div key={actor.id} className="w-24 flex-shrink-0 text-center">
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                    : "https://img.freepik.com/premium-photo/memoji-emoji-handsome-smiling-man-white-background_826801-6987.jpg?semt=ais_hybrid&w=740&q=80"
                }
                alt={actor.name}
                className="rounded-lg mb-2"
              />
              <p className="text-white text-sm font-semibold truncate">{actor.name}</p>
              <p className="text-gray-400 text-xs truncate">as {actor.character}</p>
            </div>
          ))}
        </div>
          </div>
          <div className="mt-4">
  {crew.find((c) => c.job === "Director") && (
    <p className="text-gray-300">
      🎬 Directed by{" "}
      <span className="text-white">
        {crew.find((c) => c.job === "Director").name}
      </span>
    </p>
  )}
  {crew.filter((c) => c.job === "Writer").length > 0 && (
    <p className="text-gray-300 mb-4">
      ✍️ Written by{" "}
      {crew
        .filter((c) => c.job === "Writer")
        .map((w) => w.name)
        .join(", ")}
    </p>
  )}
</div>

    </div>

    {/* Trailer modal */}
    {trailerKey && open && (
      <div className="bg-black/40 absolute h-screen w-full inset-0 flex items-center justify-center px-1">
        <div className="w-full md:absolute md:h-screen">
          <button
            className="absolute top-6 right-4 text-white text-3xl hover:text-red-600 transition cursor-pointer"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
          <iframe
            width="100%"
            height="360"
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title={`${movie.title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-xl mt-6"
          ></iframe>
        </div>
      </div>
    )}
  </div>
</div>

  );
}
