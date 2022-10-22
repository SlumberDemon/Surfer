let searchButton = document.getElementById("sbutton");
let searchInput = document.getElementById("sbar")

searchButton.addEventListener("click", () => {
    searchButton.innerHTML = `<i class="fa fa-search"></i> Searching...`,
    window.location.href = `/search?query=${searchInput.value}`;
});

searchInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchButton.innerHTML = `<i class="fa fa-search"></i> Searching...`,
        window.location.href = `/search?query=${searchInput.value}`;
    }
});