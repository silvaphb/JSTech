from django.http import HttpRequest
from ninja import Router, Schema
from pydantic import Field, HttpUrl

from script.main import Constructor

app_router = Router()
MAX_ITEMS = 50


class AuthorInput(Schema):
    name: str = Field(min_length=1, max_length=80)
    username: str = Field(min_length=1, max_length=30)
    profile_photo_url: HttpUrl


class AccountInput(Schema):
    username: str = Field(min_length=1, max_length=30)
    profile_photo_url: HttpUrl


class PostInput(Schema):
    username: str = Field(min_length=1, max_length=30)
    profile_photo_url: HttpUrl
    location: str = Field(default="", max_length=100)
    image_url: HttpUrl
    likes: str = Field(min_length=1, max_length=30)
    caption: str = Field(default="", max_length=2000)
    comments_count: int = Field(ge=0, le=1_000_000)
    time_ago: str = Field(min_length=1, max_length=50)


class GenerateInput(Schema):
    autor: AuthorInput
    contas: list[AccountInput] = Field(max_length=MAX_ITEMS)
    posts: list[PostInput] = Field(max_length=MAX_ITEMS)


@app_router.post("/generate", response={200: dict})
def generate_code(request: HttpRequest, payload: GenerateInput):
    data = payload.model_dump(mode="json")
    return 200, {
        "code": Constructor.generate_instagram_html(
            data["autor"], data["contas"], data["posts"]
        )
    }


@app_router.get("/getcode", response={200: dict})
def getcode(request: HttpRequest, autor: str, contas: int, posts: int):
    if not autor.strip() or len(autor) > 80:
        raise Exception("O autor deve ter entre 1 e 80 caracteres.")
    if not 0 <= contas <= MAX_ITEMS or not 0 <= posts <= MAX_ITEMS:
        raise Exception(f"Contas e posts devem estar entre 0 e {MAX_ITEMS}.")

    return 200, {
        "code": Constructor.return_html_code_of_fake_instagram(autor, contas, posts)
    }
