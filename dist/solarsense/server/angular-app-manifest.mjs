
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
    'index.csr.html': {size: 8839, hash: 'bf5285ddf46ef612d1621cdbaca4bc8c5acb3a7f18f16603bd485e912b28960f', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1129, hash: 'f9d9e61843fe9985fcf63521e810186049c385698e308fbfac2acd525b863101', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-VUKE66ES.css': {size: 31337, hash: 'm9yOmW3MLyA', text: () => import('./assets-chunks/styles-VUKE66ES_css.mjs').then(m => m.default)}
  },
};
