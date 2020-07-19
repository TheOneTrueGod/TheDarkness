import Battle from "../../object_defs/Campaign/Mission/Battle/Battle.js";
import { loadBattle, saveBattle } from "../datastore/datastore.js";

class BattleEndpoint {
    static getResponse(user, uri, request, body) {
        if (request.method === 'POST' && body && body.missionId !== undefined) {
            return this.getBattle(body.campaignId, body.missionId, body.battleId);
        }
    }

    static createBattle(user, mission) {
        const newId = mission.battleIndex;
        const newBattle = new Battle(newId, mission.campaignId, mission.id, false, user.id);
        mission.battleIndex += 1;
        saveMission(mission);
        saveBattle(newBattle);
        return newMission;
    }

    static getBattle(campaignId, missionId, battleId) {
        const battleJSON = loadBattle(campaignId, missionId, battleId);
        const battle = Battle.fromJSONObject(battleJSON);
        
        if (battle) {
            return battle.toJSONObject();
        }
        throw new Error(`Battle '${battleId}' from Mission '${missionId}' from Campaign '${campaignId}' not found!`);
    }
}

export {
    BattleEndpoint
};