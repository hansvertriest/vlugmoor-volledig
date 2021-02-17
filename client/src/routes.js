import SimulationPage from './pages/simulation';
import HomePage from './pages/home';
import SimulationListPage from './pages/list';
import SimulationFromDbPage from './pages/simulationFromDb';
  
export default [
    {path: '/simulation', view: SimulationPage},
    {path: '/simulation/:id', view: SimulationFromDbPage},
    {path: '/simulation-list', view: SimulationListPage},
    {path: '/home', view: HomePage},
];