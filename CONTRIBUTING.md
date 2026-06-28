# Contributing to Solward

Solward is open by design — fittingly, contributions are welcome.

## Ways to contribute

- **Code** — improve the landing page, add the demo app, or build tooling.
- **Docs** — sharpen the lite paper, fix typos, clarify the concept.
- **Design** — brand assets, illustrations, UI for the future app.
- **Ideas** — open an issue to discuss protocol design, tokenomics, or partnerships.

## Workflow

1. **Fork** the repo and create a branch: `git checkout -b feature/your-change`.
2. Make your change. Keep the landing page dependency-free (single HTML file, no build step) unless we explicitly adopt a build tool.
3. Test locally — open `public/index.html` and check it renders on desktop and mobile.
4. **Commit** with a clear message: `feat: add X` / `fix: correct Y` / `docs: clarify Z`.
5. **Open a pull request** describing what changed and why.

## Style

- HTML/CSS/JS: keep it readable, no minification in source.
- Preserve the green/white brand palette and existing design tokens (CSS variables at the top of `index.html`).
- Respect accessibility: visible focus states, reduced-motion support, responsive down to mobile.

## Code of conduct

Be respectful, assume good faith, and keep discussion constructive. Harassment of any kind isn't tolerated.

## Questions

Open an issue or reach out via the channels linked on [solward.xyz](https://solward.xyz).
