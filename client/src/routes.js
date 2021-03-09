import SimulationPage from './pages/simulation';
import HomePage from './pages/home';
import SimulationListPage from './pages/list';
import SimulationFromDbPage from './pages/simulationFromDb';
import login from './pages/login';
import register from './pages/register';
import forbidden from './pages/403';
  
export default [
    {path: '/loadsimulation', view: SimulationPage},
    {path: '/simulation/:id', view: SimulationFromDbPage, f: (params, query) => {
        console.log(params.id);
        console.log(query);
    }},
    {path: '/simulation', view: SimulationFromDbPage},
    {path: '/simulation-list', view: SimulationListPage},
    {path: '/login', view: login },
    {path: '/register', view: register },
    {path: '/forbidden', view: forbidden},
    {path: '/*', view: HomePage},
];