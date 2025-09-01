import { useNavigate } from "react-router-dom";

export default function MovieCard({ title, poster, rating, id }) {

    const navigate = useNavigate();

  return (
    <div 
      className="relative group rounded-xl overflow-hidden shadow-2xl cursor-pointer transform hover:scale-105 transition-all duration-300"
      onClick={() => navigate(`/movie/${id}`)}
    >
      <img src={poster} alt={title} className="w-full h-auto object-cover"/>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 flex flex-col justify-end p-4 transition-opacity">
        <h3 className="text-white text-lg font-semibold">{title}</h3>
        <span className="text-yellow-400 text-sm mt-1">⭐ {rating}</span>
        <button className="mt-2 px-3 py-1 bg-red-600 rounded-full hover:bg-red-700 shadow-sm text-sm cursor-pointer">More Info</button>
      </div>
    </div>
  )
}
