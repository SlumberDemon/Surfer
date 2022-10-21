from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse, Response

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"])
pages = Jinja2Templates(directory="templates")


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
async def search_results(request: Request, query: str):
    # do search stuff here
    results = {"dict with data"}
    return pages.TemplateResponse(
        "search.html",
        {"request": request, "results": results},
    )


@app.get("/static/{path:path}")
async def static(path: str):
    return NoCacheFileResponse(f"./static/{path}")
