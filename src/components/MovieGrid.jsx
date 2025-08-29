import { useState } from "react";
import MovieCard from "./MovieCard";
import MovieModal from "./MovieModal";
import { useMovieContext } from "../context/MovieContext";

export default function MovieGrid({ movieResults,input,featuredMovies,heroMovieSection,display }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSearch, setSelectedSearch] = useState(null);
  const { watchlist, setWatchlist } = useMovieContext();
  



  // const movies = [
  //   {
  //     title: "Inception",
  //     poster:
  //       "https://m.media-amazon.com/images/M/MV5BZjhkNjM0ZTMtNGM5MC00ZTQ3LTk3YmYtZTkzYzdiNWE0ZTA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
  //     rating: 8.8,
  //     description: "A thief who steals corporate secrets...",
  //   },
  //   {
  //     title: "Avatar",
  //     poster: "https://m.media-amazon.com/images/I/61OUGpUfAyL._AC_SL1000_.jpg",
  //     rating: 7.8,
  //     description: "Humans explore Pandora...",
  //   },
  //   {
  //     title: "Titanic",
  //     poster: "https://i.ebayimg.com/images/g/gnEAAOSwP~tW4HMS/s-l1600.jpg",
  //     rating: 7.9,
  //     description: "A tragic love story...",
  //   },
  //   {
  //     title: "Interstellar",
  //     poster:
  //       "https://preview.redd.it/made-this-poster-for-one-of-the-best-movies-v0-sfgohodb74gb1.jpg?auto=webp&s=39543174b3e56d83faeff20a2ede67ff22c0acaf",
  //     rating: 8.6,
  //     description: "Explorers travel beyond...",
  //   },
  // ];

  return (
    <>
      <div className="p-6 pt-16">
        <h1 className="text-white text-3xl font-bold text-center mb-10">
          🔥Trending Movies
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6" ref={heroMovieSection}>
           {featuredMovies.map((movie, i) => {
            return  <MovieCard
              key={i}
              title={movie.original_title}
              poster={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              rating={(movie.vote_average).toFixed(1)}
              onClick={() => setSelectedMovie(movie)}
              overview={movie.overview}
            />
          })}
        </div>
        {selectedMovie && (
          <MovieModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}
      </div>

      {movieResults.length > 0 && <section className="mt-8 px-6 py-8">
        <h1 className="text-white text-center text-3xl font-semibold mb-8">Movies - {movieResults[0]?.title}</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6" ref={display}>
          {movieResults.map((movie, i) => {
            return  <MovieCard
              key={i}
              title={movie.original_title}
              poster={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              rating={(movie.vote_average).toFixed(1)}
              onClick={() => setSelectedSearch(movie)}
              overview={movie.overview}
            />
          })}
        </div>
        {selectedSearch && (
          <MovieModal movie={selectedSearch} onClose={() => setSelectedSearch(null)} />
        )}
      </section>}

      {/* {watchlist.length > 0 && <section className="mt-8 px-6 py-8">
        <h1 className="text-white text-center text-3xl font-semibold mb-8">Your Watchlist</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {watchlist.map((movie, i) => {
            return  <MovieCard
              key={i}
              title={movie.original_title}
              poster={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              rating={(movie.vote_average).toFixed(1)}
              onClick={() => setSelectedSearch(movie)}
              overview={movie.overview}
            />
          })}
        </div>
        {selectedSearch && (
          <MovieModal movie={selectedSearch} onClose={() => setSelectedSearch(null)} />
        )}
      </section>} */}
    </>
  );
}
