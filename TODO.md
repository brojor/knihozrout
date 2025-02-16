[ ] FE: Použít @tanstack/vue-virtual se sticky headers pro globální hledání
[ ] Scraper: Zlepšit výkon pomocí parallelního provádění requestů
[ ] Scraper: Implementovat googleapis.com/books/
[ ] FE: Použít layouts pro hlavní screeny a subscreeny
[X] FE: Zlepšit implementaci API
[ ] FE: Implementovat horizontalní scroll se snapingem
[ ] FE: Implementovat offline mode
[ ] Zajistit konzistentí barevné akcenty napříč UI
[X] FE: Sledovat bundle size
[X] FE: Přidat UnoCSS
[ ] FE: Přidat Vuetify 3

[ ] FE: Sloučit wishlist a library do jedné stránky
    [ ] Vytvořit výrazný segment control v horní části stránky
    [ ] Pro určení módu použít query param
    [ ] Přidat middlewate pro valid modes
    [ ] Knihovna má modrý barevný akcent
    [ ] Wishlist má růžový barevný akcent
    [ ] Tyto barvy se projeví v:
        - barvě activního tabu
        - barvě a ikoně FAB buttonu
        - cross-reference mezi knihovnou a wishlistem v prázdných stavech


```
// middleware/validate-library-mode.ts
export default defineNuxtRouteMiddleware((to) => {
  const validModes = ['library', 'wishlist']
  
  if (to.query.mode && !validModes.includes(to.query.mode as string)) {
    return navigateTo({ path: to.path, query: { ...to.query, mode: 'library' } })
  }
})
```

