import kaaiImage from '../../assets/images/kaai.png'

export default class Kaai {
    constructor(originY, distanceFromOriginInM, widthInM) {
        this.distanceFromOriginInM = distanceFromOriginInM;

        this.widthInM = widthInM;
        
        this.image = new Image();
        this.image.src = kaaiImage;
        this.imageIsLoaded = false;
    }

    setPosX(posXInM) {
        this.posXInM = posXInM
    }

    setPosY(posYInM) {
        this.posYInM = posYInM
    }

    async loadImage() {
        return new Promise((resolve, reject) => {
            this.image.onload = function(){
                this.imageIsLoaded = true;
                console.log('Kaai image loaded');
                resolve();
            }.bind(this);
        });
    }

    draw(simCtx) {
        const posYInPx = simCtx.originY - simCtx.meterToPx(this.distanceFromOriginInM);
        const posXInPx = simCtx.originX - simCtx.meterToPx(this.widthInM/2)

        const width = simCtx.meterToPx(this.widthInM);
        const height = simCtx.canvas.height - posYInPx;


        // draw rectangle
        simCtx.ctx.fillStyle = "#D0D0D0";
        simCtx.ctx.fillRect(0, posYInPx, simCtx.canvas.width, height);

        // draw image
        const scaleFactor = width/this.image.width;
        const heightImage = this.image.height * scaleFactor;
        const widthImage = width;

        simCtx.ctx.drawImage(this.image, posXInPx, posYInPx, widthImage, heightImage);

        // check if screen is moved horizontallyy
        if (simCtx.originX !== 0) {
            // if moved to right
            const widthImageTwo =  (posXInPx > 0) ? widthImage*-1 : widthImage;
            
            // draw image 2
            simCtx.ctx.drawImage(this.image, posXInPx + widthImageTwo, posYInPx, widthImage, heightImage);
        }
    }
}