
import ShipData from './ShipData';

export default class TimePoint {
    constructor(
        hawserDataArray,
        fenderDataArray,
        windDataObject,
        posShipX,
        posShipY,
        rotationShip
    ) {
        this.hawserData = hawserDataArray;
        this.fenderData = fenderDataArray;
        this.windData = windDataObject;
        this.shipData = new ShipData(posShipX, posShipY, rotationShip);
    }
}