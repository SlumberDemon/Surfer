let imageButton = document.getElementById("ibutton")
let searchBar = document.getElementById("sbar")

imageButton.addEventListener("click", () => {
    imageButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-loader"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`,
    window.location.href = `/image?query=${searchBar.value}`;
});

searchBar.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        window.location.href = `/search?query=${searchBar.value}`;
    }
});


let item = document.body

document.addEventListener('keydown', event => {
    if (event.code === 'ArrowUp') {
    item.setAttribute("style", "filter: blur(5px);")
    searchInput.setAttribute("style", "filter: blur(0px);" )
    }
})

document.addEventListener('keydown', event => {
    if (event.code === 'ArrowDown') {
    item.setAttribute("style", "filter: blur(0px);")
    }
})