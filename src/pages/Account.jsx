// AccountPage.js
import React, { useEffect, useState } from "react";
import { LogOut, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut, updatePassword,deleteUser  } from "firebase/auth";
import { doc, getDoc, updateDoc,deleteDoc } from "firebase/firestore";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";

export default function AccountPage({ setCurrentUser }) {
  const [userData, setUserData] = useState(null);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openEditPassword, setOpenEditPassword] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const [selectedSearch, setSelectedSearch] = useState(null);
  const [saveMsg, setSaveMsg] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [savedPassword, setSavedPassword] = useState("");
  const [openDelete, setOpenDelete] = useState(false)

  const nav = useNavigate();
  const currentUser = auth.currentUser;

  // ✅ Upload profile photo
//  const handleFileChange = async (e) => {
//   const file = e.target.files[0];
//   if (!file || !currentUser) return;

//   try {
//     setUploading(true);

//     const storageRef = ref(storage, `profilePhotos/${currentUser.uid}`);
//     await uploadBytes(storageRef, file);

//     const photoURL = await getDownloadURL(storageRef);

//     // Update Firebase Auth profile
//     await updateProfile(currentUser, { photoURL });
//     await currentUser.reload(); // ✅ refresh user

//     // Update Firestore
//     const userRef = doc(db, "users", currentUser.uid);
//     await updateDoc(userRef, { photoURL });

//     // Update UI immediately
//     setUserData((prev) => ({ ...prev, photoURL }));

//     alert("Profile photo updated!");
//   } catch (err) {
//     console.error("Error updating photo:", err);
//     setError("Failed to update photo. Try again.");
//   } finally {
//     setUploading(false);
//   }
// };


  // ✅ Fetch user profile & watchlist
  useEffect(() => {
    const fetchUser = async () => {
      if (!currentUser) {
        nav("/login");
        return;
      }

      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setFirstname(data.firstname || "");
          setLastname(data.lastname || "");
          setEmail(data.email || "");
          setWatchlist(data.watchlist || []);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Unable to fetch user data.");
      }
    };

    fetchUser();
  }, [currentUser, nav]);

  // ✅ Logout
  async function logOut() {
    try {
      await signOut(auth);
      setCurrentUser(null);
      nav("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  // ✅ Change password
  async function changePassword(e) {
    e.preventDefault();
    if (!currentUser) return;

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await updatePassword(currentUser, password);
      setSavedPassword("✅ Password changed!");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => setOpenEditPassword(false), 1500);
    } catch (err) {
      console.error("Error updating password:", err);
      setError(err.message || "Failed to update password.");
    }
  }

  // ✅ Save profile changes
  async function saveChanges(e) {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const docRef = doc(db, "users", currentUser.uid);
      await updateDoc(docRef, { firstname, lastname, email });

      setUserData({ ...userData, firstname, lastname, email });
      setSaveMsg("✅ Changes saved!");
      setTimeout(() =>
        setOpenEditForm(false), 1500);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    }
  }

  // ✅ Loading state
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Loading profile...</p>
      </div>
    );
  }

  async function handleDeleteAccount() {

  try {
    // Delete user data in Firestore
    await deleteDoc(doc(db, "users", currentUser.uid));

    // Delete user in Firebase Auth
    await deleteUser(currentUser);
    setCurrentUser(null);
    nav("/signup");
    alert("Account deleted successfully!");
  } catch (err) {
    console.error("Account deletion failed:", err);
    if (err.code === "auth/requires-recent-login") {
      alert("Please login again to delete your account.");
    } else {
      alert("Failed to delete account. Try again.");
    }
  }
}


  return (
    <>
      <Navbar2/>
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Profile Section */}
      <section className="bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
        <div className="flex items-center gap-4 flex-col md:flex-row">
          
          <div className="flex flex-col items- md:items-start">
            <h2 className="text-xl font-bold">{userData.firstname}</h2>
            <p className="text-gray-400 text-sm">{userData.email}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setOpenEditForm(true)}
            className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-2"
          >
            <Edit size={16} /> Edit Profile
          </button>
          <button
            onClick={logOut}
            className="cursor-pointer px-3 py-2 bg-red-600 hover:bg-red-500 rounded-lg flex items-center gap-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </section>

      {/* Watchlist Section */}
      <section className="mt-8 px-2 py-8">
        <h1 className="text-white text-center text-3xl font-semibold mb-8">
          Your Watchlist
        </h1>
        {watchlist.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {watchlist.map((movie) => (
              <div key={movie.id} className="relative">
                <MovieCard
                  title={movie.original_title}
                  poster={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                  rating={movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                  onClick={() => setSelectedSearch(movie)}
                  overview={movie.overview}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            Your watchlist is empty. Start adding movies!
          </p>
        )}
        {selectedSearch && (
          <MovieModal movie={selectedSearch} onClose={() => setSelectedSearch(null)} />
        )}
      </section>

      {/* Account Settings */}
      <section>
        <h3 className="text-2xl font-semibold mb-4">Account Settings</h3>
        <div className="space-y-3">
          <button
            onClick={() => setOpenEditPassword(true)}
            className="w-full text-left px-4 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer"
          >
            Change Password
          </button>
          
          <button onClick={() => setOpenDelete(true)} className="w-full text-left px-4 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer">
            Delete Account
          </button>
        </div>
      </section>

      {/* Edit Profile Modal */}
      {openEditForm && (
        <div className="modal bg-black/60 fixed inset-0 flex items-center justify-center">
          <form
            className="flex flex-col bg-gray-900 p-6 rounded-[1rem] mx-4 relative"
            onSubmit={saveChanges}
            >
              <button
              type="button"
              onClick={() => setOpenEditForm(false)}
              className="absolute top-4 right-4 text-white cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-center text-2xl mb-4">Edit Profile</h2>
            <label className="mb-2">
              First Name:
              <input
                className="w-full px-2 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:outline-none focus:ring-indigo-500 transition duration-300 mt-2"
                type="text"
                required
                onChange={(e) => setFirstname(e.target.value)}
                value={firstname}
              />
            </label>
            <label className="mb-2">
              Last Name:
              <input
                className="w-full px-2 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:outline-none focus:ring-indigo-500 transition duration-300 mt-2"
                type="text"
                required
                onChange={(e) => setLastname(e.target.value)}
                value={lastname}
              />
            </label>
            <label className="mb-2">
              Email:
              <input
                className="w-full px-2 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:outline-none focus:ring-indigo-500 transition duration-300 mt-2"
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </label>
            <button
              className="mt-6 bg-red-600 py-2 rounded-full cursor-pointer active:scale-[0.95] transition duration-300"
              type="submit"
            >
              Save Changes
            </button>
            <p className="text-green-500 text-center mt-3">{saveMsg}</p>
          </form>
        </div>
      )}

      {/* Change Password Modal */}
      {openEditPassword && (
        <div className="modal bg-black/60 fixed inset-0 flex items-center justify-center">
          <form
            onSubmit={changePassword}
            className="flex flex-col bg-gray-900 p-6 rounded-[1rem] mx-4 gap-4 relative"
            >
              <h1 className="text-center font-semibold text-lg mb-4">Create a New Password</h1>
            <button
              type="button"
              onClick={() => setOpenEditPassword(false)}
              className="absolute top-4 right-4 text-white cursor-pointer"
            >
              ✕
            </button>
            <div>
              <label htmlFor="new-password">New Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                id="new-password"
                className="w-full px-2 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:outline-none focus:ring-indigo-500 transition duration-300 mt-2"
              />
            </div>
            <div>
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type="password"
                id="confirm-password"
                className="w-full px-2 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:outline-none focus:ring-indigo-500 transition duration-300 mt-2"
              />
            </div>
            <button
              className="my-2 text-sm bg-red-600 py-2 px-4 font-medium rounded-full cursor-pointer self-center active:scale-[0.95] transition duration-300"
              type="submit"
            >
              Change Password
            </button>
            {error && <p className="text-red-600 text-center">{error}</p>}
            {savedPassword && <p className="text-green-600 text-center">{savedPassword}</p>}
          </form>
        </div>
      )}

      {openDelete && <div className="modal bg-black/60 fixed inset-0 flex items-center justify-center">
        <div className="bg-gray-900 p-4 rounded-lg mx-4">
          <p className="text-white text-center">Are you sure you want to delete your account? This cannot be undone.</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <button onClick={() => setOpenDelete(false)} className="text-white my-2 bg-red-600 py-2 px-4 font-medium rounded-full cursor-pointer self-center transition duration-300 active:scale-[0.95]">Cancel</button>
          <button onClick={handleDeleteAccount} className="text-white my-2 bg-indigo-600 py-2 px-4 font-medium rounded-full cursor-pointer self-center transition duration-300 active:scale-[0.95]">Confirm</button>
          </div>
        </div>
      </div>}
      </div>
      <Footer/>
      </>
  );
}
