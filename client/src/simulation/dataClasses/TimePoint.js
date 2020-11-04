
import ShipData from './ShipData';

export default class TimePoint {
    constructor(
        hawserDataArray,
        fenderData,
        posShipX,
        posShipY,
        rotationShip
    ) {
        this.hawserData = hawserDataArray;
        this.fenderData = fenderData;
        this.shipData = new ShipData(posShipX, posShipY, rotationShip);
    }
}