// Manejo de pestañas
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Manejo del formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            fetch('http://3.223.148.111:8000/api/auth/email/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            .then(response => response.json())
            .then(data => {
                const resultDiv = document.getElementById('authResult');
                if (data.success) {
                    resultDiv.textContent = "✅ Inicio de sesión exitoso";
                    resultDiv.className = 'result-message success';
                    
                    // Redirigir al dashboard después de 1.5 segundos
                    setTimeout(() => {
                        window.top.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    throw new Error(data.error || "Error desconocido");
                }
            })
            .catch(error => {
                const resultDiv = document.getElementById('authResult');
                resultDiv.textContent = `❌ Error: ${error.message}`;
                resultDiv.className = 'result-message error';
            });
        });
    }

    // Manejo del formulario de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            if (password !== confirmPassword) {
                const resultDiv = document.getElementById('authResult');
                resultDiv.textContent = "❌ Las contraseñas no coinciden";
                resultDiv.className = 'result-message error';
                return;
            }
            
            fetch('http://3.223.148.111:8000/api/auth/email/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    username: username
                })
            })
            .then(response => response.json())
            .then(data => {
                const resultDiv = document.getElementById('authResult');
                if (data.success) {
                    resultDiv.textContent = "✅ Registro exitoso. Ahora puedes iniciar sesión.";
                    resultDiv.className = 'result-message success';
                    setTimeout(() => {
                        document.querySelector('.tab-btn[data-tab="login"]').click();
                    }, 2000);
                } else {
                    throw new Error(data.error || "Error desconocido");
                }
            })
            .catch(error => {
                const resultDiv = document.getElementById('authResult');
                resultDiv.textContent = `❌ Error: ${error.message}`;
                resultDiv.className = 'result-message error';
            });
        });
    }
});

// Función para manejar la respuesta de Google
function handleCredentialResponse(response) {
    const resultDiv = document.getElementById('authResult');
    
    fetch('http://3.223.148.111:8000/api/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken: response.credential })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            resultDiv.textContent = "✅ Autenticación con Google exitosa";
            resultDiv.className = 'result-message success';
            // Redirigir al dashboard después de 1.5 segundos
            setTimeout(() => {
                window.top.location.href = 'dashboard.html';
            }, 1500);
        } else {
            throw new Error(data.error || "Error desconocido");
        }
    })
    .catch(error => {
        resultDiv.textContent = `❌ Error: ${error.message}`;
        resultDiv.className = 'result-message error';
    });
}