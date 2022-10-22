let searchButton = document.getElementById("sbutton");

searchButton.addEventListener("click", () => {
    let text = document.getElementById("sbar")
    searchButton.innerHTML = `<i class="fa fa-search"></i> Searching...`,
    window.location.href = `/search?query=${text.value}`;
});