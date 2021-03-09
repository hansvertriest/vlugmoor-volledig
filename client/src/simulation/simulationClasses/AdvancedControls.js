export default class AdvancedControls {

    constructor() {
        this.hawsersTimeline = document.getElementById("hawser-breakpoints");
        this.addHawserTimelines = document.getElementById(
            "sub-timeline-container-content-hawsers"
        );
        this.titleDivHawsers = document.getElementById(
            "sub-timeline-titles-hawsers"
        );
    
        this.fendersTimeline = document.getElementById("fender-breakpoints");
        this.addFenderTimelines = document.getElementById(
            "sub-timeline-container-content-fenders"
        );
        this.titleDivFenders = document.getElementById(
            "sub-timeline-titles-fenders"
        );

        this.registerButtons();
    }

    registerButtons() {
        this.hawserButton = document.getElementById("open-hawsers");
        this.hawserButton.addEventListener("click", () => {
            this.addHawserTimelines.classList.toggle("visible");
            this.titleDivHawsers.classList.toggle("visible");
        });

        this.fenderButton = document.getElementById("open-fenders");
        this.fenderButton.addEventListener("click", () => {
            this.addFenderTimelines.classList.toggle("visible");
            this.titleDivFenders.classList.toggle("visible");
        });
    }

    async addDataToHawsersTimeline(data, controls) {
        console.log('get data')
        const hawserDangerData = data.get().events.hawsers;
        const filteredHawserDangerData = hawserDangerData.filter((dataItem) => {
            return dataItem.limit === 0.5;
        });

        console.log('sort data')
        const hawserBreaksData = data.get().events.hawserBreaks;
        const sortedHawserBreaksData = hawserBreaksData.sort(
            (a, b) => a.id - b.id
        );


        console.log('add breaks html')
        let hawsersHTML = "";
        for (let i = 0; i < sortedHawserBreaksData.length; i++) {
            if (i % 2 === 0) {
                hawsersHTML += `
                <a href="#simulation-canvas" class="hawserbreak-btn">
                    <div style="left:${
                        sortedHawserBreaksData[i].timePointInPercentage * 100
                    }%" class="point top">
                        <div class="line"></div>
                    </div>
                </a>
                `;
            } else {
                hawsersHTML += `
                <a href="#simulation-canvas" class="hawserbreak-btn">
                    <div style="left:${
                        sortedHawserBreaksData[i].timePointInPercentage * 100
                    }%" class="point bottom">
                        <div class="line"></div>
                    </div>
                </a>
                `;
            }
        }
        this.hawsersTimeline.innerHTML = hawsersHTML;

        console.log('add subtimelines html')
        let subtimelinesHTML = "";
        if (sortedHawserBreaksData.length > 0) {
            sortedHawserBreaksData.map((dataItem) => {
                subtimelinesHTML += `
                <div class="sub-timeline-container-content" id="timeline-container">
                    <div id="timeline" class="timeline" data-type="hawser" data-id="${dataItem.id}"></div>
                </div>
                `;
            });
        } else {
            subtimelinesHTML += "<p>Er is geen data.</p>";
        }
        if (hawsersHTML !== null) {
            this.addHawserTimelines.innerHTML = subtimelinesHTML;
        }

        console.log('add event listeners')
        const breakEventButtons = document.querySelectorAll(".hawserbreak-btn");
        for (let i = 0; i < breakEventButtons.length; i++) {
            breakEventButtons[i].addEventListener("click", () => {
                controls.setAnimationProgress(
                    sortedHawserBreaksData[i].timePointIndex
                );
                controls.setPause();
            });
        }

        console.log('addTitles')
        this.addTitles(sortedHawserBreaksData, this.titleDivHawsers);
        console.log('addDangerZonesToSubtimelines')
        this.addDangerZonesToSubtimelines(
            filteredHawserDangerData,
            "hawser",
            controls
        );
        console.log('addBreakpointsToSubtimelines')
        this.addBreakpointsToSubtimelines(
            sortedHawserBreaksData,
            "hawser",
            controls
        );
    };

    async addDataToFendersTimeline(data, controls) {
        const fenderDangerData = data.get().events.fender;
        const filteredFenderDangerData = fenderDangerData.filter((dataItem) => {
            return dataItem.limit === 0.5;
        });

        const fenderBreaksData = data.get().events.fenderBreaks;
        const sortedFenderBreaksData = fenderBreaksData.sort(
            (a, b) => a.id - b.id
        );

        let fendersHTML = "";
        for (let i = 0; i < sortedFenderBreaksData.length; i++) {
            if (i % 2 === 0) {
                fendersHTML += `
                <a href="#simulation-canvas" class="fenderbreak-btn">
                    <div style="left:${
                        sortedFenderBreaksData[i].timePointInPercentage * 100
                    }%" class="point top">
                        <div class="line"></div>
                    </div>
                </a>
                `;
            } else {
                fendersHTML += `
                <a href="#simulation-canvas" class="fenderbreak-btn">
                    <div style="left:${
                        sortedFenderBreaksData[i].timePointInPercentage * 100
                    }%" class="point bottom">
                        <div class="line"></div>
                    </div>
                </a>
                `;
            }
        }
        if (fendersHTML !== null) {
            this.fendersTimeline.innerHTML = fendersHTML;
        }

        let subtimelinesHTML = "";
        if (sortedFenderBreaksData.length > 0) {
            sortedFenderBreaksData.map((dataItem) => {
                subtimelinesHTML += `
                <div class="sub-timeline-container-content" id="timeline-container">
                    <div id="timeline" class="timeline" data-type="fender" data-id="${dataItem.id}"></div>
                </div>
                `;
            });
        } else {
            subtimelinesHTML += "<p>Er is geen data.</p>";
        }
        this.addFenderTimelines.innerHTML = subtimelinesHTML;

        const breakEventButtons = document.querySelectorAll(".fenderbreak-btn");
        for (let i = 0; i < breakEventButtons.length; i++) {
            breakEventButtons[i].addEventListener("click", () => {
                controls.setAnimationProgress(
                    sortedFenderBreaksData[i].timePointIndex
                );
                controls.setPause();
            });
        }

        this.addTitles(sortedFenderBreaksData, titleDivFenders);
        this.addDangerZonesToSubtimelines(
            filteredFenderDangerData,
            "fender",
            controls
        );
        this.addBreakpointsToSubtimelines(
            sortedFenderBreaksData,
            "fender",
            controls
        );
    };

    addTitles(data, container) {
        let subtimelinesTitles = "";
        data.map((dataItem) => {
            subtimelinesTitles += `
            <div class="sub-timeline-title">
                <p>ID: ${dataItem.id}</p>
            </div>
            `;
        });
        container.innerHTML += subtimelinesTitles;
    };

    addBreakpointsToSubtimelines(data, type, controls) {
        let allTimelines = document.querySelectorAll(".timeline");
        allTimelines = [...allTimelines];
        let currentTimeline = null;
        data.map((dataItem) => {
            currentTimeline = allTimelines.find((timeline) => {
                return (
                    timeline.dataset.type === type &&
                    timeline.dataset.id === dataItem.id.toString()
                );
            });

            let subtimelineHTML = `
            <a href="#simulation-canvas" class="${type}break-btn">
                <div style="left:${
                    dataItem.timePointInPercentage * 100
                }%" class="point"></div>
            </a>
            `;

            currentTimeline.innerHTML += subtimelineHTML;
        });

        const breakEventButtons = document.querySelectorAll(
            `.${type}break-btn`
        );
        for (let i = 0; i < breakEventButtons.length; i++) {
            breakEventButtons[i].addEventListener("click", () => {
                controls.setAnimationProgress(
                    data[i < data.length ? i : i - data.length].timePointIndex
                );
                controls.setPause();
            });
        }
    };

    addDangerZonesToSubtimelines(data, type, controls) {
        let allTimelines = document.querySelectorAll(".timeline");
        allTimelines = [...allTimelines];
        let currentTimeline = null;
        data.map((dataItem) => {
            currentTimeline = allTimelines.find((timeline) => {
                return (
                    timeline.dataset.type === type &&
                    timeline.dataset.id === dataItem.id.toString()
                );
            });

            let subtimelineHTML = `
            <a href="#simulation-canvas">
                <div class="point-danger" data-timestamp="${
                    dataItem.timePointIndex
                }" style="left:${dataItem.timePointInPercentage * 100}%"></div>
            </a>
            `;

            currentTimeline.innerHTML += subtimelineHTML;
        });

        const dangerZoneButton = document.querySelectorAll(`.point-danger`);
        console.log(dangerZoneButton.length)
        for (let i = 0; i < dangerZoneButton.length; i++) {
            dangerZoneButton[i].addEventListener("click", () => {
                controls.setAnimationProgress(
                    dangerZoneButton[i].dataset.timestamp
                );
                controls.setPause();
            });
        }
    };
} 