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

    /**
     * Laad de afbeeldig
     */
    async loadImage() {
        return new Promise((resolve, reject) => {
            this.image.onload = function(){
                this.imageIsLoaded = true;
                console.log('Bolder image loaded');
                resolve();
            }.bind(this);
        });
    }

    /**
     * Voer alle teken-bewgingen uit om dit object op het canvas te tonen
     *      Meet info over het HTML5 canvas: https://developer.mozilla.org/nl/docs/Web/API/Canvas_API
     * @param {*} ctx Instantie van een SimulationContext
     */
    draw() {
        this.simCtx.ctx.drawImage(this.image, this.middleX-50, this.middleY-50, 100, 100);
    }
}