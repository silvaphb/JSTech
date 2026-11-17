from ninja import Router
from script.main import Constructor

app_router = Router()

@app_router.get('/getcode', response={200: dict})
def getcode(request, autor: str, contas: int, posts: int):
    response = {
        'code': Constructor.return_html_code_of_fake_instagram(autor, contas, posts)
    }
    return 200, response