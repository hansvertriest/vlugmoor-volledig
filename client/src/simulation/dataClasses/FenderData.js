export default class FenderData {
    constructor(id, currentForce, forceMax) {
        this.id = id;
        this.force = currentForce;
        this.forceMax = forceMax;

        this.loadRatio = currentForce / forceMax;
    }
}