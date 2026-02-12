import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.loginFaculty = async function () {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  try {

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists() || snap.data().role !== "faculty") {
      error.innerText = "Not a faculty account";
      return;
    }

    localStorage.setItem("branch", snap.data().branch);

    window.location.href = "faculty-dashboard.html";

  } catch (err) {
    error.innerText = err.message;
  }
};
