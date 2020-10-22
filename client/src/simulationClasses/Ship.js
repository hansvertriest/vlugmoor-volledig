import containerBig from '../../assets/images/container_400_63.png'
import containerBigMoving from '../../assets/images/container_400_63-moving.png'


export default class Ship {
    constructor(type, width, length, distanceFromKaai) {
        this.width = width;
        this.length = length;
        this.distanceFromKaai = distanceFromKaai;
        this.posX = 0;
        this.posY = 0;
        this.rotationInDegrees = 0;
        
        this.displacementLimitToBeStaticInPx = 0.0001;


        this.type = type;
        this.image;

        this.imageStatic = new Image();
        this.imageStatic.src = containerBig;
        this.imageStaticIsLoaded = false;

        this.imageMoving = new Image();
        this.imageMoving.src = containerBigMoving;
        this.imageMovingIsLoaded = false;
    }

    async loadImage() {
        return new Promise((resolve, reject) => {
            this.imageStatic.onload = function(){
                this.imageStaticIsLoaded = true;
                console.log('Ship imageStatic loaded');
                if (this.imageStaticIsLoaded && this.imageMovingIsLoaded) {
                    // if both are loaded set image to static image
                    this.setImageToStatic();
                    resolve();
                }
            }.bind(this);

            this.imageMoving.onload = function(){
                this.imageMovingIsLoaded = true;
                console.log('Ship imageMoving loaded');
                if (this.imageStaticIsLoaded && this.imageMovingIsLoaded) {
                    this.setImageToStatic();
                    resolve();
                }
            }.bind(this);
        });
    }

    draw(simCtx) {
        const length = simCtx.meterToPx(this.length);
        const width = simCtx.meterToPx(this.width);
        
        const canvasCoords = simCtx.originToCanvasCoords(
            simCtx.meterToPx(this.posX), 
            simCtx.meterToPx(this.posY), 
            length,
            width
        );

        // this.ctx.fillStyle = 'orange';
        // this.ctx.fillRect(canvasCoords.x,canvasCoords.y, length, width)

        // rotate context to draw the rotation of the ship
        simCtx.ctx.save();
        simCtx.ctx.translate(canvasCoords.x,canvasCoords.y);
        simCtx.ctx.rotate(this.rotationInDegrees*this.translationAmplifierFactor);

        simCtx.ctx.drawImage(this.image, 0, 0, length, width);
        simCtx.ctx.restore();
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