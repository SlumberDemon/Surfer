let imageButtons = document.getElementsByClassName("image-button");

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
  
for (let button of imageButtons) {
    button.addEventListener("click", () => {
      let title = document.getElementById(`${button.id.split("~")[0]}ctitle`)
      fetch(`/bookmark?title=${title.innerHTML}&content=${button.id.split("~")[1]}&url=${button.id.split("~")[1]}&typ=image`, { method: "POST" })
      .then(() => {
        button.innerHTML = `<i class="fa fa-check"></i>`
        delay(500).then(() => {
          button.innerHTML = `<i class="fa fa-bookmark"></i>`
        })
      })
    })
  }