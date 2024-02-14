import Battle from "../../object_defs/Campaign/Mission/Battle/Battle.js";
import { loadBattle, saveBattle } from "../datastore/datastore.js";

class BattleEndpoint {
  static getResponse(user, uri, request, body) {
    if (uri.startsWith("/api/battle/orders")) {
      if (request.method === "POST") {
        const battle = this.getBattle(
          body.campaignId,
          body.missionId,
          body.battleId
        );
        // body.turnId
        return battle;
      }
      throw new Error(
        `Unhandled request at ${request.method} /api/battle/orders. Battle: '${battleId}' Mission:'${missionId}' Campaign:'${campaignId}'!`
      );
    }

    if (request.method === "POST" && body && body.missionId !== undefined) {
      return this.getBattle(body.campaignId, body.missionId, body.battleId);
    }
  }

  static getBattle(campaignId, missionId, battleId) {
    const battleJSON = loadBattle(campaignId, missionId, battleId);
    const battle = Battle.fromJSONObject(battleJSON);

    if (battle) {
      return battle.toJSONObject();
    }
    throw new Error(
      `Battle '${battleId}' from Mission '${missionId}' from Campaign '${campaignId}' not found!`
    );
  }
}

export { BattleEndpoint };
