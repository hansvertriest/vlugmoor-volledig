import App from '../lib/App';
import AuthService from '../lib/api/AuthService';
import Router from '../lib/core/Router';
import routes from '../routes';

const loginTemplate = require('../templates/register.hbs');

export default () => {
    const title = 'Register page';
    App.render(loginTemplate({title}));


    // Authentication

    const authService = new AuthService();
    authService.verifyUserFromLocalStorage();
    
    if (JSON.parse(localStorage.getItem('authUser')) === null) {
        App.router.navigate('/login');
    } else {
    };

    const email = document.getElementById('email-register');
    const firstname = document.getElementById('firstname');
    const lastname = document.getElementById('lastname');
    const role = document.getElementById('role');
    const password = document.getElementById('password-register');
    const register = document.getElementById('register');

    register.addEventListener('click', (e) => {
        authService.signUp(email.value, password.value, firstname.value, lastname.value, role.value );
    });
    
}