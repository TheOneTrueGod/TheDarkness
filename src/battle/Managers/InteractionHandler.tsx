import { positionToTileCoord, getCardinalDirectionFromAngle } from "../BattleHelpers";
import UnitManager from "./UnitManager";
import BattleUnit, { AbilityPointType } from "../BattleUnits/BattleUnit";
import { TileCoord, CardinalDirection, UnitOwner, CurrentTurn } from "../BattleTypes";
import UnitOrder, { OrderType } from "../BattleUnits/UnitOrder";
import { MOUSE_BUTTON_LEFT, MOUSE_BUTTON_RIGHT } from "../BattleConstants";
import User from "../../../object_defs/User";
import ClientBattleMap from "../BattleMap/ClientBattleMap";
import BaseAbility from "../UnitAbilities/BaseAbility";

export default class InteractionHandler {
    currentTurn: CurrentTurn;
    unitManager: UnitManager;
    selectedUnit: BattleUnit | null;

    constructor(unitManager: UnitManager) {
        this.unitManager = unitManager;
        this.selectedUnit = null;
    }

    canClickOnUnit(targetUnit: BattleUnit) {
        return targetUnit.isVisible;
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
        user: User,
        container: HTMLDivElement,
        unitSelectedCallback: Function,
        issueUnitOrder: Function,
        clientBattleMap: ClientBattleMap,
    ) {
        container.addEventListener("mousedown", (event: MouseEvent) => {
            const tileCoord = positionToTileCoord({
                x: event.offsetX,
                y: event.offsetY
            });
            
            const targetUnit = this.unitManager.getUnitAtTileCoord(tileCoord, clientBattleMap);

            if (event.button === MOUSE_BUTTON_LEFT) {
                if (targetUnit && this.canClickOnUnit(targetUnit)) {
                    this.clickOnUnit(targetUnit, unitSelectedCallback);
                } else {
                    this.clickOnTerrain(tileCoord);
                }
            } else if (event.button === MOUSE_BUTTON_RIGHT) {
                const moveAbility = this.selectedUnit.getBasicMoveAbility();
                const attackAbility = this.selectedUnit.getBasicAttackAbility();

                if (this.selectedUnit !== null && 
                    this.selectedUnit.canReceiveOrders(user, this.currentTurn) &&
                    (
                    tileCoord.x !== this.selectedUnit.tileCoord.x ||
                    tileCoord.y !== this.selectedUnit.tileCoord.y
                )) {
                    const targetUnit = this.unitManager.getUnitAtTileCoord(tileCoord, clientBattleMap);

                    if (targetUnit && attackAbility.canUnitUseAbility(clientBattleMap, this.unitManager, this.selectedUnit, [tileCoord])) {
                        issueUnitOrder(new UnitOrder(this.selectedUnit, OrderType.USE_ABILITY, [tileCoord], attackAbility));
                    } else {

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
                        if (moveAbility.canUnitUseAbility(clientBattleMap, this.unitManager, this.selectedUnit, [targetCoord])) {
                            issueUnitOrder(new UnitOrder(this.selectedUnit, OrderType.USE_ABILITY, [targetCoord], moveAbility));
                        }
                    }
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

    handleAbilityClick(ability: BaseAbility, selectAbilityCallback: Function): void {
        selectAbilityCallback(ability);
    }

    onStartTurn(currentTurn: CurrentTurn) {
        this.currentTurn = currentTurn;
    }
}
