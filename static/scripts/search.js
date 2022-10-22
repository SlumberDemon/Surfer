let saveButtons = document.getElementsByClassName("save-button");

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