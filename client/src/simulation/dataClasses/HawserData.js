export default class HawserData {
    constructor(id, posXShip, posYShip, force, maxForce) {
        this.id = id;
        this.posXShip = posXShip;
        this.posYShip = posYShip;
        this.force = force;

        this.loadRatio = this.force / maxForce;
    }

}