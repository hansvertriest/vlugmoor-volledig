import HawserData from './HawserData';
import FenderData from './FenderData';
import TimePoint from './TimePoint';
import HawserBreak from './HawserBreak';
import { EventCollection } from '.';

export default class Data {
    constructor( caseMetaData ) {
        this.caseMetaData = caseMetaData;

        // this.bolderData = this.caseMetaData.bolderData;
        // this.fenderData = this.caseMetaData.fenderData;
        this.timePoints = []; // will contain all data at specific timepoint

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

    async addTimePoints( dataCoords, dataForces, shipTranslation ) {
        return new Promise((resolve, reject) => {
            try {
              
                // loop over timestamps
                for (let time = 0; time < dataCoords.length -1; time ++) {
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

                    // create timePoint
                    const timePoint = new TimePoint(
                        timePointHawserData, 
                        timePointFenderData,
                        Number(shipTranslation[time][0].replace(',','.')),
                        Number(shipTranslation[time][1].replace(',','.')),
                        Number(shipTranslation[time][2].replace(',','.')),
                    )

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