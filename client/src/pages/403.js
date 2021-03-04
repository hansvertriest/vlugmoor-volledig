import App from '../lib/App';

const loginTemplate = require('../templates/403.hbs');

export default () => {
    const title = '403 You shall not pass!';
    App.render(loginTemplate({title}));

    const logo = document.getElementById('logo');
    logo.removeAttribute('href');
};