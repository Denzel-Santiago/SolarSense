
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "route": "/"
  },
  {
    "renderMode": 0,
    "route": "/Login"
  },
  {
    "renderMode": 0,
    "route": "/Lista-Usuarios"
  },
  {
    "renderMode": 0,
    "route": "/Membresias"
  },
  {
    "renderMode": 0,
    "route": "/Novedades-Admin"
  },
  {
    "renderMode": 0,
    "route": "/Noticias"
  },
  {
    "renderMode": 0,
    "redirectTo": "/Sensores/UsuarioDash",
    "route": "/Sensores"
  },
  {
    "renderMode": 0,
    "route": "/Sensores/Voltaje"
  },
  {
    "renderMode": 0,
    "route": "/Sensores/Humedad"
  },
  {
    "renderMode": 0,
    "route": "/Sensores/Temperatura"
  },
  {
    "renderMode": 0,
    "route": "/Sensores/UsuarioDash"
  },
  {
    "renderMode": 0,
    "route": "/Sensores/PresionAtmosferica"
  },
  {
    "renderMode": 0,
    "route": "/Sensores/Novedades"
  },
  {
    "renderMode": 0,
    "route": "/Sensores/Perfil"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 8839, hash: 'cf949d09a51e7d494bde900f8e10d4a4d418412a461d3277d6ad594f176876e2', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1129, hash: '9ab0bf2aa9172c8ff87e2ddbd9dddfcc67f4e1b2c2b386504fb00ba5f5f3d7d3', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-VUKE66ES.css': {size: 31337, hash: 'm9yOmW3MLyA', text: () => import('./assets-chunks/styles-VUKE66ES_css.mjs').then(m => m.default)}
  },
};
