const form = document.querySelector('auth-btn');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let email = document.getElementById('email').value;

    fetch('https://end-of-semester-examination-web.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password, email})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.message === 'User already exists with this username or email') {
            alert('User already exists with this username or email');
            return;
        }
        alert('User registered successfully');
        window.location.href = 'login.html';
    });
});