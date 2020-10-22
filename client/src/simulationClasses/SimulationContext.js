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

    originToCanvasCoords(originCoordX, originCoordY, width=0, height=0) {
        const canvasCoordX =  this.originX - originCoordX - (width/2);
        const canvasCoordY =  this.originY - originCoordY - (height/2);

        return {
            x: canvasCoordX,
            y: canvasCoordY,
        }
    }

}