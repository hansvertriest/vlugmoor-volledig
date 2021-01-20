
import ShipData from './ShipData';

export default class TimePoint {
    constructor(
        hawserDataArray,
        fenderDataArray,
        posShipX,
        posShipY,
        rotationShip
    ) {
        this.hawserData = hawserDataArray;
        this.fenderData = fenderDataArray;
        this.shipData = new ShipData(posShipX, posShipY, rotationShip);
    }
}