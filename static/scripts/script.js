let saveButtons = document.getElementsByClassName("save-button");
let searchButton = document.getElementById("sbutton");

searchButton.addEventListener("click", () => {
    let text = document.getElementById("sbar")
    console.log(text.value)
    window.location.href = `/search?query=${text.value}`;
});

for (let button of saveButtons) {
    button.addEventListener("click", () => {
        let title = document.getElementById("card-title")
        let description = document.getElementById("card-summary")
        fetch(`/bookmark?title=${title.innerHTML}&description=${description.innerHTML}&url=${button.id}`, { method: "POST" })
        .then(() => {
                alert("Website added to bookmarks!");
            });
            }    
    );
}