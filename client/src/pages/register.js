import App from '../lib/App';
import AuthService from '../lib/api/AuthService';
import Router from '../lib/core/Router';
import routes from '../routes';

const loginTemplate = require('../templates/register.hbs');

export default () => {
    const title = 'Register page';
    App.render(loginTemplate({title}));

    const authService = new AuthService();

    
}