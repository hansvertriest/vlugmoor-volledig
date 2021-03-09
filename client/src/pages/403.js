import App from '../lib/App';

const loginTemplate = require('../templates/accessDenied.hbs');

export default () => {
    const title = '403 You shall not pass!';
    App.render(loginTemplate({title}));

    const logo = document.getElementById('logo');
    logo.removeAttribute('href');
};