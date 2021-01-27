export default class SimulationContext {
    constructor(canvasId) {
        // create canvas
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");

        // animation veriables
        this.meterToPxFactor = 1.5; // schaal van de simulatie
        this.animationTimeInterval = 10; // aantal records per seconde
        this.initFPS = 30; // aantal frames per seconde
        this.fps = this.initFPS;

        // options
        this.drawCaseShipOutline = true;

        this.originX = this.canvas.width*0.5;
        this.originY = this.canvas.height*0.85;

        this.backgroundColor = "#c1e6fb";
    }

    /**
     * Adjust this.meterToPxFactor with a delta
     * @param {*} delta number to increment this.meterToPxFactor with 
     */
    addToMeterToPxFactor(delta) {
        this.meterToPxFactor += delta;
    }

    /**
     * Verplaats het origin punt op het canvas
     * @param {*} posX x-coordinaat op de canvas
     * @param {*} posY y-coordinaat op de canvas
     */
    setOrigin(posX, posY) {
        this.originX = posX;
        this.originY = posY;
    }

    /**
     * Wijzig animationTimeInterval
     * @param {*} animationTimeInterval aantal records
     */
    setAnimationTimeInterval(animationTimeInterval) {
        this.animationTimeInterval = Math.round(animationTimeInterval);
    }

    /**
     * Verschuif het origin punt op de canvas
     * @param {*} offsetX verschil in x-coordinaat
     * @param {*} offsetY verschil in y-coordinaat
     */
    moveOrigin(offsetX, offsetY) {
        this.originX += offsetX;
        this.originY += offsetY;
    }

    /**
     * Converteer een afstand in meter naar pixels
     * @param {*} distance afstand in meter
     */
    meterToPx(distance) {
        return distance*this.meterToPxFactor;
    }

    /**
     * Converteer een afstand in pixels naar meter
     * @param {*} distance afstand in pixels
     */
    pxToMeter(distance) {
        return distance/this.meterToPxFactor;
    }

    /**
     * Vertaal een coordinaat-koppel uit het model relatief aan de origin naar een koppel op het canvas
     * @param {*} originCoordXInM x-coordinaat relatief aan het model-origin
     * @param {*} originCoordYInM y-coordinaat relatief aan het model-origin
     * @param {?} widthInM breedte van het object dat geplaatst wordt 
     * @param {?} heightinM hoogte van het object dat geplaatst wordt 
     */
    originToCanvasCoords(originCoordXInM, originCoordYInM, widthInM=0, heightinM=0) {
        const canvasCoordX =  this.originX + this.meterToPx(originCoordXInM) - (this.meterToPx(widthInM)/2);
        const canvasCoordY =  this.originY - this.meterToPx(originCoordYInM) - (this.meterToPx(heightinM)/2);

        return {
            x: canvasCoordX,
            y: canvasCoordY,
        }
    }

}