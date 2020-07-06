import { positionToTileCoord, getCardinalDirectionFromAngle } from "../BattleHelpers";
import UnitManager from "./UnitManager";
import BattleUnit, { AbilityPointType } from "../BattleUnits/BattleUnit";
import { TileCoord, CardinalDirection } from "../BattleTypes";
import UnitOrder, { OrderType } from "../BattleUnits/UnitOrder";
import { MOUSE_BUTTON_LEFT, MOUSE_BUTTON_RIGHT } from "../BattleConstants";

export default class InteractionHandler {
    unitManager: UnitManager;
    selectedUnit: BattleUnit | null;

    constructor(unitManager: UnitManager) {
        this.unitManager = unitManager;
        this.selectedUnit = null;
    }

    clickOnUnit(
        selectedUnit: BattleUnit,
        unitSelectedCallback: Function
    ) {
        this.selectedUnit = selectedUnit;
        unitSelectedCallback(selectedUnit);
    }

    clickOnTerrain(tileCoord: TileCoord) {

    }

    addEventListeners (
        container: HTMLDivElement,
        unitSelectedCallback: Function,
        issueUnitOrder: Function,
    ) {
        container.addEventListener("mousedown", (event: MouseEvent) => {
            const tileCoord = positionToTileCoord({
                x: event.offsetX,
                y: event.offsetY
            });
            
            const targetUnit = this.unitManager.getUnitAtTileCoord(tileCoord);

            if (event.button === MOUSE_BUTTON_LEFT) {
                if (targetUnit) {
                    this.clickOnUnit(targetUnit, unitSelectedCallback);
                } else {
                    this.clickOnTerrain(tileCoord);
                }
            } else if (event.button === MOUSE_BUTTON_RIGHT) {
                if (this.selectedUnit !== null && 
                    this.selectedUnit.hasAbilityPoints(AbilityPointType.MOVEMENT, 1) &&
                    (
                    tileCoord.x !== this.selectedUnit.tileCoord.x ||
                    tileCoord.y !== this.selectedUnit.tileCoord.y
                )) {
                    const angle = Math.atan2(
                        tileCoord.y - this.selectedUnit.tileCoord.y,
                        tileCoord.x - this.selectedUnit.tileCoord.x
                    );
                    const direction = getCardinalDirectionFromAngle(angle);
                    
                    const targetCoord = {
                        x: this.selectedUnit.tileCoord.x
                            + (direction === CardinalDirection.WEST ? -1 : 0)
                            + (direction === CardinalDirection.EAST ? 1 : 0),
                        y: this.selectedUnit.tileCoord.y
                            + (direction === CardinalDirection.NORTH ? -1 : 0)
                            + (direction === CardinalDirection.SOUTH ? 1 : 0),
                    };
                    issueUnitOrder(new UnitOrder(this.selectedUnit, OrderType.MOVE, targetCoord));
                }
            }

            event.preventDefault();
            return false;
        });

        container.addEventListener("click", (event: MouseEvent) => {
            event.preventDefault();
            return false;
        });

        container.addEventListener("contextmenu", (event: MouseEvent) => {
            event.preventDefault();
            return false;
        });
    }
}
