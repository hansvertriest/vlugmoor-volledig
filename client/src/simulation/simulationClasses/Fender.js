export default class Fender {
    constructor(simCtx, fenderPosX, fenderPosY, forceLimit, thickness, width, limits) {
        this.simCtx = simCtx;
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

    draw() {
        // Calculating pos with height=0 bc fenderOriginDefinition = x: widhth/2 y:0
        const posOnCanvas = this.simCtx.originToCanvasCoords(this.posX, this.posY, this.thicknessInM, 0);
        this.simCtx.ctx.fillStyle = this.getFenderColor();
        this.simCtx.ctx.fillRect(posOnCanvas.x, posOnCanvas.y, this.simCtx.meterToPx(this.widthInM), this.simCtx.meterToPx(this.thicknessInM))
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