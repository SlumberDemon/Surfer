let blackHoleButtons = document.getElementsByClassName("blackhole-button")
let deleteButtons = document.getElementsByClassName("remove-button");
let shareButtons = document.getElementsByClassName("share-button");

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

for (let button of blackHoleButtons) {
    fetch(`/integration/blackhole`)
    .then(response => response.json())
    .then(data => {
            button.addEventListener("click", () => {
                button.innerHTML = `<i class="fa fa-plus"></i> Uploading...`
                if (data.data[0].url) {
                fetch(`${data.data[0].url}`, {
                  method: "POST",
                  body: JSON.stringify({url: button.id}),
                  headers: {"content-type" :"application/json"},
                }).then(() => {
                    button.innerHTML = `<i class="fa fa-check"></i>`
                })
                .then(() => {
                    setTimeout(() => {
                       button.innerHTML = `<i class="fa fa-send"></i> Black Hole`
                    }, 550);
                });
            }
            else {
                alert("Please make sure to configure Black Hole Integration in your settings!")
            }
            });
    })
}