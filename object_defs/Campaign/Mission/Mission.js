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
        this.pastBattleIds = [];
        this.activeBattleId = 0;
        this.battleIndex = 1;
        this.unitList = [];
    }

    static fromJSONObject(jsonData) {
        if (jsonData._v !== ObjectVersion) { 
            throw new Error(`Mission Json Data Version Mismatch.  Current version: ${ObjectVersion}.  Json version: ${jsonData._v}`);
        }
        const mission = new Mission(jsonData.id, jsonData.name);
        mission.missionState = jsonData.missionState;
        mission.creatorId = jsonData.creatorId;
        mission.pastBattleIds = jsonData.pastBattleIds;
        mission.activeBattleId = jsonData.activeBattleId;
        mission.battleIndex = jsonData.battleIndex;
        mission.unitList = jsonData.unitList.map((missionUnit) => { return MissionUnit.fromJSONObject(missionUnit); })
        return mission;
    }

    toJSONObject() {
        return {
            _v: ObjectVersion,
            id: this.id,
            campaignId: this.campaignId,
            missionState: this.missionState,
            creatorId: this.creatorId,
            pastBattleIds: this.pastBattleIds,
            activeBattleId: this.activeBattleId,
            battleIndex: this.battleIndex,
            unitList: this.unitList.map((missionUnit) => missionUnit.toJSONObject())
        };
    }
};

export default Mission;
