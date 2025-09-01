import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase"; // <-- make sure you exported db in firebase.js
import { doc, setDoc } from "firebase/firestore";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";

function SignUp({currentUser}) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  function validate() {
    if (!firstname.trim()) return "Firstname is required";
    if (!lastname.trim()) return "Lastname is required";
    if (!email.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
  }

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
      setSuccessMsg("");

      // ✅ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // ✅ Save extra info (firstname, lastname) in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstname,
        lastname,
        email,
        password,
        watchlist: [],
        createdAt: new Date(),
      });

      setSuccessMsg("Account successfully created!");
      setFirstname("");
      setLastname("");
      setEmail("");
      setPassword("");

      // redirect after short delay
      console.log("Redirecting...");
      setTimeout(() => {
        nav("/login");
      }, 2000);
    } catch (err) {
      console.error(err.message);
      if (err.code === "auth/email-already-in-use") {
        setError("Email address currently in use!");
      } else {
        setError("Failed to create account. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar2 currentUser={currentUser}/>
    <div className="flex items-center justify-center min-h-screen bg-gray-950 px-4 py-10">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Create Account
        </h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-300 mb-2">First Name</label>
            <input
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              type="text"
              placeholder="Enter your first name"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:outline-none focus:ring-indigo-500 transition duration-300"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Last Name</label>
            <input
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              type="text"
              placeholder="Enter your last name"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:outline-none focus:ring-indigo-500 transition duration-300"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:outline-none focus:ring-indigo-500 transition duration-300"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Create a password"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:outline-none focus:ring-indigo-500 transition duration-300"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:opacity-50 shadow-lg transform hover:scale-105 transition duration-300 cursor-pointer active:scale-[0.95]"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
          {error && <p className="text-red-600">{error}</p>}
          {successMsg && <p className="text-amber-400">{successMsg}</p>}
        </form>
        <p className="text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
      </div>
      <Footer />
      </>
  );
}

export default SignUp;
