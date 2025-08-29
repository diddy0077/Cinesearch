import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc, getDoc, arrayUnion, arrayRemove } from "firebase/firestore";

export default function MovieModal({ movie, onClose }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [open, setOpen] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  const api_key = "c4a65e04146301c65ab95db42f371f8a";
  const currentUser = auth.currentUser;

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
    <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50 p-4 ">
      <div className="bg-gray-900 py-8 rounded-2xl max-w-4xl w-full p-6 relative flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto md:overflow-y-hidden scrollbar-hide">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-white text-3xl hover:text-red-600 transition cursor-pointer"
          onClick={onClose}
        >
          ×
        </button>

        {/* Poster */}
        <img
          src={
            movie.poster ||
            `https://image.tmdb.org/t/p/original${movie.poster_path}`
          }
          alt={movie.title}
          className="w-64 rounded-xl shadow-2xl"
        />

        {/* Movie Details */}
        <div className="flex-1">
          <h2 className="text-4xl font-extrabold text-white">{movie.title}</h2>
          <p className="text-yellow-400 mt-2 text-lg">
            ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
          </p>
          <p className="text-gray-300 mt-4">{movie.overview}</p>

          <div className="mt-4 flex gap-3">
            {/* Trailer button */}
            <button
              onClick={() => setOpen(true)}
              className="px-5 py-2 bg-red-600 rounded-full hover:bg-red-700 shadow-lg transform hover:scale-105 transition cursor-pointer"
            >
              ▶ Trailer
            </button>

            {/* ✅ Add/Remove Watchlist button */}
            <button
              onClick={toggleWatchlist}
              className="px-5 py-2 bg-gray-800/70 rounded-full hover:bg-gray-700 shadow-lg transform hover:scale-105 transition cursor-pointer text-white"
            >
              {inWatchlist ? "✓ Remove from Watchlist" : "+ Add to Watchlist"}
            </button>
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
    </div>
  );
}
