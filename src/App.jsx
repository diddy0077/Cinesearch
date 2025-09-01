import { useState, useEffect } from "react";
import { MovieProvider } from "./context/MovieContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import AccountPage from "./pages/Account.jsx";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import MovieDetails from "./pages/MovieDetails.jsx"; // new file



function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (savedUser) setCurrentUser(savedUser);
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
        <Routes>
          {/* Homepage */}
          <Route path="/" element={<Home currentUser={currentUser} />} />

          {/* Other pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/login"
            element={
              <Login
                setCurrentUser={setCurrentUser}
                currentUser={currentUser}
              />
            }
          />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/my-account"
            element={
              currentUser ? (
                <AccountPage
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </div>
    </MovieProvider>
  );
}

export default App;
