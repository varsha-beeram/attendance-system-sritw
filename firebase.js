import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDBOLyFEDX-scCuoM72I91JDBr7UtjKF5Y",
  authDomain: "attendance-system-76110.firebaseapp.com",
  projectId: "attendance-system-76110",
  storageBucket: "attendance-system-76110.firebasestorage.app",
  messagingSenderId: "373268780149",
  appId: "1:373268780149:web:47a9f787f19cdc31f6543c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
