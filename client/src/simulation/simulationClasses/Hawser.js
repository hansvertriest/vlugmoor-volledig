import bolderImage from '../../assets/images/bolder.png'

export default class Hawser {
    constructor(id, simCtx, bolderPosX, bolderPosY, limits) {
        this.id = id;
        this.simCtx = simCtx;
        this.bolderPosX = bolderPosX;
        this.bolderPosY = bolderPosY;
        this.limit = limits;

        // Initiele waarden toewijzen
        this.posOnShipX = 0;
        this.posOnShipY = 0;
        this.loadRatio;

        this.breakingTimePoint;
        this.hasBroken = false;

        this.bolderWidthInM = 5;
        this.bolderHeightInM = this.bolderWidthInM;

        // colors 
        this.colorFirstLimit = 'orange';
        this.colorNoLimit = 'green';
        this.colorSecondLimit = 'red';

        // Properties voor het laden van de afbeeldingen
        this.image = new Image();
        this.image.src = bolderImage;
        this.imageIsLoaded = false;
    }

    /**
     * Laad alle afbeeldingen
     */
    async loadImage() {
        return new Promise((resolve, reject) => {
            this.image.onload = function(){
                this.imageIsLoaded = true;
                console.log('Bolder image loaded');
                resolve();
            }.bind(this);
        });
    }

    /**
     * Voer alle teken-bewgingen uit om dit object op het canvas te tonen
     *      Meet info over het HTML5 canvas: https://developer.mozilla.org/nl/docs/Web/API/Canvas_API
     * @param {*} ctx een canvas-context
     */
    draw(ctx=this.simCtx.ctx) {
        // Converteer meter naar px
        const canvasCoordsBolderCenter = this.simCtx.originToCanvasCoords(
            this.bolderPosX, 
            this.bolderPosY, 
        );
        const canvasCoordsHawser = this.simCtx.originToCanvasCoords(
            this.posOnShipX, 
            this.posOnShipY, 
        );

        ctx.beginPath();

        // zet lijn kleur en stijl
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.getHawserColor();
        if (this.hasBroken) ctx.setLineDash([5]);

        // teken lijn
        ctx.moveTo(canvasCoordsBolderCenter.x, canvasCoordsBolderCenter.y);
        ctx.lineTo(canvasCoordsHawser.x, canvasCoordsHawser.y);
        ctx.stroke();

        ctx.closePath();

        // reset lines to solid (reset voor volgende frame)
        if (this.hasBroken) ctx.setLineDash([]);

        // teken de boldderImage hierbovenop
        const imageWidthInPx = this.simCtx.meterToPx(this.bolderWidthInM);
        const imageHeightInPx = this.simCtx.meterToPx(this.bolderHeightInM);

        const canvasCoordsBolderImage = this.simCtx.originToCanvasCoords(
            this.bolderPosX, 
            this.bolderPosY,
            this.bolderWidthInM, 
            this.bolderHeightInM,
        );

        ctx.drawImage(this.image, canvasCoordsBolderImage.x, canvasCoordsBolderImage.y, imageWidthInPx, imageHeightInPx);

    }

    /**
     * Zet x-positie van raakpunt tros met schip
     * @param {*} posX x-positie in meter
     */
    setPosOnShipX(posX, amplification) {
        this.posOnShipX = posX;
    }

    /**
     * Zet y-positie van raakpunt tros met schip
     * @param {*} posX y-positie in meter
     */
    setPosOnShipY(posY, amplification) {
        this.posOnShipY = posY;
    }

    /**
     * Zet de belasting van deze tros
     * @param {*} loadRatio belasting in percentage (huidige belading / max capaciteit)
     */
    setLoadRatio(loadRatio) {
        this.loadRatio = loadRatio;
    }

    /**
     * Zet het moment dat dee tros zal breken
     * @param {*} timePoint record nummer van het moment van breken
     */
    setBreakingTimePoint(timePoint) {
        this.breakingTimePoint = timePoint;
    }

    /**
     * Zet boolean of de tros reeds gebroken is
     * @param {*} hasBroken boolean
     */
    setHasBroken(hasBroken) {
        this.hasBroken = hasBroken;
    }

    /**
     * Return de kleur van de tros afhankelijk van de huidige belasting
     */
    getHawserColor() {
        // const ratio = this.currentLoad / this.forceMax;
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