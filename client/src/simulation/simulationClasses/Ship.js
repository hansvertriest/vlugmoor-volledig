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
    constructor(simCtx, type, width, length, distanceFromKaai, paramsOutline={}, paramsIfIsPassingShip={}) {
        this.simCtx = simCtx;
        this.type = type;
        this.width = width;
        this.length = length;
        this.distanceFromKaai = distanceFromKaai;
        this.paramsOutline = paramsOutline;

        // Initiele waarden toewijzen
        this.posX = 0;
        this.posY = 0;
        this.startPosX = 0;
        this.startPosY = 0;
        this.rotationInDegrees = 0;
        this.direction = 1;
        this.speedInMPerS = 0;
        
        this.displacementLimitToBeStaticInPx = 0.0001;

        // Indien dit schip een passerend schip is
        if (Object.keys(paramsIfIsPassingShip).length > 0) {
            this.posX = paramsIfIsPassingShip.posX;
            this.posY = paramsIfIsPassingShip.posY;
            this.startPosX = paramsIfIsPassingShip.posX;
            this.startPosY = paramsIfIsPassingShip.posY;
            this.direction = paramsIfIsPassingShip.direction;
            this.speedInMPerS = paramsIfIsPassingShip.speedInMPerS;
        }

        // Properties voor het laden van de afbeeldingen
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

    /**
     * Afhankelijk van het type wijs de juiste image-source toe
     */
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

    /**
     * Laad alle afbeeldingen
     */
    async loadImage() {
        return new Promise((resolve, reject) => {
            const allImagesLoaded = () => {
                // Check of alle afbeeldingen ingeladen zijn
                if (this.imageStaticLeftIsLoaded && this.imageStaticRightIsLoaded && this.imageStaticOutlineRightIsLoaded && this.imageStaticOutlineLeftIsLoaded) {
                    // Stel de richting in
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

    /**
     * Voer alle teken-bewgingen uit om dit object op het canvas te tonen
     *      Meet info over het HTML5 canvas: https://developer.mozilla.org/nl/docs/Web/API/Canvas_API
     * @param {*} ctx Instantie van een SimulationContext
     */
    draw(ctx=this.simCtx.ctx) {
        // Converteer meter naar px
        const length = this.simCtx.meterToPx(this.length);
        const width = this.simCtx.meterToPx(this.width);
        const posXInPx = this.simCtx.meterToPx(this.posX);
        const posYInPx = this.simCtx.meterToPx(this.posY)*-1;

        // context opslaan in voorbereiding van de context transformatie
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

    
    /**
     * Voer alle teken-bewgingen uit om een schaduw van dit object op het canvas te tonen (EXPERIMENTEEL)
     *      Meet info over het HTML5 canvas: https://developer.mozilla.org/nl/docs/Web/API/Canvas_API
     * @param {*} ctx een canvas-context
     */
    drawShadow(ctx=this.simCtx.ctx) {
        // Converteer meter naar px
        const length = this.simCtx.meterToPx(this.length);
        const width = this.simCtx.meterToPx(this.width);
        const posXInPx = this.simCtx.meterToPx(this.posX);
        const posYInPx = this.simCtx.meterToPx(this.posY);

        // context opslaan in voorbereiding van de context transformatie
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


    /**
     * Voer alle teken-bewgingen uit om een outline van dit object op het canvas te tonen
     *      Meet info over het HTML5 canvas: https://developer.mozilla.org/nl/docs/Web/API/Canvas_API
     * @param {*} ctx een canvas-context
     */
    drawOutline(ctx=this.simCtx.ctx) {
        // Converteer meter naar px
        const length = this.simCtx.meterToPx(this.length);
        const width = this.simCtx.meterToPx(this.width);
        const posXInPx = this.simCtx.meterToPx(this.paramsOutline.posX);
        const posYInPx = this.simCtx.meterToPx(this.paramsOutline.posY)*-1;

        // context opslaan in voorbereiding van de context transformatie
        ctx.save();

        // translate van context naar origin van de simulatie
        ctx.translate(this.simCtx.originX, this.simCtx.originY);

        // roteer de context naar de hoek van de outline
        ctx.rotate(this.paramsOutline.rotation*-1);

        // draw image of outline
        ctx.drawImage(this.imageOutline, (posXInPx) - (length/2), (posYInPx) - (width/2), length, width);

        // restore context
        ctx.restore();
    }

    /**
     * Wijzig de richting van het schi
     * @param {*} direction 1: rechts, -1: links
     */
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

    /**
     * Bereken de linieaire verplaatsing van het schip in functie van de tijd
     * @param {*} time tijd in seconden
     */
    applySpeedDisplacement(time) {
        this.setPosX(this.startPosX + this.speedInMPerS * time);
    }

    /**
     * Zet x-positie
     * @param {*} posX x-positie in meter
     */
    setPosX(posX) {
        this.posX = posX;
    }

    /**
     * Zet y-positie
     * @param {*} posX y-positie in meter
     */
    setPosY(posY) {
        this.posY = posY;
    }

    /**
     * Zet de parameters van de outline
     * @param {*} posX x-positie in meter
     * @param {*} posY y-positie in meter
     * @param {*} rotation rotatie in graden
     */
    setOutlineParams(posX, posY, rotation) {
        this.paramsOutline = { posX, posY, rotation };
    }

    /**
     * Update outline parameters naar die van dit object
     */
    setOutlineParamsToCurrentPosition() {
        this.setOutlineParams(this.posX, this.posY, this.rotationInDegrees)
    }
}