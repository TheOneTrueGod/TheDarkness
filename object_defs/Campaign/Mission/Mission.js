import MissionUnit from "./MissionUnit.js";

const ObjectVersion = 1;

export const MissionState = {
    planning: 'planning',
    active: 'active',
    finished: 'finished',
}

class Mission {
    constructor(id, campaignId, creatorId) {
        this.id = id;
        this.campaignId = campaignId;
        this.missionState = 'planning';
        this.creatorId = creatorId;
        this.events = [];
        this.battleIndex = 1;

        this.unitList = [];
        this.caravan = {
            unitSlots: 4,
            unitList: [],

            cargoList: [],
            weightLimit: 20,
        }
    }

    static fromJSONObject(jsonData) {
        if (jsonData._v !== ObjectVersion) { 
            throw new Error(`Mission Json Data Version Mismatch.  Current version: ${ObjectVersion}.  Json version: ${jsonData._v}`);
        }
        const mission = new Mission(jsonData.id, jsonData.campaignId, jsonData.name);
        mission.missionState = jsonData.missionState;
        mission.creatorId = jsonData.creatorId;
        mission.events = jsonData.events;

        const caravan = jsonData.caravan;
        mission.caravan = {
            unitSlots: caravan.unitSlots,
            unitList: caravan.unitList.map((missionUnit) => { return MissionUnit.fromJSONObject(missionUnit); }),

            cargoList: caravan.cargoList,
            weightLimit: caravan.weightLimit,
        }

        mission.events = jsonData.events;
        mission.currentEvent = jsonData.currentEvent;
        mission.battleIndex = jsonData.battleIndex;
        return mission;
    }

    toJSONObject(includeAllEvents = true) {
        const jsonObject = {
            _v: ObjectVersion,
            id: this.id,
            campaignId: this.campaignId,
            missionState: this.missionState,
            creatorId: this.creatorId,
            events: this.events,
            battleIndex: this.battleIndex,
            
            caravan: {
                unitSlots: this.caravan.unitSlots,
                unitList: this.caravan.unitList.map((missionUnit) => missionUnit.toJSONObject()),

                cargoList: this.caravan.cargoList,
                weightLimit: this.caravan.weightLimit,
            }
        };

        if (includeAllEvents) {
            jsonObject.events = this.events;
        } else {
            jsonObject.events = [];
            jsonObject.currentEvent = this.events.length ? this.events[this.events.length - 1] : undefined;
        }

        return jsonObject;
    }
};

export default Mission;
