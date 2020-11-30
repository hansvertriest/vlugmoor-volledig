import HawserData from './HawserData';
import FenderData from './FenderData';
import TimePoint from './TimePoint';
import HawserBreak from './HawserBreak';

export default class Data {
    constructor( caseMetaData ) {
        this.caseMetaData = caseMetaData;

        // this.bolderData = this.caseMetaData.bolderData;
        // this.fenderData = this.caseMetaData.fenderData;
        this.timePoints = []; // will contain all data at specific timepoint
        this.hawserBreakingTimePoints = [];
    }

    async addTimePoints( dataCoords, dataForces, shipTranslation ) {
        return new Promise((resolve, reject) => {
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
                    
                    // if hawser is broken in this timePoint for the first time in the sim => register this timePoint
                    this.registerBreakingTimePoint(hawserData, time);

                    // Add hawserData data to timePointHawserData
                    timePointHawserData.push(hawserData);
                }

                // loop over fenders and add every fenderData to the timePointFenderData
                const timePointFenderData = [];
                for(let fenderNr = 0; fenderNr < this.caseMetaData.fenderData.length; fenderNr++) {
                    // In de table zijn er eerst de forces op de trossen  en dan 3 translatie kolommen
                    const columnNrInForcesTable = this.caseMetaData.bolderData.length + 3 + fenderNr;
                    // make fenderData object
                    const fenderData = new FenderData(
                        Number(dataForces[time][columnNrInForcesTable].replace(',','.'))
                    );
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
        });
    }

    registerBreakingTimePoint(hawserData, time) {
        if (this.checkIfHawserHasBroken(hawserData.loadRatio, this.caseMetaData.hawserLimits.first) && !this.checkIfHawserAlreadyHasBroken(hawserData.id)) {
            const hawserBreak = new HawserBreak(
                hawserData.id,
                time,
                hawserData.loadRatio
            )
            this.hawserBreakingTimePoints.push(hawserBreak);
        }
    }

    checkIfHawserHasBroken(ratio, limit) {
        if (ratio > limit) {
            return true;
        }
        return false;
    }

    checkIfHawserAlreadyHasBroken(id) {
        return this.hawserBreakingTimePoints.filter((hawserBreak) => hawserBreak.hawserId === id).length > 0;
    }

    getTimePoint(index) {
        return this.timePoints[index];
    }
}