document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');

    logoutBtn.addEventListener('click', function() {
        // Cerrar sesión de Google si está activa
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.disableAutoSelect();
        }
        
        // Limpiar cualquier dato de sesión (si se usa)
        // localStorage.removeItem('authToken');
        
        // Redirigir al home
        window.location.href = 'index.html';
    });
});