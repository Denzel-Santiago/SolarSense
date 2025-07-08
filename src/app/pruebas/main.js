document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en la página de dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        return;
    }

    const authBtn = document.getElementById('authBtn');
    const authModal = document.getElementById('authModal');
    const closeBtn = document.querySelector('.close-btn');

    // Abrir modal al hacer clic en el botón de autenticación
    authBtn.addEventListener('click', function() {
        authModal.style.display = 'block';
    });

    // Cerrar modal al hacer clic en la X
    closeBtn.addEventListener('click', function() {
        authModal.style.display = 'none';
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', function(event) {
        if (event.target === authModal) {
            authModal.style.display = 'none';
        }
    });
});