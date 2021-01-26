import App from '../lib/App';
import { Data, MetaData } from '../simulation/dataClasses';
import { Simulation } from '../simulation/simulationClasses';
import Controls from '../simulation/simulationClasses/Controls';
import ApiService from '../lib/api/ApiService';

const XLSX = require('xlsx');

const simulationTemplate = require('../templates/simulation.hbs');

export default () => {

    /**
     * 1. RENDER PAGE
     */
    const title = 'Simulation page';
    App.render(simulationTemplate({title}));
    let serverData;

    /**
     * 2. FUNCTIONS
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
        data.addTimePoints(files.coords, files.forces, shipTranslations)
            .catch(() => {
                alert("De opgegeven data kon niet correct worden verwerkt. Probeer het opnieuw")
            });
        console.log(data.get())
        serverData = data.get();
        
        // SIMULATION
        simulation.addData(data);
        await simulation.init();
        // simulation.registerController();
        await simulation.addShip(files.metaData.caseShip, true);
        await simulation.addShip(files.metaData.passingShip);
        await simulation.addHawsers(files.metaData.bolderData, files.metaData.hawserLimits, data.events.getHawserBreaks());
        simulation.addFenders(files.metaData.fenderData, files.metaData.fenderLimits, data.events.getFenderBreaks())
        simulation.drawShips();
        simulation.play();
    }
    
    // Functie die kijkt of alle vereiste bestanden ingeladen zijn. 
    // Zo ja, wordt de simulatie gestart via de functie appInit()
    const filesHaveLoaded = (simulation, files) => {
        const keys = Object.keys(files);
        if (keys.includes('metaData') && keys.includes('forces') && keys.includes('coords')){
            appInit(simulation, files);
        }
    }

    // Functie voor het omzetten van een CSV naar een toegankelijker formaat.
    const getParsedCSVData = (data) => {
        const parsedData = [];

        const newLinebrk = data.split("\n");
        for(let i = 0; i < newLinebrk.length; i++) {
            parsedData.push(newLinebrk[i].split(","))
        }

        return parsedData;
    }

    /**
     * 3. BEGIN SCRIPT
     */

    // Toewijzen van dimensies en kleur aan het canvas-element
    const canvas = document.getElementById('simulation-canvas');
    const factor =  (window.innerWidth / canvas.width)*0.5 || (document.body.clientWidth / canvas.width)*0.5
    canvas.setAttribute('width', (canvas.width * factor > 800) ? canvas.width * factor : 1000);
    canvas.setAttribute('height', (canvas.height * factor > 500) ? canvas.height * factor : 600);

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#c1e6fb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ophalen van input-elementen 
    const xlsxInput = document.getElementById('metadata-input');
    const forcesInput = document.getElementById('forces-input');
    const coordsInput = document.getElementById('coords-input');
    const submit = document.getElementById('submit');

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

    // Luister wanneer de submit button wordt aangeklikt en lees vervolgens de bestanden in.
    submit.addEventListener('click', (e) => {
        // De upload-popup wordt gesloten
        const loadPopup = document.getElementById('load-popup');
        loadPopup.style.display = 'none';

        // Hier maken we een Simulation-object aan
        const canvasId = 'simulation-canvas';
        const simulation = new Simulation(canvasId);

        const files = {};

        // We maken voor elk bestand een nieuw FilReader-object aan en 
        // definieren vervolgens wat er moet gebeuren als zo'n FileReader-object
        // een bestand heeft ingeladen.
        const readerXSLX = new FileReader();
        readerXSLX.onload = (e) => {
            try {
                const data = e.target.result;

                const file = XLSX.read(data, {type: 'binary'});

                // De xlsx wordt geformateerd naar een Metadata-object
                const metaData = new MetaData(file).get();

                // We voegen het metaData-object toe aan het files-object
                files.metaData = metaData;
    
                // Controlleer of alle bestanden zijn ingeladen, zo ja => start de simulatie
                filesHaveLoaded(simulation, files)
            } catch {
                alert("Er trad een fout op bij het inlezen van de metadata.")
            }
        }
        const readerForces = new FileReader();
        readerForces.onload = (e) => {
            const data = e.target.result;
        
            // Formatteer bestand
            const forces = getParsedCSVData(data);

            // We voegen de forces data toe aan het files-object
            files.forces = forces;

            // Controlleer of alle bestanden zijn ingeladen, zo ja => start de simulatie
            filesHaveLoaded(simulation, files)
        }
        const readerCoords = new FileReader();
        readerCoords.onload = (e) => {
            const data = e.target.result;

            // Formatteer bestand
            const coords = getParsedCSVData(data);

            // We voegen de coordinaat data toe aan het files-object
            files.coords = coords;

            // Controlleer of alle bestanden zijn ingeladen, zo ja => start de simulatie
            filesHaveLoaded(simulation, files)

        }

        try {
            // We laten elk FileReader-object het respectievelijke bestand inladen
            readerXSLX.readAsBinaryString(xlsxInput.files[0])
            readerForces.readAsBinaryString(forcesInput.files[0])
            readerCoords.readAsBinaryString(coordsInput.files[0])
        } catch {
            alert('Er ging iets fout bij het inladen van de bestanden. Probeer het opnieuw.');
        }
    });


    // Ophalen van elementen ivm de popups
    const upload = document.getElementById('upload');
    const openLoad = document.getElementById('open-load');
    const closeLoad = document.getElementById('close-load');
    const openUpload = document.getElementById('open-upload');
    const closeUpload = document.getElementById('close-upload');

    // Wanneer de upload button wordt aangeklikt
    //      => maak een ApiService aan en upload het bestand
    upload.addEventListener('click', () => {
        let apiService = new ApiService();
        let data = {data: serverData};
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

};
