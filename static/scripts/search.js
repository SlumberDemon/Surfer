let saveButtons = document.getElementsByClassName("save-button");

let checkicon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check" style="height: 20px; width: 20px;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
let bookmarkicon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bookmark" style="height: 20px; width: 20px;"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`;

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

for (let button of saveButtons) {
  button.addEventListener("click", () => {
    let title = document.getElementById(`${button.id.split("~")[0]}ctitle`);
    let description = document.getElementById(
      `${button.id.split("~")[0]}csummary`
    );
    fetch(
      `/bookmark?title=${title.innerHTML}&content=${
        description.innerHTML
      }&url=${button.id.split("~")[1]}&typ=site`,
      { method: "POST" }
    )
      .then(() => {
        button.innerHTML = checkicon;
      })
      .then(() => {
        setTimeout(() => {
          button.innerHTML = bookmarkicon;
        }, 250);
      });
  });
}
