
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
    'index.csr.html': {size: 7815, hash: 'f26418f9b4a4f02b24fb50768482ab136f7d52e5e4c7ed85a578461051191355', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1129, hash: '1fd1505b3b985ac200b9bab7d8e3f3edc5bf6ebbb2a8c33523ffc7a508a8227d', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-4QBI57KN.css': {size: 29201, hash: 'LS70muMhJSM', text: () => import('./assets-chunks/styles-4QBI57KN_css.mjs').then(m => m.default)}
  },
};
