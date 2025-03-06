const markedTab = document.querySelector('#marked-tab')
const registerTab = document.querySelector('#reg-tab')
function toggleTabs(title) {
    if (title === 'Marked') {
        registerTab.classList.add('display-none')
        markedTab.classList.remove('display-none')
    } else if (title === 'Registered') {
        markedTab.classList.add('display-none')
        registerTab.classList.remove('display-none')
    }

}
document.querySelector('.top-bar').addEventListener('click', function (event) {
    const clicked_btn = event.target.closest('button')
    if (!clicked_btn) {
        return
    }
    const other_btn = document.querySelector('button.active')
    other_btn.classList.remove('active')
    clicked_btn.classList.add('active')

    toggleTabs(clicked_btn.innerText)
})






// document.addEventListener("DOMContentLoaded", async () => {
//     const regTab = document.getElementById("reg-tab");
//     const markedTab = document.getElementById("marked-tab");
//     const dateSelect = document.querySelector("select");

//     async function fetchStudents() {
//         const res = await fetch("/api/students");
//         const students = await res.json();

//         regTab.innerHTML = `<h3 class="align-center">Registered Students</h3>`;
//         students.forEach(student => {
//             regTab.innerHTML += `
//           <div class="student-info">
//             <img src="../imgs/user.jpg">
//             <div class="student-data">
//               <div class="texts">
//                 <p>Name: ${student.student_name} &nbsp;</p>
//                 <p>Matric No: ${student.matric_no}</p>
//               </div>
//               <div class="times-attended">
//                 <p>Times attended: 0</p>
//               </div>
//             </div>
//           </div>
//         `;
//         });
//     }

//     async function fetchAttendance(date) {
//         const res = await fetch(`/api/attendance?date=${date}`);
//         const { students } = await res.json();

//         markedTab.innerHTML = `<h3 class="align-center">Marked Students</h3>`;

//         if (students.length === 0) {
//             markedTab.innerHTML += `<p>No attendance records for this date.</p>`;
//             return;
//         }

//         for (const matric_no of students) {
//             const studentRes = await fetch(`/api/students`);
//             const studentList = await studentRes.json();
//             const student = studentList.find(s => s.matric_no === matric_no);

//             if (student) {
//                 markedTab.innerHTML += `
//             <div class="student-info">
//               <img src="../imgs/user.jpg">
//               <div class="student-data">
//                 <div class="texts">
//                   <p>Name: ${student.student_name} &nbsp;</p>
//                   <p>Matric No: ${student.matric_no}</p>
//                 </div>
//                 <div class="status">
//                   <p>P</p>
//                   <p>Present</p>
//                 </div>
//               </div>
//             </div>
//           `;
//             }
//         }
//     }

//     async function loadDates() {
//         const res = await fetch("/api/attendance");
//         const records = await res.json();

//         dateSelect.innerHTML = `<option value="">-- Select a Date --</option>`;
//         records.forEach(record => {
//             dateSelect.innerHTML += `<option value="${record.date}">${record.date}</option>`;
//         });

//         dateSelect.addEventListener("change", () => {
//             if (dateSelect.value) fetchAttendance(dateSelect.value);
//         });
//     }

//     await fetchStudents();
//     await loadDates();
// });
