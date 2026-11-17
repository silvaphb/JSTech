from ninja import NinjaAPI
from returned.views import app_router

api = NinjaAPI(
    title='JS TECH'
)

api.add_router('codes/', app_router, tags=['JEFFERSON'])