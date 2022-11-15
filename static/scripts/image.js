let blackHoleButtons = document.getElementsByClassName("blackhole-button");
let imageButtons = document.getElementsByClassName("image-button");

let checkicon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
let bookmarkicon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bookmark"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`;
  
for (let button of imageButtons) {
    button.addEventListener("click", () => {
      let title = document.getElementById(`${button.id.split("~")[0]}ctitle`)
      fetch(`/bookmark?title=${title.innerHTML}&content=${button.id.split("~")[1]}&url=${button.id.split("~")[1]}&typ=image`, { method: "POST" })
      .then(() => {
        button.innerHTML = checkicon
      }).then(() => {
        setTimeout(() => {
          button.innerHTML = bookmarkicon
        }, 250)
      })
    })
  }

for (let button of blackHoleButtons) {
    fetch(`/integration/blackhole`)
    .then(response => response.json())
    .then(data => {
            button.addEventListener("click", () => {
                button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Uploading...`
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
                       button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> Black Hole`
                    }, 550);
                });
            }
            else {
                alert("Please make sure to configure Black Hole Integration in your settings!")
            }
            });
    })
}