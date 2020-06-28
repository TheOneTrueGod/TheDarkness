import { saveMission, saveBattle } from "../datastore/datastore.js";
import Battle from "../../object_defs/Campaign/Mission/Battle/Battle.js"

function createBattle(mission) {
    const battle = new Battle(mission.battleIndex, mission.campaignId, mission.id, true);
    saveBattle(battle);
    mission.battleIndex += 1;
    return battle;
}

export function setupAsActive(mission) {
    mission.missionState = 'active';
    // Create test battle, and test event
    const battle = createBattle(mission);
    const newEvent = {
        eventType: 0,
        choice: 0,
        battleId: battle.id,
    };
    mission.events.push(newEvent);
    mission.currentEvent = newEvent;
    saveMission(mission);
}