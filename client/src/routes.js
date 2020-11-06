import SimulationPage from './pages/simulation';
import HomePage from './pages/home';
import SimulationListPage from './pages/list';
 
export default [
    {path: '/simulation', view: SimulationPage},
    {path: '/simulation-list', view: SimulationListPage},
    {path: '/home', view: HomePage},
];