# aSimpleNerdola 💌

Uma cartinha digital animada, só com HTML, CSS e JS, hospedada no GitHub Pages.

**Como funciona:** ela escaneia o QR code, aparece um envelope balançando, ela toca, o envelope abre, a carta sobe e o texto vai sendo digitado. No final vem uma pergunta com os botões "Sim" e "Não" (o "Não" foge 😈) e, quando ela toca em "Sim", aparece uma chuva de corações.

## ✏️ Personalizar

Edite só o **`config.js`**: destinatária, parágrafos, assinatura, pergunta, textos dos botões e mensagem final.

- Para tirar a pergunta, use `pergunta: ""`.
- Tocar na carta durante a digitação mostra o texto inteiro de uma vez.

## 🚀 Publicar no GitHub Pages

1. Junte esta branch na `main` (ou escolha esta branch como fonte do Pages).
2. No repositório, vá em **Settings → Pages**.
3. Em *Source*, escolha **Deploy from a branch**, a branch `main` e a pasta `/ (root)`. Salve.
4. Espere 1 ou 2 minutos. O site vai ficar em:
   **https://eduardooanjos.github.io/aSimpleNerdola/**

## 📱 QR code

O `qrcode.png` já aponta para o endereço acima. Se o link que aparecer em *Settings → Pages* for outro,
gere um novo QR (em qualquer gerador online) com o link certo.

Dica: teste no seu celular antes de mandar pra ela 😉

## Testar localmente

É só abrir o `index.html` no navegador.
