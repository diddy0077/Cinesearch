import React from "react";
import { Film, Search, Heart } from "lucide-react";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
      <Navbar2/>
    <div className="bg-gray-900 text-white min-h-screen py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-6">About CineSearch</h1>
        <p className="text-lg text-gray-300 mb-12">
          CineSearch is your go-to platform to discover movies, track your favorites, 
          and build your personalized watchlist. Whether you’re looking for the latest 
          blockbusters or hidden gems, we make finding your next movie night pick simple and fun.
        </p>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-10 text-center">
          <div className="p-6 rounded-2xl bg-gray-800 hover:shadow-lg hover:shadow-red-600/30 transition">
            <Film className="mx-auto w-12 h-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Discover Movies</h3>
            <p className="text-gray-400">
              Search and explore a wide range of movies from all genres and decades.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-800 hover:shadow-lg hover:shadow-indigo-600/30 transition">
            <Search className="mx-auto w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
            <p className="text-gray-400">
              Quickly find movies by title, genre, or year with our powerful search engine.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-800 hover:shadow-lg hover:shadow-red-600/30 transition">
            <Heart className="mx-auto w-12 h-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your Watchlist</h3>
            <p className="text-gray-400">
              Save your favorites and access your personal watchlist anytime.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4">Start Exploring Today</h2>
          <p className="text-gray-300 mb-6">
            Sign up and take control of your movie experience with CineSearch.
          </p>
          <a
            href="/signup"
            className="px-6 py-3 bg-red-600 rounded-xl font-medium hover:bg-red-700 transition"
          >
            Get Started
          </a>
        </div>
      </div>
      </div>
      <Footer></Footer>
      </>
  );
};

export default About;
