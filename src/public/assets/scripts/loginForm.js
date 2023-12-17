document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    fetch('/api/sessions/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            window.location.href = '/products';
        } else {
            alert(data.error);
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });
});

const protocol = window.location.protocol;
const host = window.location.host;

const baseUrl = `${protocol}//${host}`;

document.getElementById('githubLogin').addEventListener('click', function(event) {
    event.preventDefault();
    window.open(`https://github.com/login/oauth/authorize?response_type=code&redirect_uri=${baseUrl}/api/sessions/githubcallback&client_id=Iv1.f2d39cec49bb29e7`, '_blank');
    
    window.addEventListener('focus', function() {
        window.location.href = '/products';
    });
});

