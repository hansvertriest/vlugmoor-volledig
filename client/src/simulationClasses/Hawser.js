export default class Hawser {
    constructor(bolderPosX, bolderPosY, forceLimit, limits) {
        this.bolderPosX = bolderPosX;
        this.bolderPosY = bolderPosY;
        this.forceLimit = forceLimit;
        this.limit = limits;

        this.posOnShipX = 0;
        this.posOnShipY = 0;
        this.currentLoad;

        // colors 
        this.orange = 'orange';
        this.green = 'green';
        this.red = 'red';
    }

    draw(simCtx) {
        // get coordinates
        const canvasCoordsBolder = simCtx.originToCanvasCoords(
            simCtx.meterToPx(this.bolderPosX), 
            simCtx.meterToPx(this.bolderPosY), 
        );
        const canvasCoordsHawser = simCtx.originToCanvasCoords(
            simCtx.meterToPx(this.posOnShipX), 
            simCtx.meterToPx(this.posOnShipY), 
        );

        simCtx.ctx.beginPath();
        simCtx.ctx.lineWidth = 2;
        simCtx.ctx.strokeStyle = this.getHawserColor();
        simCtx.ctx.moveTo(canvasCoordsBolder.x, canvasCoordsBolder.y);
        simCtx.ctx.lineTo(canvasCoordsHawser.x, canvasCoordsHawser.y);
        simCtx.ctx.stroke();
        simCtx.ctx.closePath();
    }

    setPosOnShipX(posX, amplification) {
        this.posOnShipX = posX;
    }

    setPosOnShipY(posY, amplification) {
        this.posOnShipY = posY;
    }

    setCurrentLoad(load) {
        this.currentLoad = load;
    }

    getHawserColor() {
        const ratio = this.currentLoad / this.forceLimit;
        if (ratio > this.limit.orange && ratio <= this.limit.red) {
            return this.orange;
        } else if ( ratio > this.limit.red) {
            return this.red;
        }
        return this.green;
    }
}