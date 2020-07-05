import { positionToTileCoord } from "../BattleHelpers";
import UnitManager from "./UnitManager";
import BattleUnit from "../BattleUnits/BattleUnit";
import { TileCoord } from "../BattleTypes";

export default class InteractionHandler {
    unitManager: UnitManager;

    constructor(unitManager: UnitManager) {
        this.unitManager = unitManager;
    }

    clickOnUnit(
        selectedUnit: BattleUnit,
        unitSelectedCallback: Function
    ) {
        unitSelectedCallback(selectedUnit);
    }

    clickOnTerrain(tileCoord: TileCoord) {

    }

    addEventListeners (
        container: PIXI.Container,
        unitSelectedCallback: Function
    ) {
        container.interactive = true;
        container.on("mousedown", (event: PIXI.InteractionEvent) => {
            const tileCoord = positionToTileCoord(event.data.global);
            
            const targetUnit = this.unitManager.getUnitAtTileCoord(tileCoord);
            if (targetUnit) {
                this.clickOnUnit(targetUnit, unitSelectedCallback);
            } else {
                this.clickOnTerrain(tileCoord);
            }
        });
    }
}
