export default class SimulationContext {
    constructor(canvasId) {
        // create canvas
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");

        // animation veriables
        this.meterToPxFactor = 1.5;
        this.animationTimeInterval = 10;
        this.timePointCount = 10000;
        this.timePointInterval = 0.1

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