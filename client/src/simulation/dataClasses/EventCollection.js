export default class EventCollection {
    constructor(hawserLimits, fenderLimits) {
        this.hawserLimits = hawserLimits;
        this.fenderLimits = fenderLimits;
        this.hawsers = [];
        this.fenders = [];    
    }

    get() {
        return {
            hawserLimits: this.hawserLimits,
            fenderLimits: this.fenderLimits,
            hawsers: this.hawsers,
            hawserBreaks: this.hawsers.filter((hawserEvent) => !hawserEvent.hasAlreadySurpassedLimit && hawserEvent.limit * 2 >= this.hawserLimits.first + this.hawserLimits.second),
            fender: this.fenders,
        }
    }

    checkHawserForEvent(hawserData, time) {
        Object.values(this.hawserLimits).forEach((limit) => {
            if (hawserData.loadRatio > limit) {

                // check if thia hawser has already surpassed this limit
                let hasAlreadySurpassedLimit = false;
                let iterator = 0;
                while (!hasAlreadySurpassedLimit && iterator < this.hawsers.length) {
                    const iteratedHawser = this.hawsers[iterator];
                    if (iteratedHawser.id == hawserData.id) {
                        hasAlreadySurpassedLimit = iteratedHawser.limit === limit;
                    }
                    iterator++;
                }


                this.hawsers.push(this.constructLimitEvent(hawserData.id, time, limit, hawserData.loadRatio, hasAlreadySurpassedLimit))       
            } 
        });
    }

    constructLimitEvent(id, timePointIndex, limit, loadRatio, hasAlreadySurpassedLimit) {
        return {
            id,
            timePointIndex,
            limit,
            loadRatio,
            hasAlreadySurpassedLimit
        }
    }

}

