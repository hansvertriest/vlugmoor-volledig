export default class Fender {
    constructor(fenderPosX, fenderPosY, forceLimit, thickness, width, limits) {
        this.posX = fenderPosX;
        this.posY = fenderPosY;
        this.forceLimit = forceLimit;
        this.thicknessInM = thickness;
        this.widthInM = width;
        this.limit = limits;

        this.currentForce;

        // colors 
        this.colorFirstLimit = 'orange';
        this.colorNoLimit = 'green';
        this.colorSecondLimit = 'red';
    }

    draw(simCtx) {
        // Calculating pos with height=0 bc fenderOriginDefinition = x: widhth/2 y:0
        const posOnCanvas = simCtx.originToCanvasCoords(this.posX, this.posY, this.thicknessInM, 0);
        simCtx.ctx.fillStyle = this.getFenderColor();
        simCtx.ctx.fillRect(posOnCanvas.x, posOnCanvas.y, simCtx.meterToPx(this.widthInM), simCtx.meterToPx(this.thicknessInM))
    }

    setCurrentForce(force) {
        this.currentForce = force;
    }

    getFenderColor() {
        const ratio = this.currentForce / this.forceLimit;
        if (ratio > this.limit.second && ratio <= this.limit.first) {
            return this.colorFirstLimit;
        } else if ( ratio > this.limit.first) {
            return this.colorSecondLimit;
        }
        return this.colorNoLimit;
    }
}