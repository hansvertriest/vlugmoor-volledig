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

    /*
        Register basic nav
    */

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
        this.simCtx.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.simCtx.addToMeterToPxFactor(this.zoomRate * e.deltaY * -0.01);
        }, false);
    }

    /*
        Register controls
    */

    registerOutlineSwitch(buttonId) {
        const bttn = document.getElementById(buttonId);
        bttn.checked = this.simCtx.drawCaseShipOutline;
        bttn.onclick = () => {
            this.switchOutlineDisplay();
        };
    }

    registerOutlineReset(buttonId) {
        const bttn = document.getElementById(buttonId);
        bttn.onclick = () => {
            this.setOutlineToCurrentPosition();
        };
    }

    registerTimeLine() {
        this.registerPlayPause('play-pause');
        this.registerNext('next');
        this.registerPrevious('previous');
        this.registerTimepointInput('timepoint-input')
        this.registerTimeInput('time-input')
        this.registerSpeedInput('speed-input');
        
        this.subscribeAnimationProgress((simInfo) => {
            // old time line
            const time = document.getElementById('current-time');
            time.innerHTML = (simInfo.timePoint * this.simulation.timePointInterval).toFixed(1);

            const timepoint = document.getElementById('current-timepoint');
            timepoint.innerHTML = simInfo.timePoint;

            const fps = document.getElementById('current-fps');
            fps.style.color =(this.simCtx.fps - 3 > this.simulation.calculatedFPS || this.simCtx.fps + 3 < this.simulation.calculatedFPS) ? "red" : "black";
            fps.innerHTML = simInfo.calculatedFPS;

            const speed = document.getElementById('current-speed');
            speed.innerHTML = Math.round(simInfo.speed);

            const progress = document.getElementById('timeline-progress');
            progress.style.width = `${simInfo.timePointInPercentage*100}%`;
        })

        document.getElementById('timeline-container').onclick = (e) => {
            const xCoord = e.offsetX;
            const fullWidth = document.getElementById('timeline-container').offsetWidth;
            console.log(xCoord, fullWidth)
            this.setAnimationProgressInPercentage(xCoord/fullWidth);
        }
        
    }

    registerPlayPause(buttonId) {
        const bttn = document.getElementById(buttonId);
        bttn.onclick = (e) => {
            if (!e.target.getAttribute('isPlaying')) {
                e.target.src = e.target.getAttribute('srcPlay');
                e.target.setAttribute('isPlaying', "true");
            } else {
                e.target.src = e.target.getAttribute('srcPause');
                e.target.setAttribute('isPlaying', "");
            }
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
        el.onchange = (e) => {
            this.setAnimationProgressWithTimepoint(Number(e.target.value));
        };
    }
    
    registerTimeInput(buttonId) {
        const el = document.getElementById(buttonId);
        el.onchange = (e) => {
            this.setAnimationProgressWithTime(Number(e.target.value));
        };
    }

    registerSpeedInput(buttonId) {
        const el = document.getElementById(buttonId);
        el.onchange = (e) => {
            if (e.target.value != '') this.setSpeed(Number(e.target.value));
        };
    }

    registerScreenshotBttn(buttonId) {
        const el = document.getElementById(buttonId);
        el.onclick = (e) => {
            this.simulation.getScreenshot();
        };
    }

    /* 
        Setting simulation parameters
    */

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
        const simulationTimePointCount = this.simulation.timePointCount / this.simCtx.animationTimeInterval;
        this.simulation.setNextAnimationTimeToSpecificTimepoint(Math.round(simulationTimePointCount*percentage) * this.simCtx.animationTimeInterval);
    }

    setAnimationProgressWithTimepoint(timePoint) {
        if (timePoint >= 0 && timePoint < this.simulation.timePointCount -1) this.simulation.setNextAnimationTimeToSpecificTimepoint(timePoint);
    }

    setAnimationProgressWithTime(time) {
        const timePoint = time/this.simulation.timePointInterval;
        if (timePoint >= 0 && timePoint < this.simulation.timePointCount -1) this.simulation.setNextAnimationTimeToSpecificTimepoint(timePoint);
    }

    setSpeed(speed) {
        if (speed >= 1) {
            const animationTimeInterval = speed/(this.simCtx.fps*this.simulation.timePointInterval);
    
            // if animationInterval < 1 => less than one timePoint per frame
            if (animationTimeInterval < 1 ) {
                this.simulation.setFPS(10)
                this.simCtx.setAnimationTimeInterval(1);
            } else {
                this.simulation.setFPS(this.simCtx.initFPS)
                this.simCtx.setAnimationTimeInterval(speed/(this.simCtx.fps*this.simulation.timePointInterval));
            }
        }
    }

    setOutlineToCurrentPosition() {
        this.simulation.caseShip.setOutlineParamsToCurrentPosition();
    }

    /* 
        Getting simulation parameters
    */

    getAnimationProgressInPercentage() {
        return this.simulation.animationTime / this.simCtx.timePointCount;
    }

    subscribeAnimationProgress(callback) {
        this.simulation.onAnimationTimeCallback.push(callback);
    }

}