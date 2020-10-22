import Ship from "./Ship";
import Hawser from "./Hawser";
import SimulationContext from "./SimulationContext";

export default class Simulation {
    constructor( width, height, data ) {
        this.simCtx = new SimulationContext(width, height);
        this.canvas = this.simCtx.canvas;
        this.ctx = this.simCtx.ctx;

        this.backgroundColor = "#c1e6fb";


        // this.simCtx.meterToPxFactor = 2;
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

        // controll variables
        this.mouseX;
        this.mouseY;
        this.mouseIsDown = false;
    }

    registerControls() {
        window.addEventListener('mousedown', () => this.mouseIsDown = true)
        window.addEventListener('mouseup', () => this.mouseIsDown = false)
        window.addEventListener('mousemove', (e) => {
            if (this.mouseIsDown) {
                console.log(e);
                if (!this.mouseX) this.mouseX = e.x;
                if (!this.mouseY) this.mouseY = e.y;
                this.kaaiHeight -= this.simCtx.pxToMeter(e.y - this.mouseY);
                this.simCtx.moveOrigin(
                    (e.x - this.mouseX),
                    (e.y - this.mouseY),
                )
                this.mouseX = e.x;
                this.mouseY = e.y;
            }
        });
    }

    init() {
        this.setBackgroundColor();
        this.drawKaai();
    }

    originToCanvasCoords(originCoordX, originCoordY, width=0, height=0) {
        const canvasCoordX =  this.originX - originCoordX - (width/2);
        const canvasCoordY =  this.originY - originCoordY - (height/2);
        return {
            x: canvasCoordX,
            y: canvasCoordY,
        }
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
            // set origin relative to distance from kaai
            this.simCtx.setOrigin(
                this.originX,
                (this.distanceToKaaiInMeter == 0) 
                    ? this.canvas.height - this.simCtx.meterToPx(this.kaaiHeight) + this.simCtx.meterToPx(this.caseShip.distanceFromKaai)
                    : this.canvas.height - this.simCtx.meterToPx(this.kaaiHeight) + this.simCtx.meterToPx(this.distanceToKaaiInMeter)
            );
        } else {
            this.passingShip = newShip;
            await this.passingShip.loadImage();
        }
    }

    addHawsers(bolderData, hawserLimits) {
        // loop over all bolders and add a Hawser object to hawserArray
        bolderData.forEach((bolder) => {
            const hawser = new Hawser(
                bolder.posX,
                bolder.posY,
                bolder.forceLimit,
                hawserLimits
            );
            this.hawserArray.push(hawser);
        });
    }

    drawHawsers() {
        this.hawserArray.forEach((hawser) => {
            hawser.draw(this.simCtx)
        });
    }

    drawKaai() {
        const height = this.simCtx.meterToPx(this.kaaiHeight);
        const width = this.canvas.width;
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(0, this.canvas.height - height, width, height);
    }

    drawCaseShip() {
        this.caseShip.draw(this.simCtx);
    }


    doAnimation() {
        // get timePoint
        const timePoint = this.caseData.timePoints[this.animationTime];

        // update kaai 
        // this.kaaiHeight = this.simCtx.canvas.height - this.simCtx.originY ;

        // update caseShip parameters
        this.caseShip.setPosX(timePoint.shipData.posX*this.translationAmplifierFactor);
        this.caseShip.setPosY(timePoint.shipData.posY*this.translationAmplifierFactor);
        this.caseShip.rotationInDegrees = timePoint.shipData.rotation;

        // update hawsers parameters

        this.hawserArray.forEach((hawser,index) => {
            hawser.setPosOnShipX(timePoint.hawserData[index].posXShip, this.translationAmplifierFactor);
            hawser.setPosOnShipY(timePoint.hawserData[index].posYShip, this.translationAmplifierFactor);
            hawser.setCurrentLoad(timePoint.hawserData[index].force);
        });

        // clear screen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // drawElements
        this.setBackgroundColor();
        this.drawKaai();
        this.drawCaseShip();
        this.drawHawsers();

        // check if animation is done
        if (this.getNextAnimationTime() >= this.caseData.timePoints.length) {
            this.pause();
        } else if (this.animationPlaying) {
            // set next animationTime
            this.setNextAnimationTime();
            window.requestAnimationFrame(this.doAnimation.bind(this));
        }
    }

}