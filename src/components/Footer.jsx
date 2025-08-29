import { Film, Github, Twitter, Linkedin,Briefcase  } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo + Brand */}
        <div className="flex items-center gap-2">
          <Film className="w-6 h-6 text-pink-500" />
          <span className="font-semibold text-lg">CineSearch</span>
        </div>

        {/* Links */}
        <div className="flex gap-6 text-sm">
          <Link to="/about" className="hover:text-pink-400 transition">About</Link>
          <Link to="/" className="hover:text-pink-400 transition">Movies</Link>
          <Link to="/contact" className="hover:text-pink-400 transition">Contact</Link>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          <a href="https://github.com/diddy0077" target="_blank" className="hover:text-pink-400 transition" title="Github"><Github className="w-5 h-5" /></a>
          <a href="https://diddy0077.github.io/daniel-udeh/index.html" className="hover:text-pink-400 transition" title="Portfolio"><Briefcase className="w-5 h-5" /></a>
          <a href="https://www.linkedin.com/in/daniel-udeh-a03971350/" target="_blank" className="hover:text-pink-400 transition" title="Linkedin"><Linkedin className="w-5 h-5" /></a>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center text-xs text-gray-500 mt-4">
        © {new Date().getFullYear()} CineSearch. All rights reserved.
      </div>
    </footer>
  );
}
