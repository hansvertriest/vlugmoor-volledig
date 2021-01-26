export default class Fender {
    constructor(id, simCtx, fenderPosX, fenderPosY, forceLimit, thickness, width, limits) {
        this.id = id;
        this.simCtx = simCtx;

        // Initiele waarden toewijzen
        this.posX = fenderPosX;
        this.posY = fenderPosY;
        this.loadRatio;

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

    /**
     * Voer alle teken-bewgingen uit om dit object op het canvas te tonen
     *      Meet info over het HTML5 canvas: https://developer.mozilla.org/nl/docs/Web/API/Canvas_API
     * @param {*} ctx Instantie van een SimulationContext
     */
    draw(ctx=this.simCtx.ctx) {
        // converteer meter naar pixels
        const posOnCanvas = this.simCtx.originToCanvasCoords(this.posX, this.posY, this.thicknessInM, 0);
        // zet kleur
        ctx.fillStyle = this.getFenderColor();
        // teken rechthoek
        ctx.fillRect(posOnCanvas.x, posOnCanvas.y, this.simCtx.meterToPx(this.widthInM), this.simCtx.meterToPx(this.thicknessInM))
    }

    /**
     * Zet huidige belasting
     * @param {*} force huidige belasting
     */
    setCurrentForce(force) {
        this.currentForce = force;
    }

    /**
     * Zet het moment dat de fender zal breken
     * @param {*} timePoint record nummer van het moment van breken
     */
    setBreakingTimePoint(timePoint) {
        this.breakingTimePoint = timePoint;
    }

    /**
     * Zet boolean of de fender reeds gebroken is
     * @param {*} hasBroken boolean
     */
    setHasBroken(hasBroken) {
        this.hasBroken = hasBroken;
    }

    /**
     * Zet de belasting van deze fender
     * @param {*} loadRatio belasting in percentage (huidige belading / max capaciteit)
     */
    setLoadRatio(loadRatio) {
        this.loadRatio = loadRatio;
    }

    /**
     * Return de kleur van de fender afhankelijk van de huidige belasting
     */
    getFenderColor() {
        if (this.hasBroken) return "blue";
        const ratio = this.loadRatio;
        if (ratio > this.limit.second && ratio <= this.limit.first) {
            return this.colorFirstLimit;
        } else if ( ratio > this.limit.first) {
            this.hasBroken = true;
            return this.colorSecondLimit;
        }
        return this.colorNoLimit;
    }
}