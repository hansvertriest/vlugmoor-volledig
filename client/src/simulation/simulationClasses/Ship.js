import containerLargeLeft from '../../assets/images/ships/container/container_large_dirLeft.png';
import containerLargeRight from '../../assets/images/ships/container/container_large_dirRight.png';
import containerLargeLeftOutline from '../../assets/images/ships/container/container_large_dirLeft_outline.png';
import containerLargeRightOutline from '../../assets/images/ships/container/container_large_dirRight_outline.png';
import containerSmallLeft from '../../assets/images/ships/container/container_small_dirLeft.png';
import containerSmallRight from '../../assets/images/ships/container/container_small_dirRight.png';
import containerSmallLeftOutline from '../../assets/images/ships/container/container_small_dirLeft_outline.png';
import containerSmallRightOutline from '../../assets/images/ships/container/container_small_dirRight_outline.png';

import tankerLargeLeft from '../../assets/images/ships/tanker/oiltanker_large_dirLeft.png';
import tankerLargeRight from '../../assets/images/ships/tanker/oiltanker_large_dirRight.png';
import tankerLargeLeftOutline from '../../assets/images/ships/tanker/oiltanker_large_dirLeft_outline.png';
import tankerLargeRightOutline from '../../assets/images/ships/tanker/oiltanker_large_dirRight_outline.png';
import tankerSmallLeft from '../../assets/images/ships/tanker/oiltanker_small_dirLeft.png';
import tankerSmallRight from '../../assets/images/ships/tanker/oiltanker_small_dirRight.png';
import tankerSmallLeftOutline from '../../assets/images/ships/tanker/oiltanker_small_dirLeft_outline.png';
import tankerSmallRightOutline from '../../assets/images/ships/tanker/oiltanker_small_dirRight_outline.png';

import bulkcarrierLeft from '../../assets/images/ships/bulkcarrier/bulkcarrier_dirLeft.png';
import bulkcarrierRight from '../../assets/images/ships/bulkcarrier/bulkcarrier_dirRight.png';
import bulkcarrierLeftOutline from '../../assets/images/ships/bulkcarrier/bulkcarrier_dirLeft_outline.png';
import bulkcarrierRightOutline from '../../assets/images/ships/bulkcarrier/bulkcarrier_dirRight_outline.png';

import gascarrierPrismaLeft from '../../assets/images/ships/gascarrier/gascarrier_prismatanks_dirLeft.png';
import gascarrierPrismaRight from '../../assets/images/ships/gascarrier/gascarrier_prismatanks_dirRight.png';
import gascarrierPrismaLeftOutline from '../../assets/images/ships/gascarrier/gascarrier_prismatanks_dirLeft_outline.png';
import gascarrierPrismaRightOutline from '../../assets/images/ships/gascarrier/gascarrier_prismatanks_dirRight_outline.png';
import gascarrierSphericalLeft from '../../assets/images/ships/gascarrier/gascarrier_sphericaltanks_dirLeft.png';
import gascarrierSphericalRight from '../../assets/images/ships/gascarrier/gascarrier_sphericaltanks_dirRight.png';
import gascarrierSphericalLeftOutline from '../../assets/images/ships/gascarrier/gascarrier_sphericaltanks_dirLeft_outline.png';
import gascarrierSphericalRightOutline from '../../assets/images/ships/gascarrier/gascarrier_sphericaltanks_dirRight_outline.png';

import roroBigLeft from '../../assets/images/ships/roro/roro_dirLeft.png';
import roroBigRight from '../../assets/images/ships/roro/roro_dirRight.png';
import roroBigLeftOutline from '../../assets/images/ships/roro/roro_dirLeft_outline.png';
import roroBigRightOutline from '../../assets/images/ships/roro/roro_dirRight_outline.png';

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
        if (this.type.trim() === 'container_large') {
            this.imageStaticLeft.src = containerLargeLeft;
            this.imageStaticRight.src = containerLargeRight;
            this.imageStaticOutlineLeft.src = containerLargeLeftOutline;
            this.imageStaticOutlineRight.src = containerLargeRightOutline;
        } else if (this.type.trim() === 'container_small') {
            this.imageStaticLeft.src = containerSmallLeft;
            this.imageStaticRight.src = containerSmallRight;
            this.imageStaticOutlineLeft.src = containerSmallLeftOutline;
            this.imageStaticOutlineRight.src = containerSmallRightOutline;
        } else if (this.type.trim() === 'oiltanker_large') {
            this.imageStaticLeft.src = tankerLargeLeft;
            this.imageStaticRight.src = tankerLargeRight;
            this.imageStaticOutlineLeft.src = tankerLargeLeftOutline;
            this.imageStaticOutlineRight.src = tankerLargeRightOutline;
        }  else if (this.type.trim() === 'oiltanker_small') {
            this.imageStaticLeft.src = tankerSmallLeft;
            this.imageStaticRight.src = tankerSmallRight;
            this.imageStaticOutlineLeft.src = tankerSmallLeftOutline;
            this.imageStaticOutlineRight.src = tankerSmallRightOutline;
        }  else if (this.type.trim() === 'bulkcarrier') {
            this.imageStaticLeft.src = bulkcarrierLeft;
            this.imageStaticRight.src = bulkcarrierRight;
            this.imageStaticOutlineLeft.src = bulkcarrierLeftOutline;
            this.imageStaticOutlineRight.src = bulkcarrierRightOutline;
        }  else if (this.type.trim() === 'gascarrier_prismatanks') {
            this.imageStaticLeft.src = gascarrierPrismaLeft;
            this.imageStaticRight.src = gascarrierPrismaRight;
            this.imageStaticOutlineLeft.src =gascarrierPrismaLeftOutline;
            this.imageStaticOutlineRight.src = gascarrierPrismaRightOutline;
        }  else if (this.type.trim() === 'gascarrier_sphericaltanks') {
            this.imageStaticLeft.src = gascarrierSphericalLeft;
            this.imageStaticRight.src = gascarrierSphericalRight;
            this.imageStaticOutlineLeft.src =gascarrierSphericalLeftOutline;
            this.imageStaticOutlineRight.src = gascarrierSphericalRightOutline;
        } else if (this.type.trim() === 'roro') {
            this.imageStaticLeft.src = roroBigLeft;
            this.imageStaticRight.src = roroBigRight;
            this.imageStaticOutlineLeft.src = roroBigLeftOutline;
            this.imageStaticOutlineRight.src = roroBigRightOutline;
        } else {
            this.imageStaticLeft.src = containerLargeLeft;
            this.imageStaticRight.src = containerLargeRight;
            this.imageStaticOutlineLeft.src = containerLargeLeftOutline;
            this.imageStaticOutlineRight.src = containerLargeRightOutline;
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