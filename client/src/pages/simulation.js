import { Data, MetaData } from '../simulation/dataClasses';
import { Simulation } from '../simulation/simulationClasses';

const XLSX = require('xlsx');

// Load in data
// import metaData from '../assets/sim2/caseMetaData';
// import metaDataXLSX from '../assets/sim2/caseMetaData.xlsx';
// import dataCoordsCSV from '../assets/csv/dataCoords.csv' // collums => arrays
// import dataForcesCSV from '../assets/csv/dataForces.csv'// collums => arrays

const appInit = async (files) => {
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
    data.addTimePoints(files.coords, files.forces, shipTranslations);
    
    // SIMULATION
    const simulation = new Simulation(1000,600, data);
    await simulation.init();
    simulation.registerController();
    await simulation.addShip(files.metaData.caseShip, true);
    await simulation.addHawsers(files.metaData.bolderData, files.metaData.hawserMeta);
    simulation.addFenders(files.metaData.fenderData, files.metaData.fenderMeta);
    simulation.drawCaseShip();
    simulation.play();
}

const filesHaveLoaded = (files) => {
    const keys = Object.keys(files);
    if (keys.includes('metaData') && keys.includes('forces') && keys.includes('coords')){
        appInit(files);
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

// create inputfields
const xlsxInput = document.createElement('input');
xlsxInput.setAttribute('type', 'file');
document.body.appendChild(xlsxInput);
const forcesInput = document.createElement('input');
forcesInput.setAttribute('type', 'file');
document.body.appendChild(forcesInput);
const coordsInput = document.createElement('input');
coordsInput.setAttribute('type', 'file');
document.body.appendChild(coordsInput);

const submit = document.createElement('button');
submit.setAttribute('type', 'button');
submit.innerHTML = 'SUBMIT';
document.body.appendChild(submit);

// detect when a file is selected
submit.onclick = (e) => {
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
        filesHaveLoaded(files)

        
    }
    const readerForces = new FileReader();
    readerForces.onload = (e) => {
        const data = e.target.result;
    
        // make file readable
        const forces = getParsedCSVData(data);

        // add to files object
        files.forces = forces;

        // check if all filess have been loaded
        filesHaveLoaded(files)
    }
    const readerCoords = new FileReader();
    readerCoords.onload = (e) => {
        const data = e.target.result;

        // make file readable
        const coords = getParsedCSVData(data);

        // add to files object
        files.coords = coords;

        // check if all filess have been loaded
        filesHaveLoaded(files)

    }
    readerXSLX.readAsBinaryString(xlsxInput.files[0])
    readerForces.readAsBinaryString(forcesInput.files[0])
    readerCoords.readAsBinaryString(coordsInput.files[0])
}