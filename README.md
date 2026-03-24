# Pokédex

A Pokédex built with **React**, **Vite**, and **React Router**. Data from [PokéAPI](https://pokeapi.co).

## Requirements met

- ✅ PokéAPI data (list, pagination, detail)
- ✅ Pagination — Prev / Next / First / Last
- ✅ Detail view — types, stats, abilities, height, weight, sprites
- ✅ Multiple pages — Pokédex, Detail, About
- ✅ React Router v6
- ✅ Vite

## Run locally

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

### 1. Create a GitHub repo (e.g. `pokedex`)

### 2. Update the base path in two places:

**`vite.config.js`**
```js
base: '/your-repo-name/',
```

**`src/App.jsx`** — the `basename` on `<BrowserRouter>`:
```jsx
<BrowserRouter basename="/your-repo-name">
```

### 3. Push your code to GitHub

```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/YOUR_USERNAME/your-repo-name.git
git push -u origin main
```

### 4. Deploy

```bash
npm run deploy
```

This runs `vite build` then pushes the `dist/` folder to a `gh-pages` branch.

### 5. Enable Pages in GitHub

Go to your repo → **Settings** → **Pages** → set source to `gh-pages` branch / root.

Your app will be live at:
`https://YOUR_USERNAME.github.io/your-repo-name/`
