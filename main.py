from deta import Base
from duckduckgo_search import ddg
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"])
pages = Jinja2Templates(directory="templates")

history = Base("history")
bookmarks = Base("bookmarks")


class NoCacheFileResponse(FileResponse):
    def __init__(self, path: str, **kwargs):
        super().__init__(path, **kwargs)
        self.headers["Cache-Control"] = "no-cache"


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return pages.TemplateResponse(
        "index.html",
        {"request": request},
    )


@app.get("/search", response_class=HTMLResponse)
async def search_results(request: Request, query: str, results: int = 50):
    if query != None:
        history.put({"query": query})  # Maybe also add time
        results = ddg(query, safesearch="Moderate", max_results=results)
        return pages.TemplateResponse(
            "search.html", {"request": request, "items": results}
        )
    else:
        return {"message": "404"}


@app.post("/bookmark")  # Make into post  but fix script.js first
async def bookmark_results(title: str, description: str, url: str):
    bookmarks.put({"title": title, "description": [description], "url": url})
    return {"message": "success"}


@app.get("/history")
async def history_page(request: Request):
    res = history.fetch()
    items = res.items
    while res.last:
        res = history.fetch(last=res.last)
        items += res.items
    return pages.TemplateResponse("history.html", {"request": request, "items": items})


@app.get("/bookmarks")
async def bookmarks_page(request: Request):
    res = bookmarks.fetch()
    items = res.items
    while res.last:
        res = bookmarks.fetch(last=res.last)
        items += res.items
    return pages.TemplateResponse(
        "bookmarks.html", {"request": request, "items": items}
    )


@app.get("/static/{path:path}")
async def static(path: str):
    return NoCacheFileResponse(f"./static/{path}")
