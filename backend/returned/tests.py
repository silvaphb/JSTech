from django.test import SimpleTestCase


class GenerateCodeTests(SimpleTestCase):
    def setUp(self):
        self.payload = {
            "autor": {
                "name": "Ana Silva",
                "username": "ana",
                "profile_photo_url": "https://example.com/ana.jpg",
            },
            "contas": [
                {
                    "username": "amiga",
                    "profile_photo_url": "https://example.com/amiga.jpg",
                }
            ],
            "posts": [
                {
                    "username": "ana",
                    "profile_photo_url": "https://example.com/ana.jpg",
                    "location": "São Paulo",
                    "image_url": "https://example.com/post.jpg",
                    "likes": "1.234",
                    "caption": "Um dia especial",
                    "comments_count": 12,
                    "time_ago": "há 2 horas",
                }
            ],
        }

    def test_generate_includes_all_customized_details(self):
        response = self.client.post(
            "/api/v1/codes/generate",
            data=self.payload,
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        code = response.json()["code"]
        for value in (
            "Ana Silva",
            "ana",
            "amiga",
            "São Paulo",
            "https://example.com/post.jpg",
            "1.234 curtidas",
            "Um dia especial",
            "Ver todos os 12 comentários",
            "há 2 horas",
        ):
            self.assertIn(value, code)

    def test_generated_content_is_html_escaped(self):
        self.payload["posts"][0]["caption"] = '<script>alert("x")</script>'

        response = self.client.post(
            "/api/v1/codes/generate",
            data=self.payload,
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        code = response.json()["code"]
        self.assertNotIn("<script>alert", code)
        self.assertIn("&lt;script&gt;", code)

    def test_rejects_non_http_image_urls(self):
        self.payload["posts"][0]["image_url"] = "javascript:alert(1)"

        response = self.client.post(
            "/api/v1/codes/generate",
            data=self.payload,
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 422)

    def test_rejects_more_than_fifty_posts(self):
        self.payload["posts"] = self.payload["posts"] * 51

        response = self.client.post(
            "/api/v1/codes/generate",
            data=self.payload,
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 422)

    def test_allows_preflight_from_configured_frontend_origin(self):
        response = self.client.options(
            "/api/v1/codes/generate",
            HTTP_ORIGIN="http://localhost:5500",
            HTTP_ACCESS_CONTROL_REQUEST_METHOD="POST",
            HTTP_ACCESS_CONTROL_REQUEST_HEADERS="content-type",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response["Access-Control-Allow-Origin"], "http://localhost:5500"
        )
        self.assertIn("POST", response["Access-Control-Allow-Methods"])
