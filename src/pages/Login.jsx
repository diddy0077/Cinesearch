import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase"; // we need db if we later fetch user profile
import { doc, getDoc } from "firebase/firestore";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import { Eye, EyeOff } from "lucide-react";



export default function Login({ currentUser, setCurrentUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const nav = useNavigate();
  const [hasError, setHasError] = useState(false)

  function validate() {
    if (!email.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
  }

  const inputRef = useRef(null)
  useEffect(() => {
    if (hasError) {
    inputRef.current.classList.add('animate-shake')
  }

  setTimeout(() => {
    inputRef.current.classList.remove('animate-shake')
  }, 500);
  }, [hasError])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }


    try {
      setLoading(true);
      setError("");

      // ✅ Login with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Fetch extra user info from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      let userData = null;

      if (userDoc.exists()) {
        userData = { uid: user.uid, ...userDoc.data() };
      } else {
        // fallback if no extra data
        userData = { uid: user.uid, email: user.email };
      }

      // ✅ Save to state
      setCurrentUser(userData);

      // redirect to account page
      nav("/my-account");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email address");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect email or password");
        setHasError(true)
      } else {
        setError("Failed to log in. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar2 currentUser={currentUser}/>
    <div className="min-h-[85vh] flex items-center justify-center bg-gray-950 mx-4">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-indigo-400 mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Email</label>
              <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
              placeholder="you@example.com"
            />
          </div>

          <div className="relative">
            <label className="block text-gray-300 text-sm mb-2">Password</label>
              <input
              ref={inputRef}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 ${hasError ? 'focus:ring-red-500' : 'focus:ring-indigo-500'} transition duration-300`}
              placeholder="••••••••"
              />
              <button onClick={() => setShowPassword((prev) => {
                return !prev
              })} className="absolute bottom-3 right-4 cursor-pointer">{showPassword ? <EyeOff className="text-white" size={20} /> : <Eye className="text-white" size={20} />}</button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50 shadow-lg transform hover:scale-105 transition duration-300 cursor-pointer active:scale-[0.95]"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
      </div>
      <Footer />
      </>
  );
}
