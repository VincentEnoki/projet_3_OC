var form = document.querySelector('form');
var errorMessage = document.querySelector('.error-message');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    var email = document.querySelector('#form-email').value;
    var password = document.querySelector('#form-password').value;
    fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
                })
            })
            .then(function(response) {
                if (response.ok) {
                    console.log('Connexion réussie !')
                    window.location.href = "../index.html"
                    return response.json();
                } else {
                    errorMessage.textContent = 'Mauvais identifiant ou mot de passe';
                }
            })
            .then(function(data) {
                var token = data.token;
                localStorage.setItem('token', token);
            })
            .catch(function(error) {
                console.log('Erreur de connexion: ' + error.message);
            });
        });