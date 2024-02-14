const ObjectVersion = 1;

class Turn {
  constructor(
    id,
    campaignId,
    missionId,
    battleId,
    playerIDs,
    initialize = true
  ) {
    this.id = id;
    this.campaignId = campaignId;
    this.missionId = missionId;
    this.battleDef = battleDef;

    this.battleMap = initialize ? new BattleMap() : null;
    this.unitIndex = 1;
    this.unitList = [];
    this.initiativeNumber = 0;
    this.currentTurn = { owner: playerIDs[0], team: "players" };
    this.playerIDs = playerIDs;
    this.status = "IN_PROGRESS";

    this.caravanPosition = { x: 5, y: 5 };
  }

  static fromJSONObject(jsonData) {
    if (jsonData._v !== ObjectVersion) {
      throw new Error(
        `Battle Json Data Version Mismatch.  Current version: ${ObjectVersion}.  Json version: ${jsonData._v}`
      );
    }
    const battle = new Battle(
      jsonData.id,
      jsonData.campaignId,
      jsonData.missionId,
      { objective: { type: "Exterminate" } },
      jsonData.playerIDs,
      false
    );

    battle.battleMap = BattleMap.fromJSONObject(jsonData.battleMap);
    battle.unitList = jsonData.unitList.map((unitJSONData) => null);
    battle.initiativeNumber = jsonData.initiativeNumber;
    battle.caravanPosition = jsonData.caravanPosition;
    battle.unitIndex = jsonData.unitIndex;
    battle.currentTurn = jsonData.currentTurn;
    battle.status = jsonData.status;
    return battle;
  }

  toJSONObject() {
    return {
      _v: ObjectVersion,
      id: this.id,
      campaignId: this.campaignId,
      missionId: this.missionId,
      battleDef: this.battleDef,

      battleMap: this.battleMap.toJSONObject(),
      unitList: this.unitList.map((unit) => unit.toJSONObject()),
      caravanPosition: this.caravanPosition,
      initiativeNumber: this.initiativeNumber,
      unitIndex: this.unitIndex,

      currentTurn: this.currentTurn,
      playerIDs: this.playerIDs,

      status: this.status,
    };
  }
}

export default Battle;
