import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MovieGrid from "./components/MovieGrid";
import { useState, useEffect, useRef } from "react";
import { MovieProvider } from "./context/MovieContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import AccountPage from "./pages/Account.jsx";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Footer from "./components/Footer.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";



function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [input, setInput] = useState("");
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const apiKey = "c4a65e04146301c65ab95db42f371f8a";
  const heroMovieSection = useRef(null);
  const display = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (savedUser) setCurrentUser(savedUser);
  }, []);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
    )
      .then((res) => res.json())
      .then((data) => setFeaturedMovies(data.results))
      .catch((err) => console.error(err));
  }, []);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setCurrentUser(user || null);
  });
  return () => unsubscribe();
}, []);

  return (
    <MovieProvider>
      <div className="bg-gray-950 min-h-screen">
        {/* Navbar is always shown */}
        <Navbar
          setSearchResults={setSearchResults}
          input={input}
          setInput={setInput}
          display={display}
          searchResults={searchResults}
          currentUser={currentUser}
        />

        {/* Routes control what shows */}
        <Routes>
          {/* Homepage */}
          <Route
            path="/"
            element={
              <>
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
              </>
            }
          />

          {/* Other pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/login" element={<Login setCurrentUser={setCurrentUser} currentUser={currentUser} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
  path="/my-account"
  element={
    currentUser ? (
      <AccountPage currentUser={currentUser} setCurrentUser={setCurrentUser} />
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>

        </Routes>
        <Footer/>
      </div>
    </MovieProvider>
  );
}

export default App;
