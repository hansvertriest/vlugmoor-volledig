export default class SimulationContext {
    constructor(canvasId) {
        // create canvas
        this.canvas = document.getElementById(canvasId);
        // set responsive canvas width
        const factor =  (window.innerWidth / this.canvas.width)*0.5 || (document.body.clientWidth / this.canvas.width)*0.5
        this.canvas.setAttribute('width', (this.canvas.width * factor > 800) ? this.canvas.width * factor : 1000);
        this.canvas.setAttribute('height', (this.canvas.height * factor > 500) ? this.canvas.height * factor : 600);
        this.ctx = this.canvas.getContext("2d");

        // animation veriables
        this.meterToPxFactor = 1.5;
        this.animationTimeInterval = 10;
        this.initFPS = 30;
        this.fps = this.initFPS;

        // options
        this.drawCaseShipOutline = true;

        this.originX = this.canvas.width*0.5;
        this.originY = this.canvas.height*0.85;

    }

    addToMeterToPxFactor(delta) {
        this.meterToPxFactor += delta;
    }

    setOrigin(posX, posY) {
        this.originX = posX;
        this.originY = posY;
    }

    setAnimationTimeInterval(animationTimeInterval) {
        this.animationTimeInterval = Math.round(animationTimeInterval);
    }

    moveOrigin(offsetX, offsetY) {
        this.originX += offsetX;
        this.originY += offsetY;
    }

    meterToPx(distance) {
        return distance*this.meterToPxFactor;
    }

    pxToMeter(distance) {
        return distance/this.meterToPxFactor;
    }

    originToCanvasCoords(originCoordXInM, originCoordYInM, widthInM=0, heightinM=0) {
        const canvasCoordX =  this.originX + this.meterToPx(originCoordXInM) - (this.meterToPx(widthInM)/2);
        const canvasCoordY =  this.originY - this.meterToPx(originCoordYInM) - (this.meterToPx(heightinM)/2);

        return {
            x: canvasCoordX,
            y: canvasCoordY,
        }
    }

}