let deleteButtons = document.getElementsByClassName("remove-button");
let searchButton = document.getElementsByClassName("search-button");

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}


searchButton.addEventListener("click", () => {
    let query = document.getElementById("card-title")
    searchButton.innerHTML = `<i class="fa fa-search"></i> Searching...`,
    window.location.href = `/search?query=${query.innerHTML}`;
});

for (let button of deleteButtons) {
    button.addEventListener("click", () => {
        fetch(`/history?id=${button.id}`, { method: "DELETE" }).then(() => {
            button.innerHTML = `<i class="fa fa-check"></i>`
            delay(250).then(() => {
                location.reload()
            })
            });
    });
}