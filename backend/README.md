# JSTech — gerador de feed em HTML

## Executar localmente

Sirva a pasta `frontend` com qualquer servidor HTTP estático:

```sh
cd frontend
python -m http.server 5500
```

Abra `http://localhost:5500`. A geração do HTML acontece diretamente no navegador e não requer iniciar o backend.

## Gerar um feed

Informe nome, usuário e foto do autor; selecione a quantidade de contas e posts e preencha os detalhes exibidos para cada item. O JavaScript no frontend gera uma página HTML responsiva. No painel de saída, é possível copiar o código, baixá-lo como `meu-feed.html` e visualizar o resultado.

Fotos devem usar URLs HTTP ou HTTPS. São aceitas até 50 contas e 50 posts por geração. O backend também mantém o endpoint legado `GET /api/v1/codes/getcode?autor=...&contas=...&posts=...`.