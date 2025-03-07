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


const attendance = JSON.parse(document.querySelector('#hidden').innerText)
console.log(attendance)


const datesSelectELe = document.querySelector('#dates')
function populateDates(){
    const dates = Object.keys(attendance)
    let optionsEle = ''
    dates.forEach(date => {
        optionsEle += `<option value=${date}> ${date} </option>`        
    });
    datesSelectELe.innerHTML = optionsEle
    displayDateData(dates[0])
}

function displayDateData(event){
    const date = typeof event === 'string'? event : event.target.value
    console.log(date)
    let studentsHTML = ''
    const studentsDataList = attendance[date]
    studentsDataList.forEach(each_student=>{
        studentsHTML += `
        <div class="student-info">
            <img src="../imgs/user.jpg">
            <div class="student-data">
                <div class="texts">
                    <p>Name: ${each_student.name} &nbsp;</p>
                    <p>Matric No: ${each_student.matric_no}</p>
                </div>
            </div>
            
            <div class="times-attended">
                <p>Times attended: 1</p>
            </div>

            <div class="status">
                <p>P</p>
                <p>Present</p>
            </div>

        </div>
        `
    })
    document.querySelector('#some-date-data').innerHTML=studentsHTML
}
populateDates()
datesSelectELe.addEventListener('change',displayDateData)
