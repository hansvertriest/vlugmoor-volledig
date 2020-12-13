import App from '../lib/App';
import ApiService from '../lib/api/ApiService';

const homeTemplate = require('../templates/home.hbs');

export default () => {
    const apiService = new ApiService;
    const data = apiService.findAllMetaData();
    data.then(
        metaData => console.log(metaData)
    );

    

    const title = 'Home page';
    App.render(homeTemplate({title}));
};