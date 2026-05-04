# Atrio Reserve

> Landing page conceitual para apresentação de imóveis de alto padrão com foco em curadoria, navegação imersiva e percepção de valor.

## Preview

![Desktop Preview](./docs/desktop.png)
![Mobile Preview](./docs/mobile.png)

## Sobre o Projeto

Atrio Reserve é um estudo de front-end estático orientado a portfólio. O projeto simula a presença digital de uma proptech premium, combinando hero editorial, mapa interativo, comparador visual, panorama navegável, simulador financeiro e vitrine de propriedades com filtros personalizados.

O objetivo é demonstrar acabamento visual, organização de código, responsividade, acessibilidade básica e prontidão para deploy estático na Vercel sem depender de frameworks.

## Tecnologias Utilizadas

- [HTML5](https://developer.mozilla.org/pt-BR/docs/Web/HTML) — Estrutura semântica da página
- [CSS3](https://developer.mozilla.org/pt-BR/docs/Web/CSS) — Sistema visual, layout responsivo e microinterações
- [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript) — Interações, filtros, simulador e atualização dinâmica de conteúdo

## Funcionalidades

- [x] Hero com composição editorial e indicadores de posicionamento
- [x] Mapa SVG com seleção dinâmica de propriedades
- [x] Comparador visual arrastável com suporte a teclado
- [x] Tour panorâmico com hotspots, arraste e controles alternativos
- [x] Simulador financeiro com feedback em tempo real
- [x] Filtros customizados por preço e metragem com estado vazio
- [x] Layout responsivo para mobile, tablet e desktop
- [x] Ajustes de acessibilidade como skip link, foco visível, `aria-live` e suporte a `prefers-reduced-motion`

## Estrutura de Pastas

```text
.
├── docs/
│   ├── desktop.png
│   └── mobile.png
├── index.html
├── README.md
└── src/
    ├── assets/
    │   └── images/
    ├── scripts/
    │   └── main.js
    └── styles/
        └── main.css
```

## Como Rodar Localmente

Como o projeto é estático, você pode abrir o `index.html` diretamente no navegador.

Se preferir servir localmente:

```bash
# entre na pasta do projeto
cd C:\workspace\collection\site-5-proptech

# inicie um servidor HTTP simples
python -m http.server 8081
```

Depois acesse:

```text
http://localhost:8081
```

## Deploy na Vercel

O projeto está pronto para deploy como site estático.

1. Importe o repositório na Vercel.
2. Mantenha a detecção automática de projeto estático.
3. Use `index.html` como entrada principal.
4. Não é necessário configurar etapa de build.

## Validação Rápida

Para verificar a sintaxe do JavaScript:

```bash
node --check src/scripts/main.js
```

## Melhorias Futuras

- [ ] Substituir ilustrações SVG conceituais por imagens reais do portfólio
- [ ] Adicionar analytics e rastreamento de cliques em CTAs
- [ ] Extrair conteúdos estáticos para uma camada de dados dedicada caso o projeto cresça

## Autor

Desenvolvido como projeto conceitual de portfólio por `Seu Nome`.

## Licença

Este projeto está sob a licença MIT.
