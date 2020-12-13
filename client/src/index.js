import App from '../src/lib/App';
import css from './scss/main.scss';
import _ from 'lodash';
import * as consts from './const';
import routes from './routes';
import 'bootstrap';


const appInit = async () => {
    
    // remove header
    // dataForcesCSV.shift();

    const app = document.createElement('div');
    app.setAttribute('id', 'app');
    document.body.appendChild(app);

    // init core
    App.initCore({
        mainUrl: window.location.origin,
        hash: consts.ROUTER_HASH,
        element: app,
    })
}

const initRoutes = () => {
    routes.forEach((route) => App.router.addRoute(route.path, route.view));
};

window.addEventListener('load', () => {
    appInit();
    initRoutes();

    let requestedPage = window.location.hash.split('/')[1];
    requestedPage = (requestedPage === null || typeof (requestedPage) === 'undefined') ? `/${consts.ROUTER_DEFAULT_PAGE}` : `/${requestedPage}`;
    App.router.navigate(requestedPage);
})




