import Controls from './Controls';
import Ship from "./Ship";
import Hawser from "./Hawser";
import Fender from "./Fender";
import SimulationContext from "./SimulationContext";
import Kaai from "./Kaai";

export default class Simulation {
    constructor( width, height, data ) {
        this.simCtx = new SimulationContext(width, height);
        this.canvas = this.simCtx.canvas;
        this.ctx = this.simCtx.ctx;

        this.backgroundColor = "#c1e6fb";

        this.kaaiHeight = 100;
        this.originX = this.canvas.width/2;
        this.originY = this.canvas.height/2;

        this.caseData = data;
        this.animationTime = 0;
        this.animationTimeInterval = 10;
        this.animationPlaying = false;

        // variables for improving visual message
        this.translationAmplifierFactor = 1;
        this.distanceToKaaiInMeter = 0;

        // hawser data 
        this.hawserArray = [];
        this.fenderArray = [];

        // controller for interaction
        this.controls;
    }

    registerController() {
        this.controls = new Controls(this.simCtx);
        this.controls.registerDrag((deltaInM) => {
            this.kaai.heightInM -= this.simCtx.pxToMeter(deltaInM);
        });
        this.controls.registerZoom((delta) => {
            this.simCtx.addToMeterToPxFactor(delta);
        });
    }

    async init() {
        this.setBackgroundColor();
        this.kaai = new Kaai(
            this.simCtx.originY, 
            this.caseData.caseMetaData.caseShip.distanceFromKaai,
            this.simCtx.pxToMeter(this.canvas.width)
        );
        await this.kaai.loadImage();
    }

    setNextAnimationTime() {
        this.animationTime += this.animationTimeInterval;
    }

    getNextAnimationTime() {
        return this.animationTime + this.animationTimeInterval;
    }

    play() {
        this.animationPlaying = true;
        window.requestAnimationFrame(this.doAnimation.bind(this));
    }

    pause() {
        this.animationPlaying = false;
    }

    setBackgroundColor(color=this.backgroundColor) {
        this.backgroundColor = color;
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    async addShip(shipInfo, isCaseShip=false) {
        const newShip = new Ship(
            shipInfo.type, 
            shipInfo.width, 
            shipInfo.length, 
            shipInfo.distanceFromKaai
        );
        if (isCaseShip) {
            this.caseShip = newShip;
            await this.caseShip.loadImage();
        } else {
            this.passingShip = newShip;
            await this.passingShip.loadImage();
        }
    }

    addFenders(fenderData, fenderMeta) {
        // loop over all fenders and add a Fender object to fenderArray
        fenderData.forEach((fender) => {
            const newFender = new Fender(
                fender.posX,
                fender.posY,
                fender.forceMax,
                fenderMeta.thicknessInM,
                fenderMeta.widthInM,
                {
                    first: fenderMeta.first,
                    second: fenderMeta.second,
                }
            );
            this.fenderArray.push(newFender);
        });

    }

    drawFenders() {
        this.fenderArray.forEach((fender) => {
            fender.draw(this.simCtx)
        });
    }

    async addHawsers(bolderData, hawserMeta) {
        return new Promise((resolve, reject) => {
            // loop over all bolders and add a Hawser object to hawserArray
            bolderData.forEach((bolder) => {
                const hawser = new Hawser(
                    bolder.posX,
                    bolder.posY,
                    bolder.forceMax,
                    hawserMeta
                );
                this.hawserArray.push(hawser);
            });

            // load images of hawsers
            this.hawserArray.forEach(async(hawser) => {
                await hawser.loadImage();

                // check if last hawser = loaded
                if(this.hawserArray[this.hawserArray.length-1].imageIsLoaded) {
                    resolve();
                }
            });            
        });
    }

    drawHawsers() {
        this.hawserArray.forEach((hawser) => {
            hawser.draw(this.simCtx)
        });
    }

    drawKaai() {
        this.kaai.draw(this.simCtx);
    }

    drawCaseShip() {
        this.caseShip.draw(this.simCtx);
    }


    doAnimation() {
        // check if animation is done
        if (this.getNextAnimationTime() >= this.caseData.timePoints.length) {
            this.pause();
        } else if (this.animationPlaying) {
            // get timePoint
            const timePoint = this.caseData.timePoints[this.animationTime];

            // update caseShip parameters
            this.caseShip.setPosX(timePoint.shipData.posX*this.translationAmplifierFactor);
            this.caseShip.setPosY(timePoint.shipData.posY*this.translationAmplifierFactor);
            this.caseShip.rotationInDegrees = timePoint.shipData.rotation*this.translationAmplifierFactor;

            // update hawsers parameters
            this.hawserArray.forEach((hawser,index) => {
                hawser.setPosOnShipX(timePoint.hawserData[index].posXShip, this.translationAmplifierFactor);
                hawser.setPosOnShipY(timePoint.hawserData[index].posYShip, this.translationAmplifierFactor);
                hawser.setCurrentLoad(timePoint.hawserData[index].force);
            });

            // update fender currentforce
            this.fenderArray.forEach((fender, index) => {
                fender.setCurrentForce(timePoint.fenderData[index].force);
            });
        }

        // clear screen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // drawElements
        this.setBackgroundColor();
        this.drawKaai();
        this.drawCaseShip();
        this.drawHawsers();
        this.drawFenders();
        this.caseShip.drawOutline(this.simCtx);

        // set next animationTime
        this.setNextAnimationTime();

        window.requestAnimationFrame(this.doAnimation.bind(this));
    }

}