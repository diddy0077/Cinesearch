// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ import storage

const firebaseConfig = {
  apiKey: "AIzaSyD0u58ISFkExLDVBloauu3ZO_zGcgS_q8Q",
  authDomain: "cinesearch-73576.firebaseapp.com",
  projectId: "cinesearch-73576",
  storageBucket: "cinesearch-73576.appspot.com",
  messagingSenderId: "689728405245",
  appId: "1:689728405245:web:cd136fa916643612190894",
  measurementId: "G-FH63X0LGM2",
};

const app = initializeApp(firebaseConfig);

// Auth
const auth = getAuth(app);

// ✅ Force Firebase to persist session in localStorage
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error("Persistence error:", err);
});

// Firestore
const db = getFirestore(app);

// ✅ Initialize storage
const storage = getStorage(app);

export { auth, db, storage };
export default app;
