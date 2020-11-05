import container400x63Big from '../../assets/images/container_400x63.png'
import container400x63BigMoving from '../../assets/images/container_400x63-moving.png'
import container400x63Outline from '../../assets/images/container_400x63-outline.png'


export default class Ship {
    constructor(simCtx, type, width, length, distanceFromKaai) {
        this.simCtx = simCtx;
        this.type = type;
        this.width = width;
        this.length = length;
        this.distanceFromKaai = distanceFromKaai;
        this.posX = 0;
        this.posY = 0;
        this.initialPosX = this.posX;
        this.initialPosY = this.posY;
        this.rotationInDegrees = 0;
        
        this.displacementLimitToBeStaticInPx = 0.0001;


        this.image;

        this.imageStatic = new Image();
        this.imageStatic.src = container400x63Big;
        this.imageStaticIsLoaded = false;

        this.imageMoving = new Image();
        this.imageMoving.src = container400x63BigMoving;
        this.imageMovingIsLoaded = false;

        this.imageOutline = new Image();
        this.imageOutline.src = container400x63Outline;
        this.imageOutlineIsLoaded = false;
    }

    async loadImage() {
        return new Promise((resolve, reject) => {
            this.imageStatic.onload = function(){
                this.imageStaticIsLoaded = true;
                console.log('Ship imageStatic loaded');
                if (this.imageStaticIsLoaded && this.imageMovingIsLoaded && this.imageOutlineIsLoaded) {
                    // if both are loaded set image to static image
                    this.setImageToStatic();
                    resolve();
                }
            }.bind(this);

            this.imageMoving.onload = function(){
                this.imageMovingIsLoaded = true;
                console.log('Ship imageMoving loaded');
                if (this.imageStaticIsLoaded && this.imageMovingIsLoaded && this.imageOutlineIsLoaded) {
                    this.setImageToStatic();
                    resolve();
                }
            }.bind(this);

            this.imageOutline.onload = function(){
                this.imageOutlineIsLoaded = true;
                console.log('Ship imageMoving loaded');
                if (this.imageStaticIsLoaded && this.imageMovingIsLoaded && this.imageOutlineIsLoaded) {
                    this.setImageToStatic();
                    resolve();
                }
            }.bind(this);
        });
    }

    draw() {
        const length = this.simCtx.meterToPx(this.length);
        const width = this.simCtx.meterToPx(this.width);

        // Converteer meter naar px
        // 
        const posXInPx = this.simCtx.meterToPx(this.posX);
        const posYInPx = this.simCtx.meterToPx(this.posY);

        this.simCtx.ctx.save();

        // translate van context naar origin van de simulatie
        this.simCtx.ctx.translate(this.simCtx.originX, this.simCtx.originY);

        // roteer de context naar de hoek van het schip
        this.simCtx.ctx.rotate(this.rotationInDegrees);

        // draw orange placeholder
        // this.simCtx.ctx.fillStyle = 'orange';
        // this.simCtx.ctx.fillRect((posXInPx) - (length/2), (posYInPx) - (width/2), length, width)

        // draw image of ship
        this.simCtx.ctx.drawImage(this.image, (posXInPx*-1) - (length/2), (posYInPx*-1) - (width/2), length, width);

        // restore context
        this.simCtx.ctx.restore();
    }

    drawShadow() {
        const length = this.simCtx.meterToPx(this.length);
        const width = this.simCtx.meterToPx(this.width);

        // Converteer meter naar px
        // 
        const posXInPx = this.simCtx.meterToPx(this.posX);
        const posYInPx = this.simCtx.meterToPx(this.posY);

        this.simCtx.ctx.save();

        // translate van context naar origin van de simulatie
        this.simCtx.ctx.translate(this.simCtx.originX, this.simCtx.originY);

        // roteer de context naar de hoek van het schip
        this.simCtx.ctx.rotate(this.rotationInDegrees * -1);

        // draw orange placeholder
        this.simCtx.ctx.fillStyle = 'rgba(7, 60, 145, 0.4)';
        this.simCtx.ctx.fillRect((posXInPx) - (length/2), (posYInPx) - (width/2), length, width)

        // restore context
        this.simCtx.ctx.restore();
    }

    drawOutline() {
        const length = this.simCtx.meterToPx(this.length);
        const width = this.simCtx.meterToPx(this.width);

        const coords = this.simCtx.originToCanvasCoords(this.initialPosX, this.initialPosY, this.length, this.width );
        // draw image of ship
        this.simCtx.ctx.drawImage(this.imageOutline, coords.x, coords.y, length, width);
    }

    setImageToMoving(){
        this.image = this.imageMoving;
    }
    setImageToStatic(){
        this.image = this.imageStatic;
    }

    setPosX(posX) {
        this.posX = posX;
        if(Math.abs(this.posX - posX) > this.displacementLimitToBeStaticInPx ) {
            console.log('is moving!')
            this.setImageToMoving();
        }
    }

    setPosY(posY) {
        this.posY = posY;
    }
}