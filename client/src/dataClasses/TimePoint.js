
import ShipData from './ShipData';

export default class TimePoint {
    constructor(
        hawserDataArray,
        posShipX,
        posShipY,
        rotationShip
    ) {
        this.hawserData = hawserDataArray;
        this.shipData = new ShipData(posShipX, posShipY, rotationShip);
    }
}