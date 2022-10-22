let searchButton = document.getElementById("sbutton");

searchButton.addEventListener("click", () => {
    let text = document.getElementById("sbar")
    window.location.href = `/search?query=${text.value}`;
});