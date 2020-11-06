import App from '../lib/App';

const listTemplate = require('../templates/list.hbs');

export default () => {
    const title = 'Simulation list page';
    App.render(listTemplate({title}));
};