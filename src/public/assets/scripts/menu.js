document.getElementById('logout').addEventListener('click', function(event) {
    event.preventDefault();
    fetch('/api/sessions/logout', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            window.location.href = '/login';
        } else {
            alert(data.error);
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });
});