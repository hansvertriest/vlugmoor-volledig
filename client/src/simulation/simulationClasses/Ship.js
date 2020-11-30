import container400x63BigLeft from '../../assets/images/container_400x63_dirLeft.png';
import container400x63BigRight from '../../assets/images/container_400x63_dirRight.png';
import container400x63BigLeftOutline from '../../assets/images/container_400x63_dirLeft_outline.png';
import container400x63BigRightOutline from '../../assets/images/container_400x63_dirRight_outline.png';

export default class Ship {
    constructor(simCtx, type, width, length, distanceFromKaai, paramsPassingShip={}) {
        this.simCtx = simCtx;
        this.type = type;
        this.width = width;
        this.length = length;
        this.distanceFromKaai = distanceFromKaai;
        this.posX = 0;
        this.posY = 0;
        this.startPosX = 0;
        this.startPosY = 0;
        this.outlinePosX = this.posX;
        this.outlinePosY = this.posY;
        this.rotationInDegrees = 0;
        this.direction = 1;
        this.speedInMPerS = 0;
        
        this.displacementLimitToBeStaticInPx = 0.0001;

        // if passingship
        if (Object.keys(paramsPassingShip).length > 0) {
            this.posX = paramsPassingShip.posX;
            this.posY = paramsPassingShip.posY;
            this.startPosX = paramsPassingShip.posX;
            this.startPosY = paramsPassingShip.posY;
            this.direction = paramsPassingShip.direction;
            this.speedInMPerS = paramsPassingShip.speedInMPerS;
            console.log(this.posX)
        }

        this.image;
        this.imageOutline;

        this.imageStaticLeft = new Image();
        this.imageStaticLeft.src = container400x63BigLeft;
        this.imageStaticLeftIsLoaded = false;

        this.imageStaticRight = new Image();
        this.imageStaticRight.src = container400x63BigRight;
        this.imageStaticRightIsLoaded = false;

        this.imageStaticOutlineLeft = new Image();
        this.imageStaticOutlineLeft.src = container400x63BigLeftOutline;
        this.imageStaticOutlineLeftIsLoaded = false;

        this.imageStaticOutlineRight = new Image();
        this.imageStaticOutlineRight.src = container400x63BigRightOutline;
        this.imageStaticOutlineRightIsLoaded = false;
    }

    async loadImage() {
        return new Promise((resolve, reject) => {
            const allImagesLoaded = () => {
                if (this.imageStaticLeftIsLoaded && this.imageStaticRightIsLoaded && this.imageStaticOutlineRightIsLoaded && this.imageStaticOutlineLeftIsLoaded) {
                    // if both are loaded set correct direction
                    this.setImageDirection(this.direction);
                    console.log('Ship images loaded');
                    resolve();
                }
            }

            this.imageStaticLeft.onload = function(){
                this.imageStaticLeftIsLoaded = true;
                allImagesLoaded();
            }.bind(this);

            this.imageStaticRight.onload = function(){
                this.imageStaticRightIsLoaded = true;
                allImagesLoaded();
            }.bind(this);

            this.imageStaticOutlineLeft.onload = function(){
                this.imageStaticOutlineLeftIsLoaded = true;
                allImagesLoaded();
            }.bind(this);

            this.imageStaticOutlineRight.onload = function(){
                this.imageStaticOutlineRightIsLoaded = true;
                allImagesLoaded();
            }.bind(this);
        });
    }

    draw() {

        const length = this.simCtx.meterToPx(this.length);
        const width = this.simCtx.meterToPx(this.width);

        // Converteer meter naar px
        const posXInPx = this.simCtx.meterToPx(this.posX);
        const posYInPx = this.simCtx.meterToPx(this.posY)*-1;

        this.simCtx.ctx.save();

        // translate van context naar origin van de simulatie
        this.simCtx.ctx.translate(this.simCtx.originX, this.simCtx.originY);

        // mirror image according to direction 
        // (direction is now enforced trough differen images to limit CPU use)
        // this.simCtx.ctx.scale(this.direction, 1);

        // roteer de context naar de hoek van het schip
        this.simCtx.ctx.rotate(this.rotationInDegrees*-1);

        // draw image of ship
        this.simCtx.ctx.drawImage(this.image, (posXInPx) - (length/2), (posYInPx) - (width/2), length, width);

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

        const coords = this.simCtx.originToCanvasCoords(this.outlinePosX, this.outlinePosY, this.length, this.width );
        // draw image of ship
        this.simCtx.ctx.drawImage(this.imageOutline, coords.x, coords.y, length, width);
    }

    setImageToMoving(){
        this.image = this.imageMoving;
    }
    setImageDirection(direction){
        this.direction = direction;
        if ( this.direction > 0) {
            this.image = this.imageStaticRight;
            this.imageOutline = this.imageStaticOutlineRight;
        } else {
            this.image = this.imageStaticLeft;
            this.imageOutline = this.imageStaticOutlineLeft;
        }
    }

    applySpeedDisplacement(time) {
        this.setPosX(this.startPosX + this.speedInMPerS * time);
    }

    setPosX(posX) {
        this.posX = posX;
    }

    setPosY(posY) {
        this.posY = posY;
    }
}