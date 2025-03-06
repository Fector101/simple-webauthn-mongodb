const markedTab = document.querySelector('#marked-tab')
const registerTab = document.querySelector('#reg-tab')
function toggleTabs(title){
    if(title==='Marked'){
        registerTab.classList.add('display-none')
        markedTab.classList.remove('display-none')
    }else if(title==='Registered'){
        markedTab.classList.add('display-none')
        registerTab.classList.remove('display-none')
    }

}
document.querySelector('.top-bar').addEventListener('click',function(event){
    const clicked_btn = event.target.closest('button')
    if(!clicked_btn){
        return
    }
    const other_btn = document.querySelector('button.active')
    other_btn.classList.remove('active')
    clicked_btn.classList.add('active')

    toggleTabs(clicked_btn.innerText)
})