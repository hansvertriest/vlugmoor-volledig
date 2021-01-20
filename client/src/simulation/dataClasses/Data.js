import HawserData from './HawserData';
import FenderData from './FenderData';
import TimePoint from './TimePoint';
import { EventCollection } from '.';

export default class Data {
    constructor( caseMetaData ) {

        // content of Data-object
        this.caseMetaData = caseMetaData;
        this.timePoints = []; 
        const fenderLimits = {first: this.caseMetaData.fenderLimits.first, second: this.caseMetaData.fenderLimits.second}
        this.events = new EventCollection(this.caseMetaData.hawserLimits, fenderLimits);
    }

    get() {
        return {
            caseMetaData: this.caseMetaData,
            timePoints: this.timePoints,
            events: this.events.get()
        }
    }

    /**
     * Voeg de data van het forces- en coordinatesbestand toe aan het Data-object
     * @param {*} dataCoords 2D array met de coordinaten van de trossen: x = dataCoords[tros*2][time], y = dataCoords[time] [tros*2+1]
     * @param {*} dataForces 2D array met de krachten op de trossen: dataForces[time] [tros]
     * @param {*} shipTranslation 2D array met de beweging van het schip: x = shipTranslation[time][0], y = shipTranslation[time][1], rotation = shipTranslation[time][2]
     */
    async addTimePoints( dataCoords, dataForces, shipTranslation ) {
        return new Promise((resolve, reject) => {
            try {
              
                // loop over timestamps
                for (let time = 0; time < dataCoords.length -1; time ++) {
                    // 1 TROSSEN
                    // loop over hawsers and add every hawserData to the timePointHawserData
                    const timePointHawserData = [];
                    for (let hawser = 0; hawser < this.caseMetaData.bolderData.length; hawser ++) {
                        const columnNrInCoordsTable = hawser*2;
                        // make hawserData object
                        const hawserData = new HawserData(
                            hawser,
                            Number(dataCoords[time][(columnNrInCoordsTable)].replace(',','.')),
                            Number(dataCoords[time][(columnNrInCoordsTable) + 1].replace(',','.')),
                            Number(dataForces[time][hawser].replace(',','.')),
                            this.caseMetaData.bolderData[hawser].forceMax
                        );
                        
                        // if hawser is broken in this timePoint it will be registered
                        this.events.checkHawserForEvent(hawserData, time, time/dataCoords.length);

                        // Add hawserData data to timePointHawserData
                        timePointHawserData.push(hawserData);
                    }

                    // 2 FENDERS
                    // loop over fenders and add every fenderData to the timePointFenderData
                    const timePointFenderData = [];
                    for(let fender = 0; fender < this.caseMetaData.fenderData.length; fender++) {
                        // In de table zijn er eerst de forces op de trossen  en dan 3 translatie kolommen
                        const columnNrInForcesTable = this.caseMetaData.bolderData.length + 3 + fender;
                        // make fenderData object
                        const fenderData = new FenderData(
                            fender,
                            Number(dataForces[time][columnNrInForcesTable].replace(',','.')),
                            this.caseMetaData.fenderData[fender].forceMax
                        );

                        // if fender is broken in this timePoint it will be registered
                        this.events.checkFenderForEvent(fenderData, time, time/dataCoords.length);

                        // Add fenderData to timePointFenderData
                        timePointFenderData.push(fenderData);
                    }

                    // 3 TIMEPOINT
                    // create timePoint
                    const timePoint = new TimePoint(
                        timePointHawserData, 
                        timePointFenderData,
                        Number(shipTranslation[time][0].replace(',','.')),
                        Number(shipTranslation[time][1].replace(',','.')),
                        Number(shipTranslation[time][2].replace(',','.')),
                    )

                    // 4 PUSH TIMEPOINT
                    // add timePoint to timePoints
                    this.timePoints.push(timePoint);

                    if (this.timePoints.length === dataCoords.length) {
                        // resolve if all timePoints have been added
                        resolve(this);
                    }
                }
            } catch {
                reject();
            }

        });
    }
}