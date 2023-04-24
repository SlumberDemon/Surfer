let bookmarkButton = document.getElementById("clear-bookmarks-button");
let visibilityToggle = document.getElementById("history-mode-toggle");
let historyButton = document.getElementById("clear-history-button");
let blackHoleIntegration = document.getElementById("ibar");
let resetButton = document.getElementById("sreset");
let saveButton = document.getElementById("ssave");

let checkicon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check" style="height: 20px; width: 20px;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
let clockicon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock" style="margin-right: 4px; height: 20px; width: 20px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
let trashicon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2" style="height: 20px; width: 20px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;

saveButton.addEventListener("click", () => {
  let theme = document.getElementById("themes");
  let search = document.getElementById("safesearch");
  saveButton.innerHTML = checkicon;
  fetch(`/settings?theme=${theme.value}&search=${search.value}`, {
    method: "PATCH",
  }).then(() => {
    fetch(`/integration/blackhole?url=${blackHoleIntegration.value}`, {
      method: "POST",
    }).then(() => {
      location.reload();
    });
  });
});

resetButton.addEventListener("click", () => {
  resetButton.innerHTML = checkicon;
  fetch(`/settings?theme=ocean-blue&search=Moderate&history=${true}`, {
    method: "PATCH",
  }).then(() => {
    fetch(`/integration/blackhole?url=`, { method: "POST" }).then(() => {
      location.reload();
    });
  });
});

visibilityToggle.addEventListener("click", () => {
  fetch(`/settings/data`)
    .then((res) => res.json())
    .then((data) => {
      if (data["settings"][0]["history"] == false) {
        fetch(`/settings?history=${true}`, { method: "PATCH" }).then(() => {
          visibilityToggle.innerHTML = `${clockicon} True`;
        });
      } else {
        fetch(`/settings?history=${false}`, { method: "PATCH" }).then(() => {
          visibilityToggle.innerHTML = `${clockicon} False`;
        });
      }
    });
});

historyButton.addEventListener("click", () => {
  fetch(`/settings?type=history`, { method: "DELETE" }).then(() => {
    historyButton.innerHTML = checkicon;
    setTimeout(() => {
      historyButton.innerHTML = `${trashicon} History`;
    }, 250);
  });
});

bookmarkButton.addEventListener("click", () => {
  fetch(`/settings?type=bookmarks`, { method: "DELETE" }).then(() => {
    bookmarkButton.innerHTML = checkicon;
    setTimeout(() => {
      bookmarkButton.innerHTML = `${trashicon} Bookmarks`;
    }, 250);
  });
});
