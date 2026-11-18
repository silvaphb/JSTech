"use strict";

const MAX_ITEMS = 50;

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function safeImageUrl(value, label) {
    let url;
    try {
        url = new URL(value);
    } catch {
        throw new Error(`${label}: informe uma URL válida.`);
    }

    if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error(`${label}: use uma URL HTTP ou HTTPS.`);
    }
    return escapeHtml(url.href);
}

function generateInstagramHtml(autor, contas, posts) {
    const authorName = escapeHtml(autor.name);
    const authorUsername = escapeHtml(autor.username);
    const authorPhoto = safeImageUrl(autor.profile_photo_url, "Foto do autor");

    const stories = contas.map((conta) => `
                        <div class="flex flex-col items-center flex-shrink-0">
                            <div class="w-16 h-16 rounded-full p-0.5 bg-gray-100 md:w-20 md:h-20">
                                <div class="w-full h-full rounded-full p-0.5 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500">
                                    <div class="w-full h-full rounded-full p-0.5 bg-white flex items-center justify-center">
                                        <img class="w-full h-full object-cover rounded-full"
                                        src="${safeImageUrl(conta.profile_photo_url, `Foto de ${conta.username}`)}"
                                        alt="Foto de ${escapeHtml(conta.username)}">
                                    </div>
                                </div>
                            </div>
                            <span class="text-xs mt-1 w-16 text-center md:w-20 truncate">${escapeHtml(conta.username)}</span>
                        </div>`).join("");

    const postCards = posts.map((post) => `
                <article class="bg-white border border-gray-200 rounded-lg mb-4">
                    <header class="flex items-center justify-between p-3">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full p-0.5 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500">
                                <div class="w-full h-full rounded-full p-0.5 bg-white flex items-center justify-center">
                                    <img class="w-full h-full object-cover rounded-full"
                                    src="${safeImageUrl(post.profile_photo_url, `Foto de ${post.username}`)}"
                                    alt="Foto de ${escapeHtml(post.username)}">
                                </div>
                            </div>
                            <div>
                                <p class="text-sm font-semibold">${escapeHtml(post.username)}</p>
                                <p class="text-xs text-gray-500">${escapeHtml(post.location)}</p>
                            </div>
                        </div>
                        <button type="button" aria-label="Mais opções">
                            <i class="bx bx-dots-horizontal-rounded"></i>
                        </button>
                    </header>
                    <div class="bg-gray-100 relative">
                        <img class="w-full h-full object-cover"
                        src="${safeImageUrl(post.image_url, `Imagem do post de ${post.username}`)}"
                        alt="Imagem do post de ${escapeHtml(post.username)}">
                    </div>
                    <div class="p-3">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-4">
                                <button type="button" aria-label="Curtir"><i class="bx bx-heart text-2xl"></i></button>
                                <button type="button" aria-label="Comentar"><i class="bx bx-message text-2xl"></i></button>
                                <button type="button" aria-label="Compartilhar"><i class="bx bx-send text-2xl"></i></button>
                            </div>
                            <button type="button" aria-label="Salvar"><i class="bx bx-bookmark text-2xl"></i></button>
                        </div>
                        <p class="font-semibold text-sm mb-2">${escapeHtml(post.likes)} curtidas</p>
                        <p class="text-sm">
                            <span class="font-semibold">${escapeHtml(post.username)}</span>
                            <span class="text-slate-900/90">${escapeHtml(post.caption)}</span>
                        </p>
                        <button class="text-sm text-gray-500 mt-1" type="button">
                            Ver todos os ${escapeHtml(post.comments_count)} comentários
                        </button>
                        <p class="text-xs text-gray-500 mt-2 uppercase">${escapeHtml(post.time_ago)}</p>
                    </div>
                </article>`).join("");

    const suggestions = contas.slice(0, 3).map((conta) => `
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <img class="w-8 h-8 rounded-full object-cover"
                                src="${safeImageUrl(conta.profile_photo_url, `Foto de ${conta.username}`)}"
                                alt="Foto de ${escapeHtml(conta.username)}">
                                <div>
                                    <p class="text-sm font-semibold">${escapeHtml(conta.username)}</p>
                                    <p class="text-sm text-gray-500">Sugerido para você</p>
                                </div>
                            </div>
                            <button class="text-blue-500 text-xs font-semibold" type="button">Seguir</button>
                        </div>`).join("");

    return `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clone Instagram - ${authorName}</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"><\/script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css">
</head>
<body class="min-h-screen bg-gray-100 text-slate-900">
    <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4">
            <div class="flex items-center justify-between h-14 md:h-16">
                <h1 class="text-xl font-semibold">Instagram</h1>
                <button class="md:hidden" type="button" aria-label="Abrir menu">
                    <i class="bx bx-menu"></i>
                </button>
                <div class="hidden md:flex items-center">
                    <input type="text" aria-label="Pesquisar" placeholder="Pesquisar"
                    class="w-64 h-9 bg-gray-100 pr-4 pl-4 rounded-lg text-sm">
                </div>
                <div class="hidden md:flex items-center gap-3">
                    <button class="flex items-center" type="button" aria-label="Início"><i class="bx bx-home text-xl"></i></button>
                    <button class="flex items-center" type="button" aria-label="Pesquisar"><i class="bx bx-search text-xl"></i></button>
                    <button class="flex items-center" type="button" aria-label="Criar"><i class="bx bx-plus text-xl"></i></button>
                    <button class="flex items-center" type="button" aria-label="Atividade"><i class="bx bx-heart text-xl"></i></button>
                    <button class="flex items-center" type="button" aria-label="Perfil"><i class="bx bx-user text-xl"></i></button>
                    <img class="w-7 h-7 rounded-full object-cover" src="${authorPhoto}" alt="Foto de ${authorUsername}">
                </div>
            </div>
        </div>
    </header>
    <main class="max-w-5xl mx-auto px-4 py-4 pb-20 md:px-8 md:py-8">
        <div class="flex gap-8">
            <div class="flex-1 max-w-lg mx-auto md:mx-0">
                <section class="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                    <div class="flex gap-4 overflow-x-auto">
                        <div class="flex flex-col items-center flex-shrink-0">
                            <div class="w-16 h-16 rounded-full p-0.5 bg-gray-100 md:w-20 md:h-20">
                                <div class="w-full h-full rounded-full p-0.5 bg-white flex items-center justify-center">
                                    <span class="text-2xl text-gray-500">+</span>
                                </div>
                            </div>
                            <span class="text-xs mt-1 w-16 text-center md:w-20">Seu story</span>
                        </div>
                        <div class="flex flex-col items-center flex-shrink-0">
                            <div class="w-16 h-16 rounded-full p-0.5 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 md:w-20 md:h-20">
                                <div class="w-full h-full rounded-full p-0.5 bg-white flex items-center justify-center">
                                    <img class="w-full h-full object-cover rounded-full" src="${authorPhoto}" alt="Foto de ${authorUsername}">
                                </div>
                            </div>
                            <span class="text-xs mt-1 w-16 text-center md:w-20 truncate">${authorUsername}</span>
                        </div>
                        ${stories}
                    </div>
                </section>
                ${postCards}
            </div>
            <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
                <div class="flex items-center justify-around px-4">
                    <button class="p-2" type="button" aria-label="Início"><i class="bx bx-home text-2xl"></i></button>
                    <button class="p-2" type="button" aria-label="Pesquisar"><i class="bx bx-search text-2xl"></i></button>
                    <button class="p-2" type="button" aria-label="Criar"><i class="bx bx-plus text-2xl"></i></button>
                    <button class="p-2" type="button" aria-label="Atividade"><i class="bx bx-heart text-2xl"></i></button>
                    <button class="p-2" type="button" aria-label="Perfil"><i class="bx bx-user text-2xl"></i></button>
                </div>
            </nav>
            <aside class="hidden md:block w-80 flex-shrink-0">
                <div class="sticky top-20">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <img class="w-14 h-14 object-cover rounded-full" src="${authorPhoto}" alt="Foto de ${authorUsername}">
                            <div>
                                <p class="text-sm font-semibold">${authorUsername}</p>
                                <p class="text-sm text-gray-500">${authorName}</p>
                            </div>
                        </div>
                        <button class="text-blue-500 text-sm font-semibold" type="button">Trocar</button>
                    </div>
                    <div class="mb-4">
                        <div class="flex items-center justify-between mb-4">
                            <span class="text-sm font-semibold text-gray-500">Sugestões para você</span>
                            <button class="text-xs font-semibold" type="button">Ver tudo</button>
                        </div>
                    </div>
                    <div class="flex flex-col gap-3">${suggestions}</div>
                    <div class="mt-8">
                        <p class="text-xs text-gray-500/68">
                            Sobre · Ajuda · Imprensa · API · Carreiras · Termos · Localizações · Idioma
                        </p>
                        <p class="text-xs text-gray-500/68 mt-4">© 2026 INSTAGRAM CLONE</p>
                    </div>
                </div>
            </aside>
        </div>
    </main>
</body>
</html>`;
}

function readCards(container) {
    return [...container.querySelectorAll(".item-card")].map((card) =>
        Object.fromEntries([...card.querySelectorAll("[data-field]")].map((input) => [input.dataset.field, input.value]))
    );
}

function accountMarkup(account, index) {
    return `<fieldset class="item-card">
        <legend class="item-card-title">Conta ${index + 1}</legend>
        <div class="fields">
            <div class="field">
                <label for="account-${index}-username">Nome de usuário</label>
                <input id="account-${index}-username" data-field="username" maxlength="30" value="${escapeHtml(account.username)}" placeholder="Ex.: conta${index + 1}" required>
            </div>
            <div class="field">
                <label for="account-${index}-photo">Link da foto de perfil</label>
                <input id="account-${index}-photo" data-field="profile_photo_url" type="url" value="${escapeHtml(account.profile_photo_url)}" placeholder="https://exemplo.com/perfil.jpg" required>
            </div>
        </div>
    </fieldset>`;
}

function postMarkup(post, index) {
    return `<fieldset class="item-card">
        <legend class="item-card-title">Post ${index + 1}</legend>
        <div class="fields">
            <div class="field">
                <label for="post-${index}-username">Nome de usuário</label>
                <input id="post-${index}-username" data-field="username" maxlength="30" value="${escapeHtml(post.username)}" placeholder="Ex.: ailujzul" required>
            </div>
            <div class="field">
                <label for="post-${index}-photo">Foto de perfil do post</label>
                <input id="post-${index}-photo" data-field="profile_photo_url" type="url" value="${escapeHtml(post.profile_photo_url)}" placeholder="https://exemplo.com/perfil.jpg" required>
            </div>
            <div class="field full">
                <label for="post-${index}-image">Link da imagem do post</label>
                <input id="post-${index}-image" data-field="image_url" type="url" value="${escapeHtml(post.image_url)}" placeholder="https://exemplo.com/post.jpg" required>
            </div>
            <div class="field">
                <label for="post-${index}-location">Localização</label>
                <input id="post-${index}-location" data-field="location" maxlength="100" value="${escapeHtml(post.location)}" placeholder="Ex.: Rio de Janeiro, Brasil">
            </div>
            <div class="field">
                <label for="post-${index}-likes">Curtidas</label>
                <input id="post-${index}-likes" data-field="likes" maxlength="30" value="${escapeHtml(post.likes)}" placeholder="Ex.: 1.234" required>
            </div>
            <div class="field full">
                <label for="post-${index}-caption">Legenda</label>
                <textarea id="post-${index}-caption" data-field="caption" maxlength="2000" placeholder="Escreva a legenda do post...">${escapeHtml(post.caption)}</textarea>
            </div>
            <div class="field">
                <label for="post-${index}-comments">Quantidade de comentários</label>
                <input id="post-${index}-comments" data-field="comments_count" type="number" min="0" max="1000000" value="${escapeHtml(post.comments_count)}" required>
            </div>
            <div class="field">
                <label for="post-${index}-time">Tempo da publicação</label>
                <input id="post-${index}-time" data-field="time_ago" maxlength="50" value="${escapeHtml(post.time_ago)}" placeholder="Ex.: há 2 horas" required>
            </div>
        </div>
    </fieldset>`;
}

function renderCards(input, container, markup, fields) {
    const count = Number(input.value);
    if (!Number.isInteger(count) || count < 0 || count > MAX_ITEMS) {
        input.setCustomValidity(`Informe um número entre 0 e ${MAX_ITEMS}.`);
        input.reportValidity();
        return;
    }
    input.setCustomValidity("");
    const previous = readCards(container);
    const cards = Array.from({ length: count }, (_, index) => ({ ...fields, ...previous[index] }));
    container.innerHTML = cards.map(markup).join("");
}

function setMessage(message, isError = false) {
    const formMessage = document.querySelector("#form-message");
    formMessage.textContent = message;
    formMessage.classList.toggle("error", isError);
}

const accountCount = document.querySelector("#account-count");
const postCount = document.querySelector("#post-count");
const accountsFields = document.querySelector("#accounts-fields");
const postsFields = document.querySelector("#posts-fields");
const output = document.querySelector("#output");
const copyButton = document.querySelector("#copy-button");
const downloadButton = document.querySelector("#download-button");

const emptyAccount = { username: "", profile_photo_url: "" };
const emptyPost = {
    username: "",
    profile_photo_url: "",
    image_url: "",
    location: "",
    likes: "",
    caption: "",
    comments_count: "0",
    time_ago: ""
};

accountCount.addEventListener("change", () => renderCards(accountCount, accountsFields, accountMarkup, emptyAccount));
postCount.addEventListener("change", () => renderCards(postCount, postsFields, postMarkup, emptyPost));
renderCards(accountCount, accountsFields, accountMarkup, emptyAccount);
renderCards(postCount, postsFields, postMarkup, emptyPost);

document.querySelector("#generator-form").addEventListener("submit", (event) => {
    event.preventDefault();
    setMessage("");
    if (!event.currentTarget.reportValidity()) return;

    try {
        const code = generateInstagramHtml(
            {
                name: document.querySelector("#author-name").value,
                username: document.querySelector("#author-username").value,
                profile_photo_url: document.querySelector("#author-photo").value
            },
            readCards(accountsFields),
            readCards(postsFields)
        );
        output.value = code;
        document.querySelector("#preview").srcdoc = code;
        copyButton.disabled = false;
        downloadButton.disabled = false;
        setMessage("Código gerado com sucesso. Você já pode copiar, baixar ou visualizar.");
    } catch (error) {
        setMessage(error.message, true);
    }
});

copyButton.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(output.value);
        setMessage("Código copiado para a área de transferência.");
    } catch {
        output.focus();
        output.select();
        setMessage("Selecione e copie o código manualmente.");
    }
});

downloadButton.addEventListener("click", () => {
    const file = new Blob([output.value], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "meu-feed.html";
    link.click();
    URL.revokeObjectURL(url);
});
