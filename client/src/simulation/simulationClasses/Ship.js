import container400x63Big from '../../assets/images/container_400x63.png'
import container400x63BigMoving from '../../assets/images/container_400x63-moving.png'
import container400x63Outline from '../../assets/images/container_400x63-outline.png'


export default class Ship {
    constructor(type, width, length, distanceFromKaai) {
        this.width = width;
        this.length = length;
        this.distanceFromKaai = distanceFromKaai;
        this.posX = 0;
        this.posY = 0;
        this.initialPosX = this.posX;
        this.initialPosY = this.posY;
        this.rotationInDegrees = 0;
        
        this.displacementLimitToBeStaticInPx = 0.0001;


        this.type = type;
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

    draw(simCtx) {
        const length = simCtx.meterToPx(this.length);
        const width = simCtx.meterToPx(this.width);

        // Converteer meter naar px
        // 
        const posXInPx = simCtx.meterToPx(this.posX);
        const posYInPx = simCtx.meterToPx(this.posY);

        simCtx.ctx.save();

        // translate van context naar origin van de simulatie
        simCtx.ctx.translate(simCtx.originX, simCtx.originY);

        // roteer de context naar de hoek van het schip
        simCtx.ctx.rotate(this.rotationInDegrees);

        // draw orange placeholder
        // simCtx.ctx.fillStyle = 'orange';
        // simCtx.ctx.fillRect((posXInPx) - (length/2), (posYInPx) - (width/2), length, width)

        // draw image of ship
        simCtx.ctx.drawImage(this.image, (posXInPx*-1) - (length/2), (posYInPx*-1) - (width/2), length, width);

        // restore context
        simCtx.ctx.restore();
    }

    drawOutline(simCtx) {
        const length = simCtx.meterToPx(this.length);
        const width = simCtx.meterToPx(this.width);

        const coords = simCtx.originToCanvasCoords(this.initialPosX, this.initialPosY, this.length, this.width );
        // draw image of ship
        simCtx.ctx.drawImage(this.imageOutline, coords.x, coords.y, length, width);
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