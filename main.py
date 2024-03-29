import warnings
from deta import Base
from hanapin import Google
from datetime import datetime
from BingImages import BingImages
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse, RedirectResponse

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"])
pages = Jinja2Templates(directory="templates")

config = Base("config")
history = Base("history")
bookmarks = Base("bookmarks")
integrations = Base("integrations")


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


async def integrations_check(integration: str):
    data = integrations.get(integration)
    if not data:
        data = integrations.put({"data": [{"integration": integration}]}, integration)
    return data


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return pages.TemplateResponse(
        "index.html",
        {"request": request, "settings": await settings_check()},
    )


@app.get("/image", response_class=HTMLResponse)
async def image_results(request: Request, query: str, limit: int = 25):
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
        results = BingImages(query, count=limit).get()
        id = 1
        items = []
        for item in results:
            items.append(
                {
                    "title": item,
                    "image": item,
                    "thumbnail": item,
                    # "height": item["height"], Deprecated
                    # "width": item["width"], Deprecated
                    # "source": item["source"], Deprecated
                    "id": id,
                }
            )
            id += 1
        return pages.TemplateResponse(
            "image.html",
            {"request": request, "items": items, "query": query, "settings": data},
        )
    except Exception as e:
        warnings.warn(e)
        return JSONResponse(
            content={"message": "An error occurred", "error": e},
        )


@app.get("/search", response_class=HTMLResponse)
async def search_results(request: Request, query: str, limit: int = 50):
    data = await settings_check()
    if query.startswith(">surf:home"):
        return RedirectResponse("/")
    elif query.startswith(">surf:history"):
        return RedirectResponse("/history")
    elif query.startswith(">surf:bookmarks"):
        return RedirectResponse("/bookmarks?typ=site")
    elif query.startswith(">surf:settings"):
        return RedirectResponse("/settings")
    elif query.startswith(">surf:image"):
        return RedirectResponse(f"/image?query={query.removeprefix('>surf:image')}")
    else:
        time = datetime.now()
        try:
            if data["settings"][0]["history"] == True:
                history.put(
                    {
                        "query": query,
                        "time": f"{time.strftime('%A')}, {time.strftime('%B')} {time.strftime('%-d')}, {time.strftime('%Y')} {time.strftime('%-H')}:{time.strftime('%M')}:{time.strftime('%S')} {time.strftime('%p')}",
                    }
                )
            results = Google(query, count=limit).results()
            id = 1
            items = []
            for item in results:
                items.append(
                    {
                        "title": item["title"],
                        # "body": item["body"], Deprecated
                        "href": item["link"],
                        "id": id,
                    }
                )
                id += 1
            return pages.TemplateResponse(
                "search.html",
                {"request": request, "items": items, "query": query, "settings": data},
            )
        except Exception as e:
            warnings.warn(e)
            return JSONResponse(
                content={"message": "An error occurred", "error": e},
            )


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
            "blackhole": await integrations_check("blackhole"),
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


@app.post("/integration/{integration}")
async def integration_configure(integration: str, url: str):
    integrations.put({"data": [{"integration": integration, "url": url}]}, integration)
    return {"message": "success"}


@app.get("/integration/{integration}")
async def integration_data(integration: str):
    data = integrations.get(integration)
    return data


@app.get("/api/search/image")
async def api_search_image(query: str, results: int = 25):
    data = await settings_check()
    time = datetime.now()
    if data["settings"][0]["history"] == True:
        history.put(
            {
                "query": query,
                "time": f"{time.strftime('%A')}, {time.strftime('%B')} {time.strftime('%-d')}, {time.strftime('%Y')} {time.strftime('%-H')}:{time.strftime('%M')}:{time.strftime('%S')} {time.strftime('%p')}",
            }
        )
    results = BingImages(query, count=results).get()
    id = 1
    items = []
    for item in results:
        items.append(
            {
                "title": item,
                "image": item,
                "thumbnail": item,
                # "height": item["height"], Deprecated
                # "width": item["width"], Deprecated
                # "source": item["source"], Deprecated
                "id": id,
            }
        )
        id += 1
    return {"items": items, "query": query, "settings": data}


@app.get("/api/search/text")
async def api_search_text(query: str, limit: int = 50):
    data = await settings_check()
    time = datetime.now()
    if data["settings"][0]["history"] == True:
        history.put(
            {
                "query": query,
                "time": f"{time.strftime('%A')}, {time.strftime('%B')} {time.strftime('%-d')}, {time.strftime('%Y')} {time.strftime('%-H')}:{time.strftime('%M')}:{time.strftime('%S')} {time.strftime('%p')}",
            }
        )
    results = Google(query, count=limit).results()
    id = 1
    items = []
    for item in results:
        items.append(
            {
                "title": item["title"],
                "href": item["link"],
                "id": id,
            }
        )
        id += 1
    return {"items": items, "query": query, "settings": data}


# Automatic


@app.post("/__space/v0/actions")
async def actions(request: Request):
    data = await request.json()
    event = data["event"]
    if event["id"] == "history":
        res = history.fetch()
        items = res.items
        while res.last:
            res = history.fetch(last=res.last)
            items += res.items

        for item in items:
            history.delete(item["key"])


@app.get("/static/{path:path}")
async def static(path: str):
    return NoCacheFileResponse(f"./static/{path}")
