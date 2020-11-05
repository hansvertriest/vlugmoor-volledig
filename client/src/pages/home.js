import App from '../lib/App';

const homeTemplate = require('../templates/home.hbs');

export default () => {
    const title = 'Home page';
    App.render(homeTemplate({title}));
};