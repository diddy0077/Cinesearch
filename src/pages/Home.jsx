import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import MovieGrid from "../components/MovieGrid";
import Footer from "../components/Footer.jsx";

function Home({currentUser}) {
   const [searchResults, setSearchResults] = useState([]);
    const [input, setInput] = useState("");
    const [featuredMovies, setFeaturedMovies] = useState([]);
    const apiKey = "c4a65e04146301c65ab95db42f371f8a";
    const heroMovieSection = useRef(null);
    const display = useRef(null);
  
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
    )
      .then((res) => res.json())
      .then((data) => setFeaturedMovies(data.results))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>

              <Navbar
                setSearchResults={setSearchResults}
                input={input}
                setInput={setInput}
                display={display}
                searchResults={searchResults}
                currentUser={currentUser}
      />
      <Hero
                  featuredMovies={featuredMovies}
                  heroMovieSection={heroMovieSection}
                />
                <MovieGrid
                  movieResults={searchResults}
                  input={input}
                  featuredMovies={featuredMovies}
                  setFeaturedMovies={setFeaturedMovies}
                  heroMovieSection={heroMovieSection}
                  display={display}
      />
      <Footer/>
    </div>
  )
}

export default Home