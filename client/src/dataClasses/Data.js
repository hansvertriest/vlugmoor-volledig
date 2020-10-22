import HawserData from './HawserData';
import TimePoint from './TimePoint';

export default class Data {
    constructor( bolderData ) {
        this.bolderData = bolderData;
        this.timePoints = []; // will contain bolder info at specific timepoint
    }

    async addTimePoints( dataCoords, dataForces, shipTranslation ) {
        return new Promise((resolve, reject) => {
            // loop over timestamps
            for (let time = 0; time < dataCoords.length; time ++) {
                // loop over hawsers and add every hawserData to the timePointHawserData
                const timePointHawserData = [];
                for (let hawser = 0; hawser < this.bolderData.length; hawser ++) {
                    // make hawserData object
                    const hawserData = new HawserData(
                        Number(dataCoords[time][(hawser*2)].replace(',','.')),
                        Number(dataCoords[time][(hawser*2) + 1].replace(',','.')),
                        Number(dataForces[time][hawser].replace(',','.'))
                    );
                    // Add hawserData data to timePointHawserData
                    timePointHawserData.push(hawserData);
                }

                // create timePoint
                const timePoint = new TimePoint(
                    timePointHawserData, 
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


}