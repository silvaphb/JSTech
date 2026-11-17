from django.conf import settings
from django.http import HttpResponse
from django.utils.cache import patch_vary_headers


class CorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        origin = request.headers.get("Origin")
        requested_method = request.headers.get("Access-Control-Request-Method")
        is_preflight = request.method == "OPTIONS" and requested_method

        if is_preflight:
            response = HttpResponse(status=200)
        else:
            response = self.get_response(request)

        if origin not in settings.CORS_ALLOWED_ORIGINS:
            return response

        response["Access-Control-Allow-Origin"] = origin
        if settings.CORS_ALLOW_CREDENTIALS:
            response["Access-Control-Allow-Credentials"] = "true"
        patch_vary_headers(response, ("Origin",))

        if is_preflight:
            response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
            response["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-CSRFToken"
            response["Access-Control-Max-Age"] = "600"

        return response
