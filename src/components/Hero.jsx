import videoSrc from "../assets/video.mp4";
import MovieModal from "./MovieModal";
import { useState,useEffect } from "react";

export default function Hero({ featuredMovies, heroMovieSection }) {
 
  const [heroMovie, setHeroMovie] = useState(null)
  useEffect(() => {
  const randomIndex = Math.floor(Math.random() * featuredMovies.length)
  setHeroMovie(featuredMovies[randomIndex])
  },[featuredMovies])
  function scroll() {
     heroMovieSection.current?.scrollIntoView({ behavior: "smooth" });
  }


  return (
    <section className="relative h-[90vh] bg-cover bg-center md:mt-0">
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent flex flex-col justify-end p-10 px-5">
        <h2 className="text-5xl font-extrabold text-white drop-shadow-lg">
          {heroMovie?.title}
        </h2>
        <p className="text-gray-300 mt-2 max-w-lg drop-shadow-md font-medium">
          {heroMovie?.overview}
        </p>
        <div className="mt-4 flex gap-3">
          <button className="px-4 py-3 text-white font-medium bg-red-600 rounded-full hover:bg-red-700 shadow-lg transform hover:scale-105 transition cursor-pointer" onClick={scroll}>
            ▶ Watch Trailer
          </button>
          <button className="px-7 py-3 bg-gray-800/70 rounded-full hover:bg-gray-700 shadow-lg transform hover:scale-105 transition text-white font-medium cursor-pointer">
            + Watchlist
          </button>
        </div>
        
      </div>
    </section>
  );
}
