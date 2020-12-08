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
            fenderBreaks: this.fenders.filter((fenderEvent) => !fenderEvent.hasAlreadySurpassedLimit && fenderEvent.limit * 2 >= this.fenderLimits.first + this.fenderLimits.second),
        }
    }

    getHawserBreaks() {
        return this.hawsers.filter((hawserEvent) => !hawserEvent.hasAlreadySurpassedLimit && hawserEvent.limit * 2 >= this.hawserLimits.first + this.hawserLimits.second);
    }

    getFenderBreaks() {
        return this.fenders.filter((fenderEvent) => !fenderEvent.hasAlreadySurpassedLimit && fenderEvent.limit * 2 >= this.fenderLimits.first + this.fenderLimits.second);
    }

    checkHawserForEvent(hawserData, time, timePointInPercentage) {
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


                this.hawsers.push(this.constructLimitEvent(hawserData.id, time, timePointInPercentage, limit, hawserData.loadRatio, hasAlreadySurpassedLimit))       
            } 
        });
    }

    checkFenderForEvent(fenderData, time, timePointInPercentage) {
        Object.values(this.fenderLimits).forEach((limit) => {
            if (fenderData.loadRatio > limit) {
                // check if this hawser has already surpassed this limit
                let hasAlreadySurpassedLimit = false;
                let iterator = 0;
                while (!hasAlreadySurpassedLimit && iterator < this.fenders.length) {
                    const iteratedFender = this.fenders[iterator];
                    if (iteratedFender.id == fenderData.id) {
                        hasAlreadySurpassedLimit = iteratedFender.limit === limit;
                    }
                    iterator++;
                }


                this.fenders.push(this.constructLimitEvent(fenderData.id, time, timePointInPercentage, limit, fenderData.loadRatio, hasAlreadySurpassedLimit))       
            } 
        });
    }

    constructLimitEvent(id, timePointIndex, timePointInPercentage, limit, loadRatio, hasAlreadySurpassedLimit) {
        return {
            id,
            timePointIndex,
            timePointInPercentage,
            limit,
            loadRatio,
            hasAlreadySurpassedLimit
        }
    }

}

