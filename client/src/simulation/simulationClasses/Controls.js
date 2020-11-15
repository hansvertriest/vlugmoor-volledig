export default class Controls {
    constructor(simCtx) {
        this.simCtx = simCtx;

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

    registerDrag(callback) {
        this.simCtx.canvas.addEventListener('mousedown', (e) => {
            this.mouseX = e.x;
            this.mouseY = e.y;
            this.mouseIsDown = true
        })
        this.simCtx.canvas.addEventListener('mouseup', () => this.mouseIsDown = false)
        window.addEventListener('mousemove', (e) => {
            if (this.mouseIsDown) {
                callback(e.y - this.mouseY)
                this.simCtx.moveOrigin(
                    (e.x - this.mouseX),
                    (e.y - this.mouseY),
                )
                this.mouseX = e.x;
                this.mouseY = e.y;
            }
        });
    }

    registerZoom(callback) {
        console.log('registering zoom')
        this.simCtx.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            callback(this.zoomRate * e.deltaY * -0.01);
        }, false);
    }

    registerOutlineSwitch() {
        
    }
}