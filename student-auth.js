import { auth, db } from "./firebase.js";

import { signInWithEmailAndPassword, signOut }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { doc, getDoc }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.loginStudent = async function(){

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;
const error = document.getElementById("error");

error.innerText = "";

try{

// 🔥 SIGN IN
const userCredential = await signInWithEmailAndPassword(auth,email,password);
const user = userCredential.user;

// 🔥 CHECK IF STUDENT DOCUMENT EXISTS
const studentRef = doc(db,"students",user.uid);
const studentSnap = await getDoc(studentRef);

if(!studentSnap.exists()){

error.innerText = "Not a student account";
await signOut(auth);
return;

}

// ✅ SUCCESS → GO TO DASHBOARD
window.location.href = "student-dashboard.html";

}catch(err){

error.innerText = "Invalid Email or Password";

}

}
