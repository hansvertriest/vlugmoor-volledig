export default class EventCollection {
    constructor(hawserLimits, fenderLimits) {
        console.log(hawserLimits, fenderLimits)
        this.hawserLimits = hawserLimits;
        this.fenderLimits = fenderLimits;

        // content of EventCollection-object
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

    /**
     * Get alle events in this.hawsers die de eerste limiet overschrijden
     */
    getHawserBreaks() {
        return this.hawsers.filter((hawserEvent) => !hawserEvent.hasAlreadySurpassedLimit && hawserEvent.limit * 2 >= this.hawserLimits.first + this.hawserLimits.second);
    }

    /**
     * Get alle events in this.fenders die de eerste limiet overschrijden
     */
    getFenderBreaks() {
        return this.fenders.filter((fenderEvent) => !fenderEvent.hasAlreadySurpassedLimit && fenderEvent.limit * 2 >= this.fenderLimits.first + this.fenderLimits.second);
    }

    /**
     * Check of de opgegeven tros een bepaalde limite overschrijdt. Zo ja, voeg deze toe aan this.hawsers
     * @param {*} hawserData instantie van de HawserData-klasse
     * @param {*} time recordIndex
     * @param {*} timePointInPercentage recordIndex / totalRecords
     */
    checkHawserForEvent(hawserData, time, timePointInPercentage) {
        // loop over alle hawser limieten
        Object.values(this.hawserLimits).forEach((limit) => {
            // als de limiet overschreden is
            if (hawserData.loadRatio > limit) {
                // check if this hawser has already surpassed this limit
                let hasAlreadySurpassedLimit = false;
                let iterator = 0;
                while (!hasAlreadySurpassedLimit && iterator < this.hawsers.length) {
                    const iteratedHawser = this.hawsers[iterator];
                    if (iteratedHawser.id == hawserData.id) {
                        hasAlreadySurpassedLimit = iteratedHawser.limit === limit;
                    }
                    iterator++;
                }

                // maak een event aan en voeg deze toe bij this.hawsers
                this.hawsers.push(this.constructLimitEvent(hawserData.id, time, timePointInPercentage, limit, hawserData.loadRatio, hasAlreadySurpassedLimit))       
            } 
        });
    }

    /**
     * 
     * @param {*} fenderData instantie van de FenderData-klasse
     * @param {*} time recordIndex
     * @param {*} timePointInPercentage recordIndex / totalRecords
     */
    checkFenderForEvent(fenderData, time, timePointInPercentage) {
        // loop over alle fender limieten
        Object.values(this.fenderLimits).forEach((limit) => {
            // als de limiet overschreden is
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

                // maak een event aan en voeg deze toe bij this.fenders
                this.fenders.push(this.constructLimitEvent(fenderData.id, time, timePointInPercentage, limit, fenderData.loadRatio, hasAlreadySurpassedLimit))       
            } 
        });
    }

    /**
     * Maak een universeel event aan
     * @param {*} id van het object (Fender-/HawserData)
     * @param {*} timePointIndex recordIndex
     * @param {*} timePointInPercentage recordIndex / totalRecords
     * @param {*} limit overscheden limiet
     * @param {*} loadRatio de belading op de fender/tros
     * @param {*} hasAlreadySurpassedLimit boolean of de limiet al eens werd overschreden of niet
     */
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

