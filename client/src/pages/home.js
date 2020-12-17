import App from '../lib/App';
import ApiService from '../lib/api/ApiService';

const homeTemplate = require('../templates/home.hbs');

export default () => {
    const title = 'Home page';
    App.render(homeTemplate({title}));

    let documentContainer = document.getElementById('container-home');

    function getShipImage (imgName) {
        if (imgName === 'bulkcarrier') {
            return '../assets/images/ships/bulkcarrier/bulkcarrier_dirLeft.png';
        } else if (imgName === 'container') {
            return '../assets/images/ships/container/container_large_dirLeft.png';
        } else if (imgName === 'gascarrier') {
            return '../assets/images/ships/gascarrier/gascarrier_prismatanks_dirLeft.png';
        } else if (imgName === 'roro') {
            return '../assets/images/ships/roro/roro_dirLeft.png';
        } else if (imgName === 'oiltanker_large') {
            return '../assets/images/ships/tanker/oiltanker_large_dirLeft.png';
        } else if (imgName === 'oiltanker_small') {
            return '../assets/images/ships/tanker/oiltanker_small_dirLeft.png';
        }
    };

    const showMetaData = (metaData) => {
        metaData.forEach(data => {
    
            let container = document.createElement('div');
            let image = document.createElement('img');
            let title = document.createElement('h3');
            let description = document.createElement('p');

            container.setAttribute('class', 'card');
            
            documentContainer.appendChild(container);
            container.appendChild(image);
            container.appendChild(title);
            container.appendChild(description);

            title.innerHTML = data.title;
            description.innerHTML = data.description;
            image.src = getShipImage(data.picture);
            
            documentContainer.appendChild(container);
        })
    }


    const apiService = new ApiService;
    const data = apiService.findAllMetaData();
    data.then(
        metaData => showMetaData(metaData)
    );

    


};