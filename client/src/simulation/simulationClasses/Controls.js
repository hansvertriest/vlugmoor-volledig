export default class Controls {
    constructor(simulation) {
        this.simulation = simulation
        this.simCtx = this.simulation.simCtx;

        // control variables
        this.zoomRate = 0.2;

        // mouse position
        this.mouseX;
        this.mouseY;

        // mouse scroll
        this.mouseScrollDeltaY = 0;

        // mousestate
        this.mouseIsDown = false;
    }

    registerBasicNav() {
        this.registerDrag();
        this.registerZoom();
    }

    registerDrag() {
        this.simCtx.canvas.addEventListener('mousedown', (e) => {
            this.mouseX = e.x;
            this.mouseY = e.y;
            this.mouseIsDown = true
        })
        this.simCtx.canvas.addEventListener('mouseup', () => this.mouseIsDown = false)
        window.addEventListener('mousemove', (e) => {
            if (this.mouseIsDown) {
                this.simulation.kaai.heightInM -= this.simCtx.pxToMeter(e.y - this.mouseY);
                this.simCtx.moveOrigin(
                    (e.x - this.mouseX),
                    (e.y - this.mouseY),
                )
                this.mouseX = e.x;
                this.mouseY = e.y;
            }
        });
    }

    registerZoom() {
        console.log('registering zoom')
        this.simCtx.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.simCtx.addToMeterToPxFactor(this.zoomRate * e.deltaY * -0.01);
        }, false);
    }

    registerOutlineSwitch(buttonId) {
        const bttn = document.getElementById(buttonId);
        bttn.checked = this.simCtx.drawCaseShipOutline;
        bttn.onclick = () => {
            this.switchOutlineDisplay();
        };
    }

    registerPlayPauseSwitch(buttonId) {
        const bttn = document.getElementById(buttonId);
        bttn.onclick = () => {
            this.switchPlayPause();
        };
    }

    registerTimeLine(timeLineId) {
        const timeline = document.getElementById(timeLineId);
        
        this.subscribeToNextAnimationTime((time) => {
            console.log(time);
        })
    }

    // setting simulation parameters
    switchPlayPause() {
        this.simulation.switchPlayPause();
    }

    switchOutlineDisplay () {
        this.simCtx.drawCaseShipOutline = !this.simCtx.drawCaseShipOutline;
    }

    setAnimationProgressInPercentage(percentage) {
        const simulationTimePointCount = this.simCtx.timePointCount / this.simCtx.animationTimeInterval;
        this.simulation.setNextAnimationTime(Math.round(simulationTimePointCount*percentage) * this.simCtx.animationTimeInterval);
    }

    // retrieving simulation parameters
    getAnimationProgressInPercentage() {
        return this.simulation.animationTime / this.simCtx.timePointCount;
    }

    subscribeToNextAnimationTime(callback) {
        this.simulation.onNextAnimationTimeSubscription = callback;
    }

}