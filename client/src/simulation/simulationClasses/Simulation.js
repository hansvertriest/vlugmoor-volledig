import Controls from './Controls';
import Ship from "./Ship";
import Hawser from "./Hawser";
import Fender from "./Fender";
import SimulationContext from "./SimulationContext";
import Kaai from "./Kaai";
import LoadingScreen from './LoadingScreen';

export default class Simulation {
    constructor( canvasId ) {
        this.simCtx = new SimulationContext(canvasId);
        this.canvas = this.simCtx.canvas;
        this.ctx = this.simCtx.ctx;

        this.backgroundColor = "#c1e6fb";

        this.originX = this.canvas.width/2;
        this.originY = this.canvas.height/2;

        this.animationTime = 0;
        this.animationPlaying = false;

        // variables for improving visual message
        this.translationAmplifierFactor = 1;
        this.distanceToKaaiInMeter = 0;

        // ships
        this.caseShip;
        this.passingShips = [];

        // hawser data 
        this.hawserArray = [];
        this.fenderArray = [];

        // loading
        this.loadingScreen = new LoadingScreen(this.simCtx);
        window.requestAnimationFrame(this.doLoading.bind(this));

        // subscriptions
        this.onAnimationTimeCallback = [];
    }

    async init() {
        this.setBackgroundColor();
        await this.addKaai();
    }

    async addKaai() {
        this.kaai = new Kaai(
            this.simCtx, 
            this.caseData.caseMetaData.caseShip.distanceFromKaai,
            this.simCtx.pxToMeter(this.canvas.width)
        );
        await this.kaai.loadImage();
    }

    addData(data) {
        this.caseData = data;
    }

    setPreviousAnimationTime() {
        this.setNextAnimationTimeToSpecificTimepoint(this.animationTime - this.simCtx.animationTimeInterval);

        if (this.onAnimationTimeCallback.length) {
            this.onAnimationTimeCallback.forEach((callback) => callback(this.animationTime, this.animationTime / this.simCtx.timePointCount))
        }
    }

    setNextAnimationTime() {
        this.setNextAnimationTimeToSpecificTimepoint(this.animationTime + this.simCtx.animationTimeInterval);

        if (this.onAnimationTimeCallback.length) {
            this.onAnimationTimeCallback.forEach((callback) => callback(this.animationTime, this.animationTime / this.simCtx.timePointCount))
        }
    }

    setNextAnimationTimeToSpecificTimepoint(timepoint) {
        // round up until next timeInterval 
        if (timepoint%this.simCtx.animationTimeInterval > 0){
            timepoint += this.simCtx.animationTimeInterval - (timepoint%this.simCtx.animationTimeInterval);
        }

        this.animationTime = timepoint;

        this.updateSimulation();

        if (this.onAnimationTimeCallback.length) {
            this.onAnimationTimeCallback.forEach((callback) => callback(this.animationTime, this.animationTime / this.simCtx.timePointCount))
        }
    }

    getNextAnimationTime() {
        return this.animationTime + this.simCtx.animationTimeInterval;
    }

    play() {
        this.animationPlaying = true;
    }

    pause() {
        this.animationPlaying = false;
    }

    switchPlayPause() {
        this,this.animationPlaying = !this.animationPlaying;
    }

    setBackgroundColor(color=this.backgroundColor) {
        this.backgroundColor = color;
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    async addShip(shipInfo, isCaseShip=false) {
        const paramsPassingShip = (isCaseShip) 
            ? {} 
            : {
                posX: this.canvas.width/-2,
                posY: this.caseShip.width/2 + shipInfo.deltaYShips + shipInfo.width/2,
                direction: shipInfo.direction,
                speedInMPerS: shipInfo.speedInMPerS,
            }

        const newShip = new Ship(
            this.simCtx,
            shipInfo.type, 
            shipInfo.width, 
            shipInfo.length, 
            shipInfo.distanceFromKaai,
            paramsPassingShip
        );
        if (isCaseShip) {
            this.caseShip = newShip;
            await this.caseShip.loadImage();
        } else {
            if (this.caseShip) {
                this.passingShips.unshift(newShip);
                await this.passingShips[0].loadImage();
            } else {
                console.log("!!! ERROR: Make sure to firstly set the caseShip before any other ship as this ship defines the origin of the simulation!")
            }
        }
    }

    addFenders(fenderData, fenderLimits) {
        // loop over all fenders and add a Fender object to fenderArray
        fenderData.forEach((fender) => {
            const newFender = new Fender(
                this.simCtx,
                fender.posX,
                fender.posY,
                fender.forceMax,
                fenderLimits.thicknessInM,
                fenderLimits.widthInM,
                {
                    first: fenderLimits.first,
                    second: fenderLimits.second,
                }
            );
            this.fenderArray.push(newFender);
        });

    }

    drawFenders() {
        this.fenderArray.forEach((fender) => {
            fender.draw()
        });
    }

    async addHawsers(bolderData, hawserLimits, hawserBreakingTimePoints=[]) {
        return new Promise((resolve, reject) => {
            // loop over all bolders and add a Hawser object to hawserArray
            bolderData.forEach((bolder, index) => {
                const hawser = new Hawser(
                    index,
                    this.simCtx,
                    bolder.posX,
                    bolder.posY,
                    hawserLimits
                );
                this.hawserArray.push(hawser);
            });

            // assign a breakingTimePoint to hawsers
            hawserBreakingTimePoints.forEach((hawserBreakingTimePoint) => {
                this.hawserArray[hawserBreakingTimePoint.hawserId].setBreakingTimePoint(hawserBreakingTimePoint.timePoint);
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
            hawser.draw()
        });
    }

    drawKaai() {
        this.kaai.draw();
    }

    drawShips() {
        this.caseShip.draw();
        if (this.passingShips) {
            this.passingShips.forEach((passingShip) => {
                passingShip.draw();
            });
        }
    }


    doLoading() {
        if (!this.animationPlaying) {
            // clear screen
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // draw on canvas
            this.setBackgroundColor();
            this.loadingScreen.draw();
            window.requestAnimationFrame(this.doLoading.bind(this));
        } else {
            window.requestAnimationFrame(this.doAnimation.bind(this));
        }
    }

    updateSimulation() {
        // get timePoint
        const timePoint = this.caseData.timePoints[this.animationTime];

        // update caseShip parameters
        this.caseShip.setPosX(timePoint.shipData.posX*this.translationAmplifierFactor);
        this.caseShip.setPosY(timePoint.shipData.posY*this.translationAmplifierFactor);
        this.caseShip.rotationInDegrees = timePoint.shipData.rotation*this.translationAmplifierFactor;

        // update passingShip parameters
        this.passingShips.forEach((passingShip) => {
            passingShip.applySpeedDisplacement(this.animationTime*this.simCtx.timePointInterval);
        });

        // update hawsers parameters
        this.hawserArray.forEach((hawser,index) => {
            hawser.setPosOnShipX(timePoint.hawserData[index].posXShip, this.translationAmplifierFactor);
            hawser.setPosOnShipY(timePoint.hawserData[index].posYShip, this.translationAmplifierFactor);
            hawser.setLoadRatio(timePoint.hawserData[index].loadRatio);
            hawser.setHasBroken(hawser.breakingTimePoint < this.animationTime);
        });

        // update fender currentforce
        this.fenderArray.forEach((fender, index) => {
            fender.setCurrentForce(timePoint.fenderData[index].force);
        });


    }

    doAnimation() {
        // check if animation is done
        if (this.getNextAnimationTime() >= this.caseData.timePoints.length) {
            this.pause();
        } else if (this.animationPlaying) {
            // update alle elements of the simulation
            this.updateSimulation();

            // set next animationTime
            this.setNextAnimationTime();
        }

        // clear screen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // drawElements
        this.setBackgroundColor();
        // this.caseShip.drawShadow();
        this.drawKaai();
        this.drawShips();
        this.drawHawsers();
        this.drawFenders();
        if (this.simCtx.drawCaseShipOutline) this.caseShip.drawOutline();
       
        window.requestAnimationFrame(this.doAnimation.bind(this));
    }
}