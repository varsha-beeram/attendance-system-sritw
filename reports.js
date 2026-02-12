import { db, auth } from "./firebase.js";
import { collection, query, where, getDocs, doc, getDoc, updateDoc }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { signOut }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

window.logout = function(){
signOut(auth);
window.location.href="index.html";
};

let correctionMode = false;
let currentDocs = [];

/* LOAD ATTENDANCE */
window.loadAttendance = async function(){

const branch = document.getElementById("branch").value;
const date = document.getElementById("selectedDate").value;
const period = document.getElementById("period").value;

const attendanceCard = document.getElementById("attendanceCard");
const tableBody = document.querySelector("#attendanceTable tbody");

attendanceCard.classList.add("hidden");
tableBody.innerHTML="";
currentDocs=[];

if(!branch || !date || !period){
alert("Select branch, date and period");
return;
}

const attendanceId = date + "_" + branch + "_P" + period;
const headerDoc = await getDoc(doc(db,"attendanceRecords",attendanceId));

if(!headerDoc.exists()){
alert("No attendance found for selected date");
return;
}

const detailsQuery = query(
collection(db,"attendanceDetails"),
where("date","==",date),
where("period","==",Number(period))
);

const snapshot = await getDocs(detailsQuery);

snapshot.forEach(docSnap=>{
currentDocs.push({id:docSnap.id, ...docSnap.data()});
});

if(currentDocs.length === 0){
alert("No attendance records found");
return;
}

attendanceCard.classList.remove("hidden");

renderTable();
};

/* RENDER TABLE */
function renderTable(){

const tableBody = document.querySelector("#attendanceTable tbody");
tableBody.innerHTML="";

currentDocs.forEach(item=>{

tableBody.innerHTML += `
<tr>
<td>${item.studentId}</td>
<td>-</td>
<td>
${correctionMode
? `<input type="checkbox" data-id="${item.id}" ${item.present?"checked":""}>`
: item.present
? `<span class="status-present">Present</span>`
: `<span class="status-absent">Absent</span>`
}
</td>
</tr>
`;

});

}

/* CORRECTION MODE */
window.toggleCorrection = function(){
correctionMode = !correctionMode;
document.getElementById("saveBtn").classList.toggle("hidden");
renderTable();
};

/* SAVE CORRECTIONS */
window.saveCorrections = async function(){

const checkboxes = document.querySelectorAll("input[type='checkbox']");

for(const box of checkboxes){

const id = box.getAttribute("data-id");
const isPresent = box.checked;

await updateDoc(doc(db,"attendanceDetails",id),{
present: isPresent
});

}

alert("Corrections saved");
correctionMode=false;
document.getElementById("saveBtn").classList.add("hidden");
loadAttendance();
};

/* EXPORT DAILY */
window.exportDaily = function(){

if(currentDocs.length === 0){
alert("Load attendance first");
return;
}

let data=[];

currentDocs.forEach(item=>{
data.push({
StudentID:item.studentId,
Status:item.present ? "Present" : "Absent"
});
});

const ws = XLSX.utils.json_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Daily Attendance");

XLSX.writeFile(wb, "Daily_Attendance.xlsx");
};

/* FULL REPORT */
window.downloadFullReport = async function(){

const branch = document.getElementById("branch").value;

if(!branch){
alert("Select branch first");
return;
}

const q = query(collection(db,"students"),where("branch","==",branch));
const snapshot = await getDocs(q);

let data=[];

snapshot.forEach(docSnap=>{
const s = docSnap.data();
const total = s.totalClasses||0;
const attended = s.attendedClasses||0;
const percent = total===0?0:((attended/total)*100).toFixed(2);

data.push({
Roll:s.roll,
Name:s.name,
Attended:attended,
Total:total,
Percentage:percent+"%"
});
});

const ws = XLSX.utils.json_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Full Report");
XLSX.writeFile(wb, branch+"_Full_Report.xlsx");
};

/* BELOW 75 */
window.downloadBelow75 = async function(){

const branch = document.getElementById("branch").value;

if(!branch){
alert("Select branch first");
return;
}

const q = query(collection(db,"students"),where("branch","==",branch));
const snapshot = await getDocs(q);

let data=[];

snapshot.forEach(docSnap=>{
const s = docSnap.data();
const total = s.totalClasses||0;
const attended = s.attendedClasses||0;
const percent = total===0?0:(attended/total)*100;

if(percent < 75){
data.push({
Roll:s.roll,
Name:s.name,
Percentage:percent.toFixed(2)+"%"
});
}
});

const ws = XLSX.utils.json_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Below 75%");
XLSX.writeFile(wb, branch+"_Below_75.xlsx");
};