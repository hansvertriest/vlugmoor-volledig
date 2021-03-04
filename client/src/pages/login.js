import App from '../lib/App';
import AuthService from '../lib/api/AuthService';
import Router from '../lib/core/Router';
import routes from '../routes';

const loginTemplate = require('../templates/login.hbs');

export default () => {
    const title = 'Login page';
    App.render(loginTemplate({title}));

    const authService = new AuthService();

    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const button = document.getElementById('login');

    button.addEventListener('click', () => {
        authService.signInLocal(email.value, password.value)
        
    });
}