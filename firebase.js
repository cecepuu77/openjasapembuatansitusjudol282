// ✅ Firebase Modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🔐 Konfigurasi Firebase Alvianz Store
const firebaseConfig = {
  apiKey: "AIzaSyCn7CiwINqT5JQZHJlKjTOLRMFu99HE9Sw",
  authDomain: "alvianz-panel.firebaseapp.com",
  databaseURL: "https://alvianz-panel-default-rtdb.firebaseio.com",
  projectId: "alvianz-panel",
  storageBucket: "alvianz-panel.appspot.com",
  messagingSenderId: "213485076946",
  appId: "1:213485076946:web:af953b3cfcc4f19400c80b"
};

// 🚀 Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// 🔐 Login Anonim Otomatis
signInAnonymously(auth).catch((error) => {
  console.error("Gagal login anonim:", error.message);
});

// ✅ Tersedia global
window.firebase = {
  auth,
  database: db
};