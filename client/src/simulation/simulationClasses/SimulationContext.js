export default class SimulationContext {
    constructor(width, height) {
        // create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('height', height.toString());
        this.canvas.setAttribute('width', width.toString());
        this.canvas.setAttribute('id', "animation-canvas");
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");

        this.meterToPxFactor = 2;

        this.originX = this.canvas.width*0.5;
        this.originY = this.canvas.height*0.6;
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
        const canvasCoordX =  this.originX - this.meterToPx(originCoordXInM) - (this.meterToPx(widthInM)/2);
        const canvasCoordY =  this.originY - this.meterToPx(originCoordYInM) - (this.meterToPx(heightinM)/2);

        return {
            x: canvasCoordX,
            y: canvasCoordY,
        }
    }

}