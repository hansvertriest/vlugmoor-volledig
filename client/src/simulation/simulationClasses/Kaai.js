import kaaiImage from '../../assets/images/kaai.png'

export default class Kaai {
    constructor(simCtx, distanceFromOriginInM, widthInM) {
        this.simCtx = simCtx;
        this.distanceFromOriginInM = distanceFromOriginInM;
        this.widthInM = widthInM;
        
        // Properties voor het laden van de afbeeldingen
        this.image = new Image();
        this.image.src = kaaiImage;
        this.imageIsLoaded = false;
    }

    /**
     * Laad alle afbeeldingen
     */
    async loadImage() {
        return new Promise((resolve, reject) => {
            this.image.onload = function(){
                this.imageIsLoaded = true;
                console.log('Kaai image loaded');
                resolve();
            }.bind(this);
        });
    }

    /**
     * Voer alle teken-bewgingen uit om dit object op het canvas te tonen
     *      Meet info over het HTML5 canvas: https://developer.mozilla.org/nl/docs/Web/API/Canvas_API
     * @param {*} ctx Instantie van een SimulationContext
     */
    draw(ctx=this.simCtx.ctx) {
        // Converteer meter naar px
        const posYInPx = this.simCtx.originY - this.simCtx.meterToPx(this.distanceFromOriginInM);
        const posXInPx = this.simCtx.originX - this.simCtx.meterToPx(this.widthInM/2)
        const width = this.simCtx.meterToPx(this.widthInM);
        const height = this.simCtx.canvas.height - posYInPx;


        // teken rechthoek
        ctx.fillStyle = "#D0D0D0";
        ctx.fillRect(0, posYInPx, this.simCtx.canvas.width, height);

        // teken afbeeldeing
        const scaleFactor = width/this.image.width;
        const heightImage = this.image.height * scaleFactor;
        const widthImage = width;

        ctx.drawImage(this.image, posXInPx, posYInPx, widthImage, heightImage);

        // check if screen is moved horizontallyy
        if (this.simCtx.originX !== 0) {
            // if moved to right
            const widthImageTwo =  (posXInPx > 0) ? widthImage*-1 : widthImage;
            
            // draw image 2
            ctx.drawImage(this.image, posXInPx + widthImageTwo, posYInPx, widthImage, heightImage);
        }
    }

    /**
     * Zet x-positie
     * @param {*} posX x-positie in meter
     */
    setPosX(posXInM) {
        this.posXInM = posXInM
    }

    /**
     * Zet y-positie
     * @param {*} posX y-positie in meter
     */
    setPosY(posYInM) {
        this.posYInM = posYInM
    }

}