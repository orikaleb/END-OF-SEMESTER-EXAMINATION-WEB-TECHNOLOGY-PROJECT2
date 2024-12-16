document.addEventListener('DOMContentLoaded', function() {
    // Add this at the beginning
    const passwordToggle = document.querySelector('.password-toggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const passwordInput = this.parentElement.querySelector('input');
            const eyeIcon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.classList.remove('fa-eye');
                eyeIcon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                eyeIcon.classList.remove('fa-eye-slash');
                eyeIcon.classList.add('fa-eye');
            }
        });
    }

    // Handle login form
    const loginForm = document.querySelector('#loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let username = document.getElementById('username').value;
            let password = document.getElementById('password').value;
            
            fetch('https://end-of-semester-examination-web.onrender.com/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password})
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Invalid username or password') {
                    alert('Invalid username or password');
                    return;
                }
                alert("User logged in successfully");
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = 'upcoming.html';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Invalid username or password');
            });
        });
    }

    // Handle registration form
    const registerForm = document.querySelector('.auth-form');
    if (registerForm && !registerForm.id) {  // Make sure it's the registration form
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let username = document.getElementById('username').value;
            let email = document.getElementById('email').value;
            let password = document.getElementById('password').value;
            
            fetch('https://end-of-semester-examination-web.onrender.com/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, email, password})
            })
            .then(response => response.json())
            .then(data => {
                alert("User registered successfully");
                window.location.href = 'login.html';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Registration failed');
            });
        });
    }
});