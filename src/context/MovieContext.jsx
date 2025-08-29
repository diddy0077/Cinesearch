// src/context/MovieContext.jsx
import { createContext, useContext, useState,useEffect } from "react";

// 1. Create the Context
const MovieContext = createContext();

// 2. Create the Provider
export const MovieProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    // Load from localStorage on first render
    const stored = localStorage.getItem("watchlist");
    return stored ? JSON.parse(stored) : [];
  });

  // Save to localStorage whenever watchlist changes
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  return (
    <MovieContext.Provider value={{ watchlist, setWatchlist }}>
      {children}
    </MovieContext.Provider>
  );
};
// 3. Create a helper hook for easy access
export function useMovieContext() {
  return useContext(MovieContext);
}
