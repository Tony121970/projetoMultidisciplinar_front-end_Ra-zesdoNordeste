const CACHE = "raizes-app-v2";

const arquivos = [
  "index.html",
  "manifest.json",

  "../css/style.css",
  "../css/alertas.css",

  "../js/alertas.js",
  "../js/carrinho.js",

  "../Imagens/logo.png",
  "../Imagens/imagem19.png"
];

self.addEventListener("install", evento => {
  evento.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(arquivos))
  );

  self.skipWaiting();
});

self.addEventListener("activate", evento => {
  evento.waitUntil(
    caches.keys().then(chaves =>
      Promise.all(
        chaves.map(chave => {
          if (chave !== CACHE) {
            return caches.delete(chave);
          }
        })
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", evento => {
  evento.respondWith(
    caches.match(evento.request)
      .then(resposta => resposta || fetch(evento.request))
  );
});