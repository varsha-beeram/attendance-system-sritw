import { db } from "./firebase.js";
import { collection, addDoc } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.addStudent = async function () {

  const name = document.getElementById("name").value;
  const roll = document.getElementById("roll").value;
  const section = document.getElementById("section").value;
  const msg = document.getElementById("msg");

  const branch = localStorage.getItem("branch");

  if (!branch) {
    alert("Admin branch not found. Please login again.");
    window.location.href = "login.html";
    return;
  }

  try {

    await addDoc(collection(db, "students"), {
      name: name,
      roll: roll,
      branch: branch,
      section: section.toUpperCase(),
      totalClasses: 0,
      attendedClasses: 0
    });

    msg.innerText = "Student added successfully!";
    msg.style.color = "green";

    document.getElementById("name").value = "";
    document.getElementById("roll").value = "";
    document.getElementById("section").value = "";

  } catch (error) {
    msg.innerText = error.message;
    msg.style.color = "red";
  }
};
