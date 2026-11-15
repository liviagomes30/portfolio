# Portfólio — Lívia Gomes

Site estático em HTML, CSS e JavaScript puros (sem build, sem dependências).
Publicado em **https://livdev.com.br** via GitHub Pages.

## Estrutura

```
portfolio/
├── index.html              # conteúdo da página (uma <section> por bloco)
├── CNAME                   # domínio do GitHub Pages (não apagar)
├── css/
│   ├── tokens.css          # cores, fontes e raios (identidade visual)
│   ├── base.css            # reset, acessibilidade e animação de entrada
│   ├── components.css      # nav, abas, cards escuros, janela, botões, títulos
│   ├── mascot.css          # mascote Byte
│   ├── noscript.css        # fallback para quem desativa o JavaScript
│   └── sections/           # um arquivo por seção
│       ├── hero.css
│       ├── about.css
│       ├── skills.css
│       ├── stats.css
│       ├── projects.css
│       ├── process.css
│       ├── experience.css
│       ├── honors.css
│       ├── education.css
│       ├── contact.css
│       └── footer.css
├── js/
│   ├── nav.js              # menu mobile
│   ├── mascot.js           # mascote Byte (cria o DOM, segue a rolagem e o cursor)
│   ├── nav-active.js       # destaca no menu a seção visível
│   └── reveal.js           # animação de entrada ao rolar
└── img/
    ├── livia.jpg
    └── favicon.svg
```

A ordem dos `<link>` no `<head>` importa: tokens, base, componentes e depois as seções.

## Rodar localmente

```bash
python -m http.server 8000
```

Depois abra http://localhost:8000.

## Onde mexer

| Quero... | Arquivo |
|---|---|
| Trocar cores ou fontes | `css/tokens.css` |
| Editar textos, links e certificados | `index.html` |
| Ajustar o visual de uma seção | `css/sections/<seção>.css` |
| Ajustar nav, botões ou cards compartilhados | `css/components.css` |
| Adicionar um projeto | copiar um `<article class="project-card">` dentro de `#projetos` |
| Adicionar um certificado | copiar um `<article class="honor-card">` dentro de `#merito` |

## Publicação

GitHub Pages, branch `main`, pasta raiz. O arquivo `CNAME` contém `livdev.com.br`
e o DNS (registros A e CNAME do `www`) é configurado no Registro.br.
