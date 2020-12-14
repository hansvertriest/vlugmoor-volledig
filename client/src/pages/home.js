import App from '../lib/App';
import ApiService from '../lib/api/ApiService';

const homeTemplate = require('../templates/home.hbs');

export default () => {
    const title = 'Home page';
    App.render(homeTemplate({title}));

    let documentContainer = document.getElementById('container-home');
    
    const showMetaData = (metaData) => {
        metaData.forEach(data => {
            console.log(data.description); 
    
            let container = document.createElement('div');
            let image = document.createElement('img');
            let title = document.createElement('h3');
            let description = document.createElement('p');

            container.setAttribute('class', 'card col-12 col-sm-12 col-md-6 col-lg-4');
            
            documentContainer.appendChild(container);
            container.appendChild(title);
            container.appendChild(description);

            title.innerHTML = data.title;
            description.innerHTML = data.description;
            
            documentContainer.appendChild(container);
        })
    }


    const apiService = new ApiService;
    const data = apiService.findAllMetaData();
    data.then(
        metaData => showMetaData(metaData)
    );

    


};