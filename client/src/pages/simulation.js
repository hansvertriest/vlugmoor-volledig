import App from '../lib/App';
import { Data, MetaData } from '../simulation/dataClasses';
import { Simulation } from '../simulation/simulationClasses';

const XLSX = require('xlsx');

const simulationTemplate = require('../templates/simulation.hbs');

// FUNCTIONS

export default () => {


    const title = 'Simulation page';

    App.render(simulationTemplate({title}));
    
    const appInit = async (simulation, files) => {
        // get shipTranslation data
        const shipTranslations = files.forces.map((timePoint) => {
            return timePoint.filter((column, index) => {
                if (index >= files.metaData.bolderData.length && index < files.metaData.bolderData.length + 3) {
                    return true;
                }
                return false;
            });
        });
        
        // create data object
        const data = new Data(files.metaData);
        console.log(data.caseMetaData)
        data.addTimePoints(files.coords, files.forces, shipTranslations);
        
        // SIMULATION
        simulation.addData(data);
        await simulation.init();
        simulation.registerController();
        await simulation.addShip(files.metaData.caseShip, true);
        await simulation.addShip(files.metaData.passingShip);
        await simulation.addHawsers(files.metaData.bolderData, files.metaData.hawserMeta);
        simulation.addFenders(files.metaData.fenderData, files.metaData.fenderMeta);
        simulation.drawShips();
        simulation.play();
    }
    const filesHaveLoaded = (simulation, files) => {
        const keys = Object.keys(files);
        if (keys.includes('metaData') && keys.includes('forces') && keys.includes('coords')){
            appInit(simulation, files);
        }
    }

    const getParsedCSVData = (data) => {
        const parsedData = [];

        const newLinebrk = data.split("\n");
        for(let i = 0; i < newLinebrk.length; i++) {
            parsedData.push(newLinebrk[i].split(","))
        }

        return parsedData;
    }

    // BEGIN SCRIPT

    // create simulation
    const canvasId = 'simulation-canvas';
    const simulation = new Simulation(canvasId);

    // get inputfields
    const xlsxInput = document.getElementById('metadata-input');
    const forcesInput = document.getElementById('forces-input');
    const coordsInput = document.getElementById('coords-input');
    const submit = document.getElementById('submit');

    // when files are submitted
    submit.addEventListener('click', (e) => {
        const files = {};

        // read files
        const readerXSLX = new FileReader();
        readerXSLX.onload = (e) => {
            const data = e.target.result;

            const file = XLSX.read(data, {type: 'binary'});

            // parse xlsx to formatted MetaData object
            const metaData = new MetaData(file).get();

            // add to files object
            files.metaData = metaData;

            // check if all filess have been loaded
            filesHaveLoaded(simulation, files)
        }
        const readerForces = new FileReader();
        readerForces.onload = (e) => {
            const data = e.target.result;
        
            // make file readable
            const forces = getParsedCSVData(data);

            // add to files object
            files.forces = forces;

            // check if all filess have been loaded
            filesHaveLoaded(simulation, files)
        }
        const readerCoords = new FileReader();
        readerCoords.onload = (e) => {
            const data = e.target.result;

            // make file readable
            const coords = getParsedCSVData(data);

            // add to files object
            files.coords = coords;

            // check if all filess have been loaded
            filesHaveLoaded(simulation, files)

        }
        readerXSLX.readAsBinaryString(xlsxInput.files[0])
        readerForces.readAsBinaryString(forcesInput.files[0])
        readerCoords.readAsBinaryString(coordsInput.files[0])
    });

    
};
