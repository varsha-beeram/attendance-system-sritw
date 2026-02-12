import { auth, db } from "./firebase.js";
import { doc, getDoc, collection, query, where, getDocs }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

auth.onAuthStateChanged(async (user) => {

if(!user){
window.location.href = "index.html";
return;
}

const userDoc = await getDoc(doc(db,"users",user.uid));

if(!userDoc.exists()){
alert("User not found");
return;
}

const studentData = userDoc.data();
const roll = studentData.roll;

const attendanceQuery = query(
collection(db,"attendance"),
where("roll","==",roll)
);

const snapshot = await getDocs(attendanceQuery);

let total = 0;
let present = 0;

const table = document.getElementById("attendanceTable");

snapshot.forEach(doc => {

const data = doc.data();
total++;

if(data.status === "Present") present++;

table.innerHTML += `
<tr>
<td>${data.date}</td>
<td>${data.period}</td>
<td>${data.status}</td>
</tr>
`;

});

const absent = total - present;
const percentage = total === 0 ? 0 : ((present/total)*100).toFixed(2);

document.getElementById("total").innerText = total;
document.getElementById("present").innerText = present;
document.getElementById("absent").innerText = absent;
document.getElementById("percentage").innerText = percentage + "%";

document.getElementById("progressBar").style.width = percentage + "%";

new Chart(document.getElementById("attendanceChart"),{
type:"pie",
data:{
labels:["Present","Absent"],
datasets:[{
data:[present,absent],
backgroundColor:["#2563eb","#ef4444"]
}]
}
});

});
