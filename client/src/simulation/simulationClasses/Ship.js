import container400x63BigLeft from '../../assets/images/container_400x63_dirLeft.png';
import container400x63BigRight from '../../assets/images/container_400x63_dirRight.png';
import container400x63BigLeftOutline from '../../assets/images/container_400x63_dirLeft_outline.png';
import container400x63BigRightOutline from '../../assets/images/container_400x63_dirRight_outline.png';

import tanker280x48BigLeft from '../../assets/images/tanker_280x48_dirLeft.png';
import tanker280x48BigRight from '../../assets/images/tanker_280x48_dirRight.png';
import tanker280x48BigLeftOutline from '../../assets/images/tanker_280x48_dirLeft_outline.png';
import tanker280x48BigRightOutline from '../../assets/images/tanker_280x48_dirRight_outline.png';

import roroBigLeft from '../../assets/images/roro_dirLeft.png';
import roroBigRight from '../../assets/images/roro_dirRight.png';
import roroBigLeftOutline from '../../assets/images/roro_dirLeft_outline.png';
import roroBigRightOutline from '../../assets/images/roro_dirRight_outline.png';

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
        }

        this.image;
        this.imageOutline;

        this.imageStaticLeft = new Image();
        this.imageStaticLeftIsLoaded = false;

        this.imageStaticRight = new Image();
        this.imageStaticRightIsLoaded = false;

        this.imageStaticOutlineLeft = new Image();
        this.imageStaticOutlineLeftIsLoaded = false;

        this.imageStaticOutlineRight = new Image();
        this.imageStaticOutlineRightIsLoaded = false;

        this.setImageSrcs();
    }

    setImageSrcs() {
        if (this.type.trim() === 'container') {
            this.imageStaticLeft.src = container400x63BigLeft;
            this.imageStaticRight.src = container400x63BigRight;
            this.imageStaticOutlineLeft.src = container400x63BigLeftOutline;
            this.imageStaticOutlineRight.src = container400x63BigRightOutline;
        } else if (this.type.trim() === 'tanker') {
        //     this.imageStaticLeft.src = tanker280x48BigLeft;
        //     this.imageStaticRight.src = tanker280x48BigRight;
        //     this.imageStaticOutlineLeft.src = tanker280x48BigLeftOutline;
        //     this.imageStaticOutlineRight.src = tanker280x48BigRightOutline;
            this.imageStaticLeft.src = roroBigLeft;
            this.imageStaticRight.src = roroBigRight;
            this.imageStaticOutlineLeft.src = roroBigLeftOutline;
            this.imageStaticOutlineRight.src = roroBigRightOutline;
        }
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

    draw(ctx=this.simCtx.ctx) {

        const length = this.simCtx.meterToPx(this.length);
        const width = this.simCtx.meterToPx(this.width);

        // Converteer meter naar px
        const posXInPx = this.simCtx.meterToPx(this.posX);
        const posYInPx = this.simCtx.meterToPx(this.posY)*-1;

        ctx.save();

        // translate van context naar origin van de simulatie
        ctx.translate(this.simCtx.originX, this.simCtx.originY);

        // roteer de context naar de hoek van het schip
        ctx.rotate(this.rotationInDegrees*-1);

        // draw image of ship
        ctx.drawImage(this.image, (posXInPx) - (length/2), (posYInPx) - (width/2), length, width);

        // restore context
        ctx.restore();
    }

    drawShadow(ctx=this.simCtx.ctx) {
        const length = this.simCtx.meterToPx(this.length);
        const width = this.simCtx.meterToPx(this.width);

        // Converteer meter naar px
        // 
        const posXInPx = this.simCtx.meterToPx(this.posX);
        const posYInPx = this.simCtx.meterToPx(this.posY);

        ctx.save();

        // translate van context naar origin van de simulatie
        ctx.translate(this.simCtx.originX, this.simCtx.originY);

        // roteer de context naar de hoek van het schip
        ctx.rotate(this.rotationInDegrees * -1);

        // draw orange placeholder
        ctx.fillStyle = 'rgba(7, 60, 145, 0.4)';
        ctx.fillRect((posXInPx) - (length/2), (posYInPx) - (width/2), length, width)

        // restore context
        ctx.restore();
    }

    drawOutline(ctx=this.simCtx.ctx) {
        const length = this.simCtx.meterToPx(this.length);
        const width = this.simCtx.meterToPx(this.width);

        const coords = this.simCtx.originToCanvasCoords(this.outlinePosX, this.outlinePosY, this.length, this.width );
        // draw image of ship
        ctx.drawImage(this.imageOutline, coords.x, coords.y, length, width);
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