from html import escape


class Constructor:
    @staticmethod
    def generate_instagram_html(autor: dict, contas: list[dict], posts: list[dict]) -> str:
        author_name = escape(autor["name"])
        author_username = escape(autor["username"])
        author_photo = escape(autor["profile_photo_url"], quote=True)

        stories = "".join(
            f"""
            <div class="story">
                <img src="{escape(conta['profile_photo_url'], quote=True)}" alt="Foto de {escape(conta['username'], quote=True)}">
                <span>{escape(conta['username'])}</span>
            </div>"""
            for conta in contas
        )

        post_cards = "".join(
            f"""
            <article class="post">
                <header class="post-header">
                    <img src="{escape(post['profile_photo_url'], quote=True)}" alt="Foto de {escape(post['username'], quote=True)}">
                    <div class="post-author">
                        <strong>{escape(post['username'])}</strong>
                        <span>{escape(post['location'])}</span>
                    </div>
                    <span class="more" aria-label="Mais opções">•••</span>
                </header>
                <img class="post-image" src="{escape(post['image_url'], quote=True)}" alt="Foto publicada por {escape(post['username'], quote=True)}">
                <div class="post-content">
                    <div class="post-actions" aria-hidden="true"><span>♡　♧　➤</span><span>♧</span></div>
                    <strong class="likes">{escape(post['likes'])} curtidas</strong>
                    <p><strong>{escape(post['username'])}</strong> {escape(post['caption'])}</p>
                    <span class="comments">Ver todos os {escape(str(post['comments_count']))} comentários</span>
                    <span class="time">{escape(post['time_ago'])}</span>
                </div>
            </article>"""
            for post in posts
        )

        return f"""<!doctype html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Feed de {author_name}</title>
    <style>
        * {{ box-sizing: border-box; }}
        body {{ margin: 0; background: #fafafa; color: #262626; font: 14px Arial, sans-serif; }}
        .topbar {{ height: 62px; background: #fff; border-bottom: 1px solid #dbdbdb; display: flex; align-items: center; justify-content: center; }}
        .topbar-inner {{ width: min(975px, 100%); padding: 0 20px; display: flex; align-items: center; justify-content: space-between; }}
        .brand {{ font: italic bold 25px Georgia, serif; }}
        .owner {{ color: #8e8e8e; }}
        main {{ width: min(614px, 100%); margin: 28px auto; }}
        .stories, .post {{ background: #fff; border: 1px solid #dbdbdb; border-radius: 4px; }}
        .stories {{ display: flex; gap: 16px; overflow-x: auto; padding: 16px; margin-bottom: 24px; }}
        .story {{ min-width: 62px; text-align: center; font-size: 11px; }}
        .story img {{ width: 58px; height: 58px; object-fit: cover; border-radius: 50%; padding: 2px; border: 2px solid #d62976; }}
        .story span {{ display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 5px; }}
        .post {{ margin-bottom: 24px; }}
        .post-header {{ height: 60px; padding: 10px 14px; display: flex; align-items: center; gap: 10px; }}
        .post-header img {{ width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }}
        .post-author {{ display: flex; flex: 1; flex-direction: column; gap: 3px; }}
        .post-author span, .comments, .time {{ color: #8e8e8e; font-size: 12px; }}
        .more {{ letter-spacing: 2px; }}
        .post-image {{ display: block; width: 100%; max-height: 760px; object-fit: cover; background: #efefef; }}
        .post-content {{ padding: 12px 14px 14px; }}
        .post-actions {{ display: flex; justify-content: space-between; font-size: 24px; margin-bottom: 10px; }}
        .likes {{ display: block; margin-bottom: 8px; }}
        .post-content p {{ margin: 0 0 8px; line-height: 1.5; }}
        .comments, .time {{ display: block; margin-top: 8px; }}
        @media (max-width: 640px) {{
            .topbar {{ height: 54px; }}
            main {{ margin: 0 auto; }}
            .stories, .post {{ border-left: 0; border-right: 0; border-radius: 0; }}
            .post {{ margin-bottom: 8px; }}
        }}
    </style>
</head>
<body>
    <header class="topbar">
        <div class="topbar-inner">
            <strong class="brand">Instagram</strong>
            <span class="owner">{author_name} · @{author_username}</span>
        </div>
    </header>
    <main>
        <section class="stories" aria-label="Contas">
            <div class="story">
                <img src="{author_photo}" alt="Foto de {escape(author_username, quote=True)}">
                <span>{author_username}</span>
            </div>
            {stories}
        </section>
        {post_cards}
    </main>
</body>
</html>"""

    @staticmethod
    def return_html_code_of_fake_instagram(autor: str, qnt_contas: int, qnt_posts: int) -> str:
        placeholder_photo = "https://placehold.co/160x160?text=Perfil"
        placeholder_post = "https://placehold.co/720x720?text=Post"
        author = {
            "name": autor,
            "username": autor,
            "profile_photo_url": placeholder_photo,
        }
        contas = [
            {"username": f"conta_{index + 1}", "profile_photo_url": placeholder_photo}
            for index in range(qnt_contas)
        ]
        posts = [
            {
                "username": autor,
                "profile_photo_url": placeholder_photo,
                "location": "",
                "image_url": placeholder_post,
                "likes": "0",
                "caption": "",
                "comments_count": 0,
                "time_ago": "há 1 hora",
            }
            for _ in range(qnt_posts)
        ]
        return Constructor.generate_instagram_html(author, contas, posts)
