import vlugmoor from '../../assets/images/vlugmoor.png'

export default class LoadingScreen {
    constructor(simCtx) {
        this.simCtx = simCtx;

        this.posX = 0;
        this.posY = 0;

        this.middleX = this.simCtx.canvas.width/2;
        this.middleY = this.simCtx.canvas.height/2;

        this.image = new Image();
        this.image.src = vlugmoor;
        this.imageIsLoaded = false;
    }

    async loadImage() {
        return new Promise((resolve, reject) => {
            this.image.onload = function(){
                this.imageIsLoaded = true;
                console.log('Bolder image loaded');
                resolve();
            }.bind(this);
        });
    }

    draw() {
        this.simCtx.ctx.drawImage(this.image, this.middleX, this.middleY, 100, 100);
    }
}