let deleteButtons = document.getElementsByClassName("remove-button");
let shareButtons = document.getElementsByClassName("share-button");
let selectMenu = document.getElementById("booktype")

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

for (let button of deleteButtons) {
button.addEventListener("click", () => {
    fetch(`/bookmark?id=${button.id}`, { method: "DELETE" }).then(() => {
        button.innerHTML = `<i class="fa fa-check"></i>`
        delay(250).then(() => {
            location.reload()
        })
        });
});
}

for (let button of shareButtons) {
    button.addEventListener("click", () => {
        navigator.clipboard.writeText(button.id)
            .then(() => {
                button.innerHTML = `<i class="fa fa-check"></i>`
            delay(500).then(() => {
                button.innerHTML = `<i class="fa fa-share-alt"></i>`
            })
            });
        });
}

selectMenu.addEventListener("click", () => {
    window.location.href = `/bookmarks?typ=image`;
})