
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
    "route": "/Login"
  },
  {
    "renderMode": 2,
    "route": "/Lista-Usuarios"
  },
  {
    "renderMode": 2,
    "route": "/Membresias"
  },
  {
    "renderMode": 2,
    "route": "/Novedades-Admin"
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
    'index.csr.html': {size: 8483, hash: '3e1fa7d0fbda6f80384199c8ccb03a4ff362db3e286420e9309e772a3994462b', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1129, hash: 'b973150175e18b4bb8d48d30a2fd5766a6ec22cf285936676819048b406ca969', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 33045, hash: 'f8db0f28daeadff11d7a1621dcb87f2375abd78269b2555292d8e4ea570e55b5', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'Sensores/Novedades/index.html': {size: 18830, hash: 'd8ae5a9c846b751cae6d2d8e90f0b23b4971d7d5cdfdde43034a997781d562e7', text: () => import('./assets-chunks/Sensores_Novedades_index_html.mjs').then(m => m.default)},
    'Lista-Usuarios/index.html': {size: 18701, hash: '1ef959ea05db67f7ae8ec4035d997c2f2ef95977b1f65e9c0ff6e97421fb53e7', text: () => import('./assets-chunks/Lista-Usuarios_index_html.mjs').then(m => m.default)},
    'Novedades-Admin/index.html': {size: 19047, hash: '32f4603d5747c140dc94592152ad1931a07c76c6f1759fd96187a67a73b51152', text: () => import('./assets-chunks/Novedades-Admin_index_html.mjs').then(m => m.default)},
    'Login/index.html': {size: 16728, hash: '401ad97c6dbc65d875c09dede1304908f4d165be4acfb4e90162ba84ad6c22a2', text: () => import('./assets-chunks/Login_index_html.mjs').then(m => m.default)},
    'Sensores/Perfil/index.html': {size: 17087, hash: 'e1c3c89bb08095fe4f905c6caf7321734e7d157c181137c3b6bd482b1feced23', text: () => import('./assets-chunks/Sensores_Perfil_index_html.mjs').then(m => m.default)},
    'Sensores/Humedad/index.html': {size: 18269, hash: '7ec950c4c3265e6930d28658e77424239baa200f35bb2d08efa47293f9d4271f', text: () => import('./assets-chunks/Sensores_Humedad_index_html.mjs').then(m => m.default)},
    'Membresias/index.html': {size: 19744, hash: '1ece9b1efd6da19e04bbabbd0d86fa77f94f9c99e8ef08a636c03f30889429a2', text: () => import('./assets-chunks/Membresias_index_html.mjs').then(m => m.default)},
    'Sensores/PresionAtmosferica/index.html': {size: 17155, hash: '0fd8f6b64833f5f14d0504f6edda25a7ff0f464acf789cb1e2fed0563583fa2c', text: () => import('./assets-chunks/Sensores_PresionAtmosferica_index_html.mjs').then(m => m.default)},
    'Sensores/UsuarioDash/index.html': {size: 19385, hash: 'e42c2aeaf390603ebdaad15db0386ad75f7e7e917dc068fadb1efe6a9d09f012', text: () => import('./assets-chunks/Sensores_UsuarioDash_index_html.mjs').then(m => m.default)},
    'Sensores/Voltaje/index.html': {size: 18801, hash: 'ceae842e144c803aeb02d615c2b569f5f9752399c157e26d93d2aed501d0b373', text: () => import('./assets-chunks/Sensores_Voltaje_index_html.mjs').then(m => m.default)},
    'Sensores/Temperatura/index.html': {size: 18226, hash: '145f4c03396297f0ac2b7fdb002f5ba5b167cfdaf1c52df59726f7c514e2ff0e', text: () => import('./assets-chunks/Sensores_Temperatura_index_html.mjs').then(m => m.default)},
    'styles-733FDNGS.css': {size: 28835, hash: 'tg93HRplu5Y', text: () => import('./assets-chunks/styles-733FDNGS_css.mjs').then(m => m.default)}
  },
};
