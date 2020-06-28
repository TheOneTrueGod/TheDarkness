import BattleMap from "./BattleMap.js";
import BattleUnit from "./BattleUnit.js";

const ObjectVersion = 1;

class Battle {
    constructor(id, campaignId, missionId, initialize = true) {
        this.id = id;
        this.campaignId = campaignId;
        this.missionId = missionId;

        this.battleMap = initialize ? new BattleMap() : null;
        this.unitList = [];
        this.initiativeNumber = 0;
    }

    static fromJSONObject(jsonData) {
        if (jsonData._v !== ObjectVersion) { 
            throw new Error(`Battle Json Data Version Mismatch.  Current version: ${ObjectVersion}.  Json version: ${jsonData._v}`);
        }
        const battle = new Battle(jsonData.id, jsonData.campaignId, jsonData.missionId, false);
        battle.battleMap = BattleMap.fromJSONObject(jsonData.battleMap);
        battle.unitList = jsonData.unitList.map(unitJSONData =>
            BattleUnit.fromJSONObject(unitJSONData)
        );
        battle.initiativeNumber = jsonData.initiativeNumber;
        return battle;
    }

    toJSONObject() {
        return {
            _v: ObjectVersion,
            id: this.id,
            campaignId: this.campaignId,
            missionId: this.missionId,

            battleMap: this.battleMap.toJSONObject(),
            unitList: this.unitList.map(unit => unit.toJSONObject() ),
            initiativeNumber: this.initiativeNumber
        };
    }
};

export default Battle;
