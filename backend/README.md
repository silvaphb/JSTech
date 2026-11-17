# JSTech — gerador de feed em HTML

## Executar localmente

1. Configure as variáveis do banco de dados no arquivo `.env` do backend e inicie o PostgreSQL.
2. Na pasta `backend`, instale as dependências e inicie a API:

   ```sh
   uv sync
   uv run python manage.py runserver
   ```

3. Em outro terminal, sirva a pasta `frontend` em uma origem permitida pelo CORS:

   ```sh
   cd frontend
   python -m http.server 5500
   ```

4. Abra `http://localhost:5500`. O endereço padrão da API é `http://localhost:8000/api/v1/codes/generate`.

## Gerar um feed

Informe nome, usuário e foto do autor; selecione a quantidade de contas e posts e preencha os detalhes exibidos para cada item. A API retorna uma página HTML responsiva. No painel de saída, é possível copiar o código, baixá-lo como `meu-feed.html` e visualizar o resultado.

Fotos devem usar URLs HTTP ou HTTPS. São aceitas até 50 contas e 50 posts por geração. A API continua oferecendo o endpoint legado `GET /api/v1/codes/getcode?autor=...&contas=...&posts=...`.