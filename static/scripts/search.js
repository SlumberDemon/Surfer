let saveButtons = document.getElementsByClassName("save-button");

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
  

for (let button of saveButtons) {
    button.addEventListener("click", () => {
        let title = document.getElementById("card-title")
        let description = document.getElementById("card-summary")
        fetch(`/bookmark?title=${title.innerHTML}&description=${description.innerHTML}&url=${button.id}`, { method: "POST" })
        .then(() => {
            button.innerHTML = `<i class="fa fa-check"></i>`
            delay(500).then(() => {
                button.innerHTML = `<i class="fa fa-bookmark"></i>`
            })
            });
            }    
    );
}