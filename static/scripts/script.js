let searchButton = document.getElementById("sbutton");
let imageButton = document.getElementById("ibutton")
let searchInput = document.getElementById("sbar")

searchButton.addEventListener("click", () => {
    searchButton.innerHTML = `<i class="fa fa-eye"></i>`,
    window.location.href = `/search?query=${searchInput.value}`;
});

imageButton.addEventListener("click", () => {
    imageButton.innerHTML = `<i class="fa fa-eye"></i>`,
    window.location.href = `/image?query=${searchInput.value}`;
});

searchInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchButton.innerHTML = `<i class="fa fa-eye"></i>`,
        window.location.href = `/search?query=${searchInput.value}`;
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