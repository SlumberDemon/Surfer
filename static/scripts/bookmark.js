let blackHoleButtons = document.getElementsByClassName("blackhole-button")
let deleteButtons = document.getElementsByClassName("remove-button");
let shareButtons = document.getElementsByClassName("share-button");

let checkicon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
let shareicon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-share-2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`
let sendicon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`
let plusicon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`

for (let button of deleteButtons) {
button.addEventListener("click", () => {
    fetch(`/bookmark?id=${button.id}`, { method: "DELETE" }).then(() => {
        button.innerHTML = checkicon
        }).then(() => {
            setTimeout(() => {
                location.reload()
            }, 250);
        });
});
}

for (let button of shareButtons) {
    button.addEventListener("click", () => {
        navigator.clipboard.writeText(button.id)
            .then(() => {
                button.innerHTML = checkicon
            }).then(() => {
                setTimeout(() => {
                    button.innerHTML = shareicon
                }, 500);
            });
        });
}

for (let button of blackHoleButtons) {
    fetch(`/integration/blackhole`)
    .then(response => response.json())
    .then(data => {
            button.addEventListener("click", () => {
                button.innerHTML = `${plusicon} Uploading...`
                if (data.data[0].url) {
                fetch(`${data.data[0].url}`, {
                  method: "POST",
                  body: JSON.stringify({url: button.id}),
                  headers: {"content-type" :"application/json"},
                }).then(() => {
                    button.innerHTML = checkicon
                })
                .then(() => {
                    setTimeout(() => {
                       button.innerHTML = `${sendicon} Black Hole`
                    }, 500);
                });
            }
            else {
                alert("Please make sure to configure Black Hole Integration in your settings!")
            }
            });
    })
}