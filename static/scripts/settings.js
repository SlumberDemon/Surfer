let bookmarkButton = document.getElementById("clear-bookmarks-button")
let visibilityToggle = document.getElementById("history-mode-toggle")
let historyButton = document.getElementById("clear-history-button")
let blackHoleIntegration = document.getElementById("ibar")
let resetButton = document.getElementById("sreset")
let saveButton = document.getElementById("ssave")



function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

saveButton.addEventListener("click", () => {
    let theme = document.getElementById("themes")
    let search = document.getElementById("safesearch")
    fetch(`/settings?theme=${theme.value}&search=${search.value}`, { method: "PATCH" }).then(() => {
        fetch(`/integration/blackhole?url=${blackHoleIntegration.value}`, { method: "POST" }).then(() => {
            saveButton.innerHTML = `<i class="fa fa-check"></i>`
            delay(250).then(() => {
                saveButton.innerHTML = `<i class="fa fa-save"></i> Save`
                location.reload()
            })
        })
        });
})

resetButton.addEventListener("click", () => {
    fetch(`/settings?theme=ocean-blue&search=Moderate&history=${true}`, { method: "PATCH" }).then(() => {
        fetch(`/integration/blackhole?url=`, { method: "POST" }).then(() => {
            resetButton.innerHTML = `<i class="fa fa-check"></i>`
            delay(250).then(() => {
                resetButton.innerHTML = `<i class="fa fa-remove"></i> Reset`
                location.reload()
            })
        })
        });
})

visibilityToggle.addEventListener("click", () => {
    fetch(`/settings/data`)
        .then((res) => res.json())
        .then((data) => {
            if (data["settings"][0]["history"] == false) {
                fetch(`/settings?history=${true}`, { method: "PATCH" })
                    .then(() => {
                        visibilityToggle.innerHTML = `<i class="fa fa-history"></i> True`
                    });
            } else {
                fetch(`/settings?history=${false}`, { method: "PATCH" })
                    .then(() => {
                        visibilityToggle.innerHTML = `<i class="fa fa-history"></i> False`
                    });
            }
        })
})

historyButton.addEventListener("click", () => {
    fetch(`/settings?type=history`, { method: "DELETE" }).then(() => {
        historyButton.innerHTML = `<i class="fa fa-check"></i>`
        delay(250).then(() => {
            historyButton.innerHTML = `<i class="fa fa-trash"></i> History`
    });
})
})

bookmarkButton.addEventListener("click", () => {
    fetch(`/settings?type=bookmarks`, { method: "DELETE" }).then(() => {
        bookmarkButton.innerHTML = `<i class="fa fa-check"></i>`
        delay(250).then(() => {
            bookmarkButton.innerHTML = `<i class="fa fa-trash"></i> Bookmarks`
    });
})
})