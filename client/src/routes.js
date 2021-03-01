import SimulationPage from './pages/simulation';
import HomePage from './pages/home';
import SimulationListPage from './pages/list';
import SimulationFromDbPage from './pages/simulationFromDb';
  
export default [
    {path: '/simulation/new', view: SimulationPage},
    {path: '/simulation/:id', view: SimulationFromDbPage, f: (params, query) => {
        console.log(params.id);
        console.log(query);
    }},
    {path: '/simulation', view: SimulationFromDbPage},
    {path: '/simulation-list', view: SimulationListPage},
    {path: '/*', view: HomePage},
];