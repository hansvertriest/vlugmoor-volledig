import bolderImage from '../../assets/images/bolder.png'

export default class Hawser {
    constructor(bolderPosX, bolderPosY, forceMax, limits) {
        this.bolderPosX = bolderPosX;
        this.bolderPosY = bolderPosY;
        this.forceMax = forceMax;
        this.limit = limits;

        this.posOnShipX = 0;
        this.posOnShipY = 0;
        this.currentLoad;

        this.hasBroken = false;

        this.bolderWidthInM = 5;
        this.bolderHeightInM = this.bolderWidthInM;

        // colors 
        this.colorFirstLimit = 'orange';
        this.colorNoLimit = 'green';
        this.colorSecondLimit = 'red';

        this.image = new Image();
        this.image.src = bolderImage;
        this.imageIsLoaded = false;
    }

    async loadImage() {
        return new Promise((resolve, reject) => {
            this.image.onload = function(){
                this.imageIsLoaded = true;
                console.log('Bolder image loaded');
                resolve();
            }.bind(this);
        });
    }

    draw(simCtx) {
        // get coordinates
        const canvasCoordsBolderCenter = simCtx.originToCanvasCoords(
            this.bolderPosX, 
            this.bolderPosY, 
        );
        const canvasCoordsHawser = simCtx.originToCanvasCoords(
            this.posOnShipX, 
            this.posOnShipY, 
        );

        simCtx.ctx.beginPath();
        simCtx.ctx.lineWidth = 2;
        simCtx.ctx.strokeStyle = this.getHawserColor();
        if (this.hasBroken) simCtx.ctx.setLineDash([5]);
        simCtx.ctx.moveTo(canvasCoordsBolderCenter.x, canvasCoordsBolderCenter.y);
        simCtx.ctx.lineTo(canvasCoordsHawser.x, canvasCoordsHawser.y);
        simCtx.ctx.stroke();
        simCtx.ctx.closePath();

        // reset lines to solid
        if (this.hasBroken) simCtx.ctx.setLineDash([]);

        // draw bolderImage
        const imageWidthInPx = simCtx.meterToPx(this.bolderWidthInM);
        const imageHeightInPx = simCtx.meterToPx(this.bolderHeightInM);

        const canvasCoordsBolderImage = simCtx.originToCanvasCoords(
            this.bolderPosX, 
            this.bolderPosY,
            this.bolderWidthInM, 
            this.bolderHeightInM,
        );

        simCtx.ctx.drawImage(this.image, canvasCoordsBolderImage.x, canvasCoordsBolderImage.y, imageWidthInPx, imageHeightInPx);

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
        const ratio = this.currentLoad / this.forceMax;
        if (ratio > this.limit.second && ratio <= this.limit.first) {
            return this.colorFirstLimit;
        } else if ( ratio > this.limit.first) {
            this.hasBroken = true;
            return this.colorSecondLimit;
        }
        return this.colorNoLimit;
    }
}