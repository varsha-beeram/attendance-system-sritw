import { db, auth } from "./firebase.js";
import { collection, query, where, getDocs }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { signOut }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* =============================
   LOGOUT
============================= */

window.logout = function(){
signOut(auth);
window.location.href="index.html";
};


/* =============================
   DOWNLOAD ATTENDANCE
============================= */

window.downloadAttendance = async function(){

const branch = document.getElementById("branch").value;
const section = document.getElementById("section").value;
const type = document.getElementById("downloadType").value;
const date = document.getElementById("dateInput").value;
const period = document.getElementById("periodInput").value;
const month = document.getElementById("monthInput").value;

if(!branch || !section){
alert("Select branch and section");
return;
}

if(!type){
alert("Select download type");
return;
}

let data = [];

/* =============================
   PERIOD WISE
============================= */

if(type === "period"){

if(!date || !period){
alert("Select date and period");
return;
}

const q = query(
collection(db,"attendanceDetails"),
where("date","==",date),
where("period","==",Number(period))
);

const snapshot = await getDocs(q);

snapshot.forEach(docSnap=>{
const d = docSnap.data();

if(d.branch === branch && d.section === section){

data.push({
Date:d.date,
Period:"P"+d.period,
Roll:d.roll || d.studentId,
Status:d.present ? "Present" : "Absent"
});

}
});

if(data.length===0){
alert("No attendance found");
return;
}

}


/* =============================
   DATE WISE (ALL PERIODS)
============================= */

if(type === "date"){

if(!date){
alert("Select date");
return;
}

const q = query(
collection(db,"attendanceDetails"),
where("date","==",date)
);

const snapshot = await getDocs(q);

snapshot.forEach(docSnap=>{
const d = docSnap.data();

if(d.branch === branch && d.section === section){

data.push({
Date:d.date,
Period:"P"+d.period,
Roll:d.roll || d.studentId,
Status:d.present ? "Present" : "Absent"
});

}
});

if(data.length===0){
alert("No attendance found");
return;
}

}


/* =============================
   MONTHLY
============================= */

if(type === "month"){

if(!month){
alert("Select month");
return;
}

const q = query(collection(db,"attendanceDetails"));
const snapshot = await getDocs(q);

snapshot.forEach(docSnap=>{
const d = docSnap.data();

if(d.branch === branch &&
   d.section === section &&
   d.date.startsWith(month)){

data.push({
Date:d.date,
Period:"P"+d.period,
Roll:d.roll || d.studentId,
Status:d.present ? "Present" : "Absent"
});

}
});

if(data.length===0){
alert("No attendance found for month");
return;
}

}


/* =============================
   EXPORT EXCEL
============================= */

const ws = XLSX.utils.json_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Attendance");

XLSX.writeFile(wb, branch+"_"+section+"_Attendance.xlsx");

};



/* =============================
   BELOW 75% REPORT
============================= */

window.downloadBelow75 = async function(){

const branch = document.getElementById("branch").value;
const section = document.getElementById("section").value;

if(!branch || !section){
alert("Select branch and section");
return;
}

const q = query(
collection(db,"students"),
where("branch","==",branch),
where("section","==",section)
);

const snapshot = await getDocs(q);

let data = [];

snapshot.forEach(docSnap=>{

const s = docSnap.data();
const total = s.totalClasses || 0;
const attended = s.attendedClasses || 0;

const percent = total===0 ? 0 : (attended/total)*100;

if(percent < 75){

data.push({
Roll:s.roll,
Name:s.name,
Attended:attended,
Total:total,
Percentage:percent.toFixed(2)+"%"
});

}

});

if(data.length===0){
alert("No students below 75%");
return;
}

const ws = XLSX.utils.json_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Below 75%");

XLSX.writeFile(wb, branch+"_"+section+"_Below_75.xlsx");

};
