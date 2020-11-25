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

    registerRestartButton(buttonId) {
        const bttn = document.getElementById(buttonId);
        bttn.onclick = () => {
            this.setAnimationProgressInPercentage(0.001);
        };
    }

    registerPlayPause(buttonId) {
        const bttn = document.getElementById(buttonId);
        bttn.onclick = () => {
            this.switchPlayPause();
        };
    }

    registerNext(buttonId) {
        const bttn = document.getElementById(buttonId);
        bttn.onclick = () => {
            this.setNextFrame();
        };
    }

    registerPrevious(buttonId) {
        const bttn = document.getElementById(buttonId);
        bttn.onclick = () => {
            this.setPreviousFrame();
        };
    }

    registerTimepointInput(buttonId) {
        const el = document.getElementById(buttonId);
        el.onblur = (e) => {
            this.setAnimationProgress(Number(e.target.value));
        };
    }

    registerTimeLine(timeLineId) {
        // const timeline = document.getElementById(timeLineId);
        this.registerPlayPause('play-pause');
        this.registerNext('next');
        this.registerPrevious('previous');
        this.registerTimepointInput('timepoint-input');
        
        this.subscribeAnimationProgress((time, timeInPercentage) => {
            const el = document.getElementById('current-timepoint');
            el.innerHTML = time;
        })
    }

    // setting simulation parameters
    switchPlayPause() {
        this.simulation.switchPlayPause();
    }

    switchOutlineDisplay () {
        this.simCtx.drawCaseShipOutline = !this.simCtx.drawCaseShipOutline;
    }

    setNextFrame() {
        this.simulation.setNextAnimationTime();
    }

    setPreviousFrame() {
        this.simulation.setPreviousAnimationTime();
    }

    setAnimationProgressInPercentage(percentage) {
        const simulationTimePointCount = this.simCtx.timePointCount / this.simCtx.animationTimeInterval;
        console.log(Math.round(simulationTimePointCount*percentage) * this.simCtx.animationTimeInterval);
        this.simulation.setNextAnimationTimeToSpecificTimepoint(Math.round(simulationTimePointCount*percentage) * this.simCtx.animationTimeInterval);
    }

    setAnimationProgress(timePoint) {
        this.simulation.setNextAnimationTimeToSpecificTimepoint(timePoint);
    }

    // retrieving simulation parameters
    getAnimationProgressInPercentage() {
        return this.simulation.animationTime / this.simCtx.timePointCount;
    }

    subscribeAnimationProgress(callback) {
        this.simulation.onAnimationTimeCallback.push(callback);
    }

}