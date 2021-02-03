import * as C2S from 'canvas2svg';

import Ship from "./Ship";
import Hawser from "./Hawser";
import Fender from "./Fender";
import SimulationContext from "./SimulationContext";
import Kaai from "./Kaai";
import LoadingScreen from './LoadingScreen';
import Wind from './Wind';

export default class Simulation {
    constructor( canvasId ) {
        this.simCtx = new SimulationContext(canvasId);
        this.canvas = this.simCtx.canvas;
        this.ctx = this.simCtx.ctx;
        this.SVGctx = new C2S(this.canvas.width, this.canvas.height)


        this.originX = this.canvas.width/2;
        this.originY = this.canvas.height/2;

        this.animationTime = 0;
        this.animationPlaying = false;

        this.caseData;
        this.timePointCount;

        // variables for improving visual message
        this.translationAmplifierFactor = 1;

        // ships
        this.caseShip;
        this.passingShips = [];

        // hawser data 
        this.hawserArray = [];
        this.fenderArray = [];

        // wind-wijzer
        this.wind;

        // loading
        this.loadingScreen = new LoadingScreen(this.simCtx);
        window.requestAnimationFrame(this.doLoading.bind(this));

        // subscriptions
        this.onAnimationTimeCallback = [];

        // fps controlling
        this.fpsIntervalInMilS = 1000 / this.simCtx.fps;
        this.frameCount = 0;
        this.calculatedFPS;
        this.lastFrameTimeStamp;
        this.currentFrameTimeStamp;
    }


    /*
        GENERAL
    */

    /**
     * De simulatie initieren
     */
    async init() {
        this.setBackgroundColor();
        await this.addKaai();
    }

    /**
     * Data toevoegen aan de simulatie
     * @param {*} data object van het type Data (/DataClasses/Data.js)
     */
    async addData(data) {
        this.caseData = data;
        this.timePointCount = data.timePoints.length;
        this.timePointInterval = data.caseMetaData.timePointInterval

        // Voeg caseShip toe aan simulation als het bestaat
        if (this.caseData.caseMetaData && this.caseData.caseMetaData.caseShip) {
            await this.addShip(this.caseData.caseMetaData.caseShip, true);
        }

        // Voeg passingShip toe aan simulation als het bestaat
        if (this.caseData.caseMetaData && this.caseData.caseMetaData.passingShip.present) {
            await this.addShip(this.caseData.caseMetaData.passingShip);
        }

        // Voeg bolderData toe aan simulation als het bestaat
        if (this.caseData.caseMetaData && this.caseData.caseMetaData.bolderData) {
            await this.addHawsers(this.caseData.caseMetaData.bolderData, this.caseData.caseMetaData.hawserLimits, this.caseData.events.hawserBreaks);
        }

        // Voeg fenderData toe aan simulation als het bestaat
        if (this.caseData.caseMetaData && this.caseData.caseMetaData.fenderData) {
            this.addFenders(this.caseData.caseMetaData.fenderData, this.caseData.caseMetaData.fenderLimits, this.caseData.events.fenderBreaks);
        }

        // Voeg wind-wijzer toe aan simulation als er wind info aanwezig is
        if (this.caseData.caseMetaData && this.caseData.caseMetaData.wind.present) {
           await this.addWind(this.caseData.caseMetaData.wind.directionInDegrees, this.caseData.caseMetaData.wind.speedInMPerS);
        }
    }

    /**
     * Haal algemene info over de huidige staat van de simulatie op
     */
    getSimInfo() {
        return {
            timePoint: this.animationTime,
            timePointInPercentage: this.animationTime / this.timePointCount,
            calculatedFPS: this.calculatedFPS,
            speed: this.getAnimationSpeed(),
        }
    }

    /**
     * Start/unpause simulatie
     */
    play() {
        this.animationPlaying = true;

        this.startTimeStamp = performance.now();
    }

    /**
     * Pauzeer simulatie
     */
    pause() {
        this.animationPlaying = false;
    }

    /**
     * Toggle tussen play en pause
     */
    switchPlayPause() {
        this,this.animationPlaying = !this.animationPlaying;
    }

    /**
     * Neem een screenshot van het canvas
     */
    getScreenshot() {
        // create png
        const img = this.canvas.toDataURL("image/png");

        // download png
        const element = document.createElement('a');
        element.setAttribute('href', img);
        element.setAttribute('download', 'file.png');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    /*
        SETTING EN GETTING ANIMATION TIME
    */

    /**
     * Zet de simulatie naar vorige frame
     */
    setPreviousAnimationTime() {
        this.setNextAnimationTimeToSpecificTimepoint(this.animationTime - this.simCtx.animationTimeInterval);

        // callback functies die bij elke aanpassing aan de tijd uitgevoerd moeten worden
        //      (Essentieel voor communicatie met de tijdlijn)
        if (this.onAnimationTimeCallback.length) {
            this.onAnimationTimeCallback.forEach((callback) => callback(this.getSimInfo()))
        }
    }

    /**
     * Zet de simulatie naar volgende frame
     */
    setNextAnimationTime() {
        this.setNextAnimationTimeToSpecificTimepoint(this.animationTime + this.simCtx.animationTimeInterval);

        // callback functies die bij elke aanpassing aan de tijd uitgevoerd moeten worden
        //      (Essentieel voor communicatie met de tijdlijn)
        if (this.onAnimationTimeCallback.length) {
            this.onAnimationTimeCallback.forEach((callback) => callback(this.getSimInfo()))
        }
    }

    /**
     * Zet de animatie naar een specifiek tijdspunt (record-nr)
     * @param {*} timepoint 
     */
    setNextAnimationTimeToSpecificTimepoint(timepoint) {
        // indien timepoint niet overeenkomt met een frame, rond deze timepoint af naar het eerst volgende frame 
        if (timepoint%this.simCtx.animationTimeInterval > 0){
            timepoint += this.simCtx.animationTimeInterval - (timepoint%this.simCtx.animationTimeInterval);
        }

        this.animationTime = timepoint;

        this.updateSimulation();

        // callback functies die bij elke aanpassing aan de tijd uitgevoerd moeten worden
        //      (Essentieel voor communicatie met de tijdlijn)
        if (this.onAnimationTimeCallback.length) {
            this.onAnimationTimeCallback.forEach((callback) => callback(this.getSimInfo()))
        }
    }

    /**
     * Get volgende animationTimePoint
     */
    getNextAnimationTime() {
        return this.animationTime + this.simCtx.animationTimeInterval;
    }



    /*
        COMPONENTEN MAKEN EN TOEVOEGEN AAN DE SIMULATIE
    */

    /**
     * Maak kaai-object en voeg toe aan simulatie
     */
    async addKaai() {
        this.kaai = new Kaai(
            this.simCtx, 
            this.caseData.caseMetaData.caseShip.distanceFromKaai,
            this.simCtx.pxToMeter(this.canvas.width)
        );
        await this.kaai.loadImage();
    }

    /**
     * Maak een Ship-object en voeg het toe aan de simulatie
     * @param {*} shipInfo ShipData uit het MetaData-object
     * @param {*} isCaseShip Boolean of het aan te maken schip he schip is waar de simulatie om draait
     */
    async addShip(shipInfo, isCaseShip=false) {
        // Als het schip niet de caseShip is maak extra paramter-object aan voor een passingShip
        const paramsPassingShip = (isCaseShip) 
            ? {} 
            : {
                posX:  shipInfo.startXCoord,
                posY: this.caseShip.width/2 + shipInfo.deltaYShips + shipInfo.width/2,
                direction: shipInfo.direction,
                speedInMPerS: shipInfo.speedInMPerS,
            }

        // Indien caseShip, maak parameters voor de outline van het schip
        const paramsOutline = (isCaseShip)
            ? {
                posX: this.caseData.timePoints[shipInfo.startContourTimePoint].shipData.posX,
                posY: this.caseData.timePoints[shipInfo.startContourTimePoint].shipData.posY,
                rotation: this.caseData.timePoints[shipInfo.startContourTimePoint].shipData.rotation,
            } : {}

        // Maak schip aan
        const newShip = new Ship(
            this.simCtx,
            shipInfo.type, 
            shipInfo.width, 
            shipInfo.length, 
            shipInfo.distanceFromKaai,
            paramsOutline,
            paramsPassingShip
        );

        // Voeg toe aan de simulatie
        if (isCaseShip) {
            this.caseShip = newShip;
            await this.caseShip.loadImage();
        } else {
            this.passingShips.unshift(newShip);
            await this.passingShips[0].loadImage();
        }
    }

    /**
     * Maak fenders aan en voeg ze toe aan de simulatie
     * @param {*} fenderData fenderData uit MetaData-object
     * @param {*} fenderLimits fenderLimits uit MetaData-object
     * @param {*} fenderBreakingPoints breekpunten van de fender uit EventCollection.getFenderBreaks()
     */
    addFenders(fenderData, fenderLimits, fenderBreakingPoints=[]) {
        // loop over all fenders en voeg een Fender-object toe aan fenderArray
        fenderData.forEach((fender) => {
            const newFender = new Fender(
                fender.id,
                this.simCtx,
                fender.posX,
                fender.posY,
                fender.forceMax,
                fenderLimits.thicknessInM,
                fenderLimits.widthInM,
                {
                    first: fenderLimits.first,
                    second: fenderLimits.second,
                }
            );
            this.fenderArray.push(newFender);
        });

        // assign a breakingTimePoint to fenders
        fenderBreakingPoints.forEach((fenderBreakingPoint) => {
            this.fenderArray[fenderBreakingPoint.id].setBreakingTimePoint(fenderBreakingPoint.timePointIndex);
        })
    }

    /**
     * Maak trossen aan en voeg ze toe aan de simulatie
     * @param {*} bolderData bolderData uit MetaData-object
     * @param {*} hawserLimits hawserLimits uit MetaData-object
     * @param {*} hawserBreakingTimePoints breekpunten van de fender uit EventCollection.getFenderBreaks()
     */
    async addHawsers(bolderData, hawserLimits, hawserBreakingTimePoints=[]) {
        return new Promise((resolve, reject) => {
            // loop over alle bolders en voeg een Hawser-object toe aan hawserArray
            bolderData.forEach((bolder, index) => {
                const hawser = new Hawser(
                    index,
                    this.simCtx,
                    bolder.posX,
                    bolder.posY,
                    hawserLimits
                );
                this.hawserArray.push(hawser);
            });

            // assign a breakingTimePoint to hawsers
            hawserBreakingTimePoints.forEach((hawserBreakingTimePoint) => {
                this.hawserArray[hawserBreakingTimePoint.id].setBreakingTimePoint(hawserBreakingTimePoint.timePointIndex);
                
            });


            // laad de afbeeldingen van de trossen
            this.hawserArray.forEach(async(hawser) => {
                await hawser.loadImage();

                // als laatste tros-afbeelding is geladen
                if(this.hawserArray[this.hawserArray.length-1].imageIsLoaded) {
                    resolve();
                }
            });            
        });
    }

    /**
     * Maak een wind object aan
     * @param {*} direction richting waarin de wind blaast
     * @param {*} speedInMPerS snelheid van de wind
     */
    async addWind( direction, speedInMPerS) {
        this.wind = new Wind(this.simCtx, direction, speedInMPerS);
        console.log(this.wind);
        await this.wind.loadImage();
    }

    /*
        TEKENEN VAN DE COMPONENTEN OP DE CANVAS
    */

    /**
     * Zet de achtergrond-kleur van de simulatie
     * @param {*} color CSS-kleur
     */
    setBackgroundColor(color=this.simCtx.backgroundColor) {
        this.simCtx.backgroundColor = color;
        this.ctx.fillStyle = this.simCtx.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Teken alle fenders op het canvas
     * @param {*} ctx een canvas-context (=/= SimulationContext)
     */
    drawFenders(ctx) {
        this.fenderArray.forEach((fender) => {
            fender.draw(ctx)
        });
    }

    /**
     * Teken alle trossen op het canvas
     * @param {*} ctx een canvas-context (=/= SimulationContext)
     */
    drawHawsers(ctx) {
        this.hawserArray.forEach((hawser) => {
            hawser.draw(ctx)
        });
    }

    /**
     * Teken de kaai op het canvas
     * @param {*} ctx een canvas-context (=/= SimulationContext)
     */
    drawKaai(ctx) {
        this.kaai.draw(ctx);
    }

    /**
     * Teken alle schepen op het canvas
     * @param {*} ctx een canvas-context (=/= SimulationContext)
     */
    drawShips(ctx) {
        this.caseShip.draw(ctx);
        if (this.passingShips) {
            this.passingShips.forEach((passingShip) => {
                passingShip.draw(ctx);
            });
        }
    }

    /**
     * Teken de kaai op het canvas
     * @param {*} ctx een canvas-context (=/= SimulationContext)
     */
    drawWind(ctx) {
        this.wind.draw(ctx);
    }

    /*
        SNELHEID VAN DE ANIMATIE CONTROLEREN
    */

    /**
     * Check of het tijd is om een nieuwe frame te renderen
     */
    fpsIntervalIsElapsed() {
        this.currentFrameTimeStamp = performance.now();
        if (!this.lastFrameTimeStamp) return true;

        // calculate fps 
        //      Als de tijd tussen de het begin van deze seecondeeme en nu groters is dan 1s
        //          => fps = frameCount
        //          => reset frameCount
        //          => reset startTimeStamp
        if (this.currentFrameTimeStamp - this.startTimeStamp > 1000) {
            this.calculatedFPS = this.frameCount;
            this.frameCount = 0;
            this.startTimeStamp = this.currentFrameTimeStamp;
        }
        
        // Als de tijd voor 1 frame kleiner is dan dee tijd van het begin van de seconde tot nu
        //      => het is tijd voor een nieuwe frame => this.framCount += 1
        if (this.fpsIntervalInMilS < this.currentFrameTimeStamp - this.lastFrameTimeStamp) {
            this.frameCount +=1;
        }

        // return if fpsIntervalHasElapsed
        return this.fpsIntervalInMilS < this.currentFrameTimeStamp - this.lastFrameTimeStamp;
    }

    /**
     * Bereken de snelheid van de animatie
     */
    getAnimationSpeed() {
        return this.simCtx.fps * this.timePointInterval * this.simCtx.animationTimeInterval;
    }

    /**
     * Update fps
     * @param {*} fps aantal frames die per seconde getoond worden
     */
    setFPS(fps) {
        this.simCtx.fps = fps;
        this.fpsIntervalInMilS = 1000 / this.simCtx.fps;
    }

    /*
        ANIMATIE LOOPS
    */

    /**
     * Laat het laad-scherm zien
     */
    doLoading() {
        if (!this.animationPlaying) {
            // clear screen
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // draw on canvas
            this.setBackgroundColor();
            this.loadingScreen.draw();
            window.requestAnimationFrame(this.doLoading.bind(this));
        } else {
            window.requestAnimationFrame(this.doAnimation.bind(this));
        }
    }

    /**
     * Voer alle aanpassingen aan de simulatie-componenten uit zoals positie, rotatie, belasting...
     */
    updateSimulation() {
        // get timePoint
        const timePoint = this.caseData.timePoints[this.animationTime];

        // update caseShip parameters
        this.caseShip.setPosX(timePoint.shipData.posX*this.translationAmplifierFactor);
        this.caseShip.setPosY(timePoint.shipData.posY*this.translationAmplifierFactor);
        this.caseShip.rotationInDegrees = timePoint.shipData.rotation*this.translationAmplifierFactor;

        // update passingShip parameters
        this.passingShips.forEach((passingShip) => {
            passingShip.applySpeedDisplacement(this.animationTime*this.timePointInterval);
        });

        // update hawsers parameters
        this.hawserArray.forEach((hawser,index) => {
            hawser.setPosOnShipX(timePoint.hawserData[index].posXShip, this.translationAmplifierFactor);
            hawser.setPosOnShipY(timePoint.hawserData[index].posYShip, this.translationAmplifierFactor);
            hawser.setLoadRatio(timePoint.hawserData[index].loadRatio);
            hawser.setHasBroken(hawser.breakingTimePoint < this.animationTime);
        });

        // update fender currentforce
        this.fenderArray.forEach((fender, index) => {
            fender.setCurrentForce(timePoint.fenderData[index].force);
            fender.setLoadRatio(timePoint.fenderData[index].force/timePoint.fenderData[index].forceMax);
        });


    }

    /**
     * De loop waar voor elke frame oa alle draw-methods wordeen aangeroepen
     * @param {*} time huidig record-nr
     */
    doAnimation(time) {
        // check of animatie afgelopen is
        if (this.getNextAnimationTime() >= this.caseData.timePoints.length) {
            this.pause();
        } else 
        // anders kijk of de animatie aan heeeet lopen is en of het reeds tijd is om een nieuwe frame te tekenen
        if (this.animationPlaying && this.fpsIntervalIsElapsed()) {
            // update alle elementeen of the simulation
            this.updateSimulation();

            // update de animationTime
            this.setNextAnimationTime();

            // set lastFrameTimeStamp to now
            this.lastFrameTimeStamp = time;

            // clear screen
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // drawElements
        this.setBackgroundColor();
        // this.caseShip.drawShadow();
        this.drawKaai();
        this.drawShips();
        this.drawHawsers();
        this.drawFenders();
        if (this.wind) {
            this.drawWind();
        }
        if (this.simCtx.drawCaseShipOutline) this.caseShip.drawOutline();

        // hoe dee loop in stand    
        window.requestAnimationFrame(this.doAnimation.bind(this));
    }
}