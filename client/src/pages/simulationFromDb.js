import App from '../lib/App';
import {
    Data,
    MetaData
} from '../simulation/dataClasses';
import {
    Simulation
} from '../simulation/simulationClasses';
import Controls from '../simulation/simulationClasses/Controls';
import ApiService from '../lib/api/ApiService';
import Router from '../lib/core/Router';
// import AdvancedControls from '../simulation/simulationClasses/AdvancedControls';

const XLSX = require('xlsx');

const simulationTemplate = require('../templates/simulationServer.hbs');

export default () => {
    /**
     * 1. RENDER PAGE
     */
    const title = 'Simulation page';
    App.render(simulationTemplate({
        title
    }));
    let serverData;
    console.log('CHANGELOG: added option for no passingship')

    /**
     * 2. FUNCTIONS
     */

    // parameter id uit URL halen
    let str = window.location.hash;
    let id = str.replace('#!/simulation/', '');

    // functie voor zoeken naar data op de server
    /*
    const getDataFromServer = async (id) => {
        console.log(id);
        const apiService = new ApiService();
        const metaData = await apiService.findMetaDataById(id);
        const xlsx = await apiService.findFile(metaData.caseDataPath);
        const forces = await apiService.findFile(metaData.forcesPath);
        const coords = await apiService.findFile(metaData.coordsPath);
        const wind = await apiService.findFile(metaData.windPath);

        console.log(metaData);



        return metaData, coords, xlsx, forces, wind;
    };
    */




    // Functie voor het effectief initialiseren van de simulatie
    const appInit = async (simulation, files) => {
        // create Controls object
        const controls = new Controls(simulation);
        controls.registerBasicNav();
        controls.registerOutlineSwitch('switch-outline');
        controls.registerTimeLine();
        controls.registerScreenshotBttn('screenshot');
        controls.registerOutlineReset('reset-outline');

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
        data.addTimePoints(files.coords, files.forces, shipTranslations, files.wind)
            .catch(() => {
                alert("De opgegeven data kon niet correct worden verwerkt. Probeer het opnieuw")
            });
        // console.log(data.get())
        serverData = data.get();

        // Create advancedControls
        // const advancedControls = new Advancedgit push Controls();
        // advancedControls.addDataToHawsersTimeline(data, controls)
        // advancedControls.addDataToFendersTimeline(data, controls)

        // SIMULATION
        await simulation.addData(data);
        await simulation.init();
        simulation.drawShips();
        simulation.play();
    }

    // Functie die kijkt of alle vereiste bestanden ingeladen zijn. 
    // Zo ja, wordt de simulatie gestart via de functie appInit()
    const filesHaveLoaded = (simulation, files) => {
        const keys = Object.keys(files);
        if (keys.includes('metaData') && keys.includes('forces') && keys.includes('coords')) {
            appInit(simulation, files);
        }
    }

    // Functie voor het omzetten van een CSV naar een toegankelijker formaat.
    const getParsedCSVData = (data) => {
        const parsedData = [];

        const newLinebrk = data.split("\n");
        for (let i = 0; i < newLinebrk.length; i++) {
            parsedData.push(newLinebrk[i].split(","))
        }

        return parsedData;
    }

   /*
    * 3. BEGIN SCRIPT
    */
    // Inputs fields aanspreken

    const xlsxInput = document.getElementById('metadata-input');
    const forcesInput = document.getElementById('forces-input');
    const coordsInput = document.getElementById('coords-input');
    const windInput = document.getElementById('wind-input');

    // Toewijzen van dimensies en kleur aan het canvas-element
    const canvas = document.getElementById('simulation-canvas');
    const factor = (window.innerWidth / canvas.width) * 0.5 || (document.body.clientWidth / canvas.width) * 0.5
    canvas.setAttribute('width', (canvas.width * factor > 800) ? canvas.width * factor : 1000);
    canvas.setAttribute('height', (canvas.height * factor > 500) ? canvas.height * factor : 600);

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#c1e6fb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Luisteren naar wanneer een bestand wordt geupload en vervolgens de stijl van het element veranderen
    //      element.addEventListener(event, callback)
    //          Luistert naar een bepaalde 'event', in dit geval 'change', op een bepaald element en voert 
    //          een functie (arrow function) uit wanneer dit event gedetecteerd wordt
    xlsxInput.addEventListener('change', (e) => {
        const el = document.getElementById('metadata-input-label');
        const bg = document.getElementById('metadata-input-bg');
        if (e.target.files[0]) {
            el.innerHTML = e.target.files[0].name;
            el.parentElement.classList.add('custom-button--uploaded');
            bg.style.width = "100%";
        } else {
            el.parentElement.classList.remove('custom-button--uploaded');
            el.innerHTML = "Bestand kiezen";
            bg.style.width = "0";
        }
    });
    forcesInput.addEventListener('change', (e) => {
        const el = document.getElementById('forces-input-label');
        const bg = document.getElementById('forces-input-bg');
        if (e.target.files[0]) {
            el.innerHTML = e.target.files[0].name;
            el.parentElement.classList.add('custom-button--uploaded');
            bg.style.width = "100%";
        } else {
            el.parentElement.classList.remove('custom-button--uploaded');
            el.innerHTML = "Bestand kiezen";
            bg.style.width = "0";
        }
    });
    coordsInput.addEventListener('change', (e) => {
        const el = document.getElementById('coords-input-label');
        const bg = document.getElementById('coords-input-bg');
        if (e.target.files[0]) {
            el.innerHTML = e.target.files[0].name;
            el.parentElement.classList.add('custom-button--uploaded');
            bg.style.width = "100%";
        } else {
            el.parentElement.classList.remove('custom-button--uploaded');
            el.innerHTML = "Bestand kiezen";
            bg.style.width = "0";
        }
    });

    const deleteSimulation = async (id) => {

        const apiService = new ApiService();

        const serverMetaData = await apiService.findMetaDataById(id);
        
        await apiService.deleteFile(serverMetaData.forcesPath);
        await apiService.deleteFile(serverMetaData.coordsPath);
        await apiService.deleteFile(serverMetaData.windPath);
        await apiService.deleteFile(serverMetaData.caseDataPath);

        await apiService.deleteData(id);
        console.log('deleted simulation');

        //const router = new Router();

        //router.navigate('/home');
    };

    // Updaten van server data

    const updateServerData = async () => {

        // DOM aanspreken
    
        const submit = document.getElementById('submit');
        const title = document.getElementById('title-field');
        const description = document.getElementById('description-field');
        const date = document.getElementById('date-field');
        const picture = serverData.caseMetaData.caseShip.type;

        // metadata form ophalen
        const file = XLSX.read(new Uint8Array(xlsxInput.files[0]), {type: 'array'});
        // De xlsx wordt geformateerd naar een Metadata-object
        const metaData = new MetaData(file).get();

        const caseData = await apiService.storeDataFile(xlsxInput.files[0]);
        const forces = await apiService.storeDataFile(forcesInput.files[0]);
        const coords = await apiService.storeDataFile(coordsInput.files[0]);
        const wind = await apiService.storeDataFile(windInput.files[0]);

        const caseDataPath = caseData.path.replace('uploads/', '');
        const forcesPath = forces.path.replace('uploads/', '');
        const coordsPath = coords.path.replace('uploads/', '');
        const windPath = wind.path.replace('uploads/', '');




    };

    const setServerDataForm = () => {
        
    };

    // Functie die data van de server in de html zet

    const setTextWithServerData = (serverMetaData) => {

        // DOM aanspreken 
        const titleElement = document.getElementById('simulation-title');
        const dateElement = document.getElementById('simulation-date');
        const descriptionElement = document.getElementById('descrition-paragraph');

        const d = new Date(serverMetaData.date);
        const dateParsed = d.getDate()+ '/' + (d.getMonth()+1) + '/' + d.getFullYear();
        
        titleElement.innerHTML = serverMetaData.title;
        dateElement.innerHTML = dateParsed;  
        descriptionElement.innerHTML = serverMetaData.description;
    }; 

    // Simulatie data van de server halen en deze dan omzetten in leesbare data 
    // dan de simulatie starten

    const startSimulationWithServerData = async (id) => {

        // ApiService obj aanmaken 
        const apiService = new ApiService();

        // functies aanroepen om data van server te halen
        const serverMetaData = await apiService.findMetaDataById(id);
        const xlsxUnparsed = await apiService.findXlsx(serverMetaData.caseDataPath);
        const forcesUnparsed = await apiService.findCsv(serverMetaData.forcesPath);
        const coordsUnparsed = await apiService.findCsv(serverMetaData.coordsPath);
        const windUnparsed = await apiService.findCsv(serverMetaData.windPath);

 

        const file = XLSX.read(new Uint8Array(xlsxUnparsed), {type: 'array'});

        setTextWithServerData(serverMetaData);


        // Hier maken we een Simulation-object aan
        const canvasId = 'simulation-canvas';
        const simulation = new Simulation(canvasId);

        const files = {};

        // De xlsx wordt geformateerd naar een Metadata-object
        const metaData = new MetaData(file).get();

        // We voegen het metaData-object toe aan het files-object
        files.metaData = metaData;

        files.forces = getParsedCSVData(forcesUnparsed);
        files.coords = getParsedCSVData(coordsUnparsed);
        files.wind = getParsedCSVData(windUnparsed);
        
        appInit(simulation, files);

    }

    startSimulationWithServerData(id);

    // Ophalen van elementen ivm de popups
    // const upload = document.getElementById('upload');
    const openLoad = document.getElementById('open-load');
    const closeLoad = document.getElementById('close-load');
    const openUpload = document.getElementById('open-upload');
    const closeUpload = document.getElementById('close-upload');

    // Wanneer de upload button wordt aangeklikt
    //      => maak een ApiService aan en upload het bestand

    /*
    upload.addEventListener('click', () => {
        let apiService = new ApiService();
        let data = {
            data: serverData
        };
        if (serverData) {
            let title = document.getElementById('title-field').value;
            let description = document.getElementById('description-field').value;
            let date = document.getElementById('date-field').value;
            let picture = serverData.caseMetaData.caseShip.type;

            apiService.storeData(data)
                .then((response) => apiService.storeMetaData(title, description, date, picture, toString(response.id)));
        } else {
            alert('Gelieve eerst een simulatie op te laden.')
        }
    });

    */

    // Eventlisteners voor het openen en sluiten van de popups
    openLoad.addEventListener('click', (e) => {
        const loadPopup = document.getElementById('load-popup');
        loadPopup.style.display = 'flex';
    });

    closeLoad.addEventListener('click', (e) => {
        const loadPopup = document.getElementById('load-popup');
        loadPopup.style.display = 'none';
    });


    openUpload.addEventListener('click', (e) => {
        const loadPopup = document.getElementById('upload-popup');
        loadPopup.style.display = 'flex';
    });

    closeUpload.addEventListener('click', (e) => {
        const loadPopup = document.getElementById('upload-popup');
        loadPopup.style.display = 'none';
    });

    const deleteOpen = document.getElementById('delete-popup');
    deleteOpen.addEventListener('click', (e) => {
        deleteSimulation(id);
        console.log('deleted');
    });





};