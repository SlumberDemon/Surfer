let searchButton = document.getElementById("sbutton");

searchButton.addEventListener("click", () => {
    let text = document.getElementById("sbar")
    console.log(text.value)
    window.location.href = `/search?query=${text.value}`;
});