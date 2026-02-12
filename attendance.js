import { db } from "./firebase.js";
import { collection, query, where, getDocs, doc, setDoc, updateDoc } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let loadedStudents = [];

window.loadStudents = async function () {

  const branch = localStorage.getItem("branch");
  const section = document.getElementById("section").value.toUpperCase();
  const studentsDiv = document.getElementById("students");

  studentsDiv.innerHTML = "";

  const q = query(
    collection(db, "students"),
    where("branch", "==", branch),
    where("section", "==", section)
  );

  const querySnapshot = await getDocs(q);

  loadedStudents = [];

  querySnapshot.forEach((docSnap) => {
    loadedStudents.push({
      id: docSnap.id,
      ...docSnap.data()
    });

    studentsDiv.innerHTML += `
      <div>
        <input type="checkbox" id="${docSnap.id}">
        ${docSnap.data().roll} - ${docSnap.data().name}
      </div>
    `;
  });
};

window.saveAttendance = async function () {

  const branch = localStorage.getItem("branch");
  const section = document.getElementById("section").value.toUpperCase();
  const period = document.getElementById("period").value;
  const msg = document.getElementById("msg");

  const today = new Date().toISOString().split("T")[0];

  const docId = `${today}_${branch}_${section}_${period}`;

  let attendanceData = {};

  for (let student of loadedStudents) {

    const isPresent = document.getElementById(student.id).checked;

    attendanceData[student.id] = isPresent;

    await updateDoc(doc(db, "students", student.id), {
      totalClasses: student.totalClasses + 1,
      attendedClasses: student.attendedClasses + (isPresent ? 1 : 0)
    });
  }

  await setDoc(doc(db, "attendance", docId), attendanceData);

  msg.innerText = "Attendance saved successfully!";
  msg.style.color = "green";
};
