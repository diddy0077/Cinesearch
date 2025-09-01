import MovieCard from "./MovieCard";

export default function MovieGrid({ movieResults, featuredMovies, heroMovieSection, display }) {
  return (
    <>
      <div className="p-6 pt-16">
        <h1 className="text-white text-3xl font-bold text-center mb-10">
          🔥 Trending Movies
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6" ref={heroMovieSection}>
          {featuredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.original_title}
              poster={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              rating={movie.vote_average.toFixed(1)}
            />
          ))}
        </div>
      </div>

      {movieResults.length > 0 && (
        <section className="mt-8 px-6 py-8">
          <h1 className="text-white text-center text-3xl font-semibold mb-8">
            Movies - {movieResults[0]?.title}
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6" ref={display}>
            {movieResults.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.original_title}
                poster={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                rating={movie.vote_average.toFixed(1)}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
