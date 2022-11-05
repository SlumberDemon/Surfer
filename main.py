from deta import Base
from datetime import datetime
from fastapi import FastAPI, Request
from duckduckgo_search import ddg, ddg_images
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"])
pages = Jinja2Templates(directory="templates")

config = Base("config")
history = Base("history")
bookmarks = Base("bookmarks")


class NoCacheFileResponse(FileResponse):
    def __init__(self, path: str, **kwargs):
        super().__init__(path, **kwargs)
        self.headers["Cache-Control"] = "no-cache"


async def settings_check():
    data = config.get("settings")
    if not data:
        data = config.put(
            {
                "settings": [
                    {"theme": "ocean-blue", "search": "Moderate", "history": True}
                ]
            },
            "settings",
        )
    return data


async def integrations_check():
    data = config.get("integrations")
    if not data:
        config.put({"settings": [{"blackhole": ""}]}, "integrations")
    return data


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return pages.TemplateResponse(
        "index.html",
        {"request": request, "settings": await settings_check()},
    )


@app.get("/image", response_class=HTMLResponse)
async def image_results(request: Request, query: str, results: int = 25):
    data = await settings_check()
    time = datetime.now()
    try:
        if data["settings"][0]["history"] == True:
            history.put(
                {
                    "query": query,
                    "time": f"{time.strftime('%A')}, {time.strftime('%B')} {time.strftime('%-d')}, {time.strftime('%Y')} {time.strftime('%-H')}:{time.strftime('%M')}:{time.strftime('%S')} {time.strftime('%p')}",
                }
            )
        results = ddg_images(
            query, safesearch=data["settings"][0]["search"], max_results=results
        )
        id = 1
        items = []
        for item in results:
            items.append(
                {
                    "title": item["title"],
                    "image": item["image"],
                    "thumbnail": item["thumbnail"],
                    "height": item["height"],
                    "width": item["width"],
                    "source": item["source"],
                    "id": id,
                }
            )
            id += 1
        return pages.TemplateResponse(
            "image.html",
            {"request": request, "items": items, "query": query, "settings": data},
        )
    except:
        pass


@app.get("/search", response_class=HTMLResponse)
async def search_results(request: Request, query: str, results: int = 50):
    data = await settings_check()
    time = datetime.now()
    try:
        if data["settings"][0]["history"] == True:
            history.put(
                {
                    "query": query,
                    "time": f"{time.strftime('%A')}, {time.strftime('%B')} {time.strftime('%-d')}, {time.strftime('%Y')} {time.strftime('%-H')}:{time.strftime('%M')}:{time.strftime('%S')} {time.strftime('%p')}",
                }
            )
        results = ddg(
            query, safesearch=data["settings"][0]["search"], max_results=results
        )
        id = 1
        items = []
        for item in results:
            items.append(
                {
                    "title": item["title"],
                    "body": item["body"],
                    "href": item["href"],
                    "id": id,
                }
            )
            id += 1
        return pages.TemplateResponse(
            "search.html",
            {"request": request, "items": items, "query": query, "settings": data},
        )
    except:
        return {"message": "An error occurred"}


@app.post("/bookmark")
async def bookmark_add_site(title: str, content: str, url: str, typ: str):
    bookmarks.put({"title": title, "content": [content], "url": url, "type": typ})
    return {"message": "success"}


@app.delete("/bookmark")
async def bookmark_remove(id: str):
    bookmarks.delete(id)
    return {"message": "success"}


@app.get("/bookmarks")
async def bookmarks_page(request: Request, typ: str):
    res = bookmarks.fetch()
    items = res.items
    while res.last:
        res = bookmarks.fetch(last=res.last)
        items += res.items
    list = []
    for item in items:
        if item["type"] == typ:
            list.append(item)

    return pages.TemplateResponse(
        f"bookmarks-{typ}.html",
        {"request": request, "items": list, "settings": await settings_check()},
    )


@app.delete("/history")
async def history_remove(id: str):
    history.delete(id)
    return {"message": "success"}


@app.get("/history")
async def history_page(request: Request):
    res = history.fetch()
    items = res.items
    while res.last:
        res = history.fetch(last=res.last)
        items += res.items
    return pages.TemplateResponse(
        "history.html",
        {"request": request, "items": items, "settings": await settings_check()},
    )


@app.get("/settings")
async def settings_page(request: Request):
    return pages.TemplateResponse(
        "settings.html",
        {
            "request": request,
            "settings": await settings_check(),
            "integrations": await integrations_check(),
        },
    )


@app.patch("/settings")
async def settings_update(theme: str = None, search: str = None, history: bool = None):
    data = config.get("settings")
    if theme == None:
        theme = data["settings"][0]["theme"]
    else:
        theme = theme
    if search == None:
        search = data["settings"][0]["search"]
    else:
        search = search
    if history == None:
        history = data["settings"][0]["history"]
    else:
        history = history
    config.put(
        {"settings": [{"theme": theme, "search": search, "history": history}]},
        "settings",
    )
    return {"message": "success"}


@app.delete("/settings")
async def settings_delete(type: str):
    # Type: bookmarks/history
    base = Base(type)
    res = base.fetch()
    items = res.items
    while res.last:
        res = bookmarks.fetch(last=res.last)
        items += res.items

    for i in items:
        base.delete(i["key"])
    return {"message": "success"}


@app.get("/settings/data")
async def settings_data():
    data = config.get("settings")
    return data


# New integration system currently only supports one app, once more apps will be integrated this system will be improved and expaneded!


@app.post("/integration/blackhole")
async def blackhole_integration(url: str):
    config.put({"settings": [{"blackhole": url}]}, "integrations")
    return {"message": "success"}


@app.get("/integration/blackhole")
async def blackhole_integration():
    data = config.get("integrations")
    return data


@app.get("/static/{path:path}")
async def static(path: str):
    return NoCacheFileResponse(f"./static/{path}")
