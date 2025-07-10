
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/Home"
  },
  {
    "renderMode": 2,
    "redirectTo": "/Sensores/UsuarioDash",
    "route": "/Sensores"
  },
  {
    "renderMode": 2,
    "route": "/Sensores/Voltaje"
  },
  {
    "renderMode": 2,
    "route": "/Sensores/Humedad"
  },
  {
    "renderMode": 2,
    "route": "/Sensores/Temperatura"
  },
  {
    "renderMode": 2,
    "route": "/Sensores/UsuarioDash"
  },
  {
    "renderMode": 2,
    "route": "/Sensores/PresionAtmosferica"
  },
  {
    "renderMode": 2,
    "route": "/Sensores/Novedades"
  },
  {
    "renderMode": 2,
    "route": "/Sensores/Perfil"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 6120, hash: '0f9e4b2c8c03c1276e0fa7bc888b0fba08582ff7589386ee7828542c69228667', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1129, hash: 'a365d5d0c8a6723a7b0097647c0d38e5c60b59594eca3b5b52d77d8acc1b0b2b', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 14250, hash: '37e0fa3ade03c8c973d08b3881cd735d4be33d308aebddc45c7c654512e045a9', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'Sensores/UsuarioDash/index.html': {size: 15345, hash: '5d5f336511a28230cbb62229d127bc8e0f4ca3f258d19b34a4be5d5d4116115b', text: () => import('./assets-chunks/Sensores_UsuarioDash_index_html.mjs').then(m => m.default)},
    'Home/index.html': {size: 11332, hash: 'c6d78e647edf3faeef2c5fc9377676174703231d5aacb3b2f0e826b1e2940880', text: () => import('./assets-chunks/Home_index_html.mjs').then(m => m.default)},
    'Sensores/Novedades/index.html': {size: 16352, hash: '85b12b6cb483da5545dfcbd7c127be5ed94ff6cd2b43822282db204a6d225589', text: () => import('./assets-chunks/Sensores_Novedades_index_html.mjs').then(m => m.default)},
    'Sensores/Perfil/index.html': {size: 14609, hash: 'c0c0e97a12e1ef73b20599cb12a247c36c4543a144a1c8522f93e90c251d03a7', text: () => import('./assets-chunks/Sensores_Perfil_index_html.mjs').then(m => m.default)},
    'Sensores/Voltaje/index.html': {size: 14930, hash: '6925061b495d380ded8ced5211d1b0f32fa77a6ce363ac9de0742056c6b7487f', text: () => import('./assets-chunks/Sensores_Voltaje_index_html.mjs').then(m => m.default)},
    'Sensores/Temperatura/index.html': {size: 14944, hash: 'fefa259e78e3a7e5f92ed900f14f14ecf9b80211d0d7dbc180fdb4bc4cba6aa7', text: () => import('./assets-chunks/Sensores_Temperatura_index_html.mjs').then(m => m.default)},
    'Sensores/Humedad/index.html': {size: 15791, hash: '40edcbf77a85231d39d52a4820f4ea4712e0286247c0e26200b5fba464928755', text: () => import('./assets-chunks/Sensores_Humedad_index_html.mjs').then(m => m.default)},
    'Sensores/PresionAtmosferica/index.html': {size: 16431, hash: '5040f9052d643b8564fe7b6a702b23c5185cb66d7dd4fd68a58ec111f61e685c', text: () => import('./assets-chunks/Sensores_PresionAtmosferica_index_html.mjs').then(m => m.default)},
    'styles-OJBDO74G.css': {size: 19342, hash: 'ACZIBZsaJ70', text: () => import('./assets-chunks/styles-OJBDO74G_css.mjs').then(m => m.default)}
  },
};
