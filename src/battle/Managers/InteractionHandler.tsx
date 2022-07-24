import { positionToTileCoord, getCardinalDirectionFromAngle } from "../BattleHelpers";
import UnitManager from "./UnitManager";
import BattleUnit, { AbilityPointType } from "../BattleUnits/BattleUnit";
import { TileCoord, CardinalDirection, UnitOwner, CurrentTurn } from "../BattleTypes";
import UnitOrder, { OrderType } from "../BattleUnits/UnitOrder";
import { MOUSE_BUTTON_LEFT, MOUSE_BUTTON_RIGHT } from "../BattleConstants";
import User from "../../../object_defs/User";
import ClientBattleMap from "../BattleMap/ClientBattleMap";
import BaseAbility, { AbilityTarget } from "../UnitAbilities/BaseAbility";
import GameDataManager from "./GameDataManager";

export default class InteractionHandler {
    currentTurn: CurrentTurn;
    unitManager: UnitManager;
    selectedUnit: BattleUnit | null;
    selectedAbility: BaseAbility | null;
    abilityTargets: Array<AbilityTarget>;

    constructor(unitManager: UnitManager) {
        this.unitManager = unitManager;
        // THESE SHOULD NEVER BE SET HERE.
        // GameContainer sets these when they change
        this.selectedUnit = null;
        this.selectedAbility = null;
        this.abilityTargets = [];
    }

    canClickOnUnit(targetUnit: BattleUnit) {
        return targetUnit.isVisible;
    }

    clickOnUnit(
        selectedUnit: BattleUnit,
        unitSelectedCallback: Function,
        gameDataManager: GameDataManager,
        issueUnitOrder: Function,
    ) {
        if (this.selectedAbility && this.selectedAbility.isValidTarget(
            this.abilityTargets.length,
            selectedUnit,
            this.selectedUnit,
            gameDataManager,
        )) {
            this.addAbilityTarget(selectedUnit, issueUnitOrder, gameDataManager.clientBattleMap);
        } else {
            unitSelectedCallback(selectedUnit);
        }
    }

    setSelectedAbility(ability: BaseAbility | null) {
        this.selectedAbility = ability;
        this.abilityTargets = [];
    }

    clickOnTerrain(tileCoord: TileCoord, gameDataManager: GameDataManager, issueUnitOrder: Function) {
        if (this.selectedAbility) {
            if (this.selectedAbility.isValidTarget(this.abilityTargets.length, tileCoord, this.selectedUnit, gameDataManager)) {
                this.addAbilityTarget(tileCoord, issueUnitOrder, gameDataManager.clientBattleMap);
            }
        }
    }

    addAbilityTarget(target: AbilityTarget, issueUnitOrder: Function, clientBattleMap: ClientBattleMap) {
        if (!this.selectedAbility.doesUnitHaveResourcesForAbility(this.selectedUnit)) { return; }
        this.abilityTargets.push(target);
        if (this.abilityTargets.length === this.selectedAbility.getTargetRestrictions().length) {
            issueUnitOrder(new UnitOrder(this.selectedUnit, OrderType.USE_ABILITY, this.abilityTargets, this.selectedAbility));
            this.abilityTargets = [];
        }
    }

    addEventListeners (
        user: User,
        container: HTMLDivElement,
        unitSelectedCallback: Function,
        issueUnitOrder: Function,
        gameDataManager: GameDataManager,
    ) {
        container.addEventListener("mousedown", (event: MouseEvent) => {
            const tileCoord = positionToTileCoord({
                x: event.offsetX,
                y: event.offsetY
            });
            
            const targetUnit = this.unitManager.getUnitAtTileCoord(tileCoord, gameDataManager.clientBattleMap);

            if (event.button === MOUSE_BUTTON_LEFT) {
                if (targetUnit && this.canClickOnUnit(targetUnit)) {
                    this.clickOnUnit(targetUnit, unitSelectedCallback, gameDataManager, issueUnitOrder);
                } else {
                    this.clickOnTerrain(tileCoord, gameDataManager, issueUnitOrder);
                }
            } else if (event.button === MOUSE_BUTTON_RIGHT) {

                if (this.selectedUnit !== null && 
                    this.selectedUnit.canReceiveOrders(user, this.currentTurn) &&
                    (
                    tileCoord.x !== this.selectedUnit.tileCoord.x ||
                    tileCoord.y !== this.selectedUnit.tileCoord.y
                )) {
                    const moveAbility = this.selectedUnit.getBasicMoveAbility();
                    const attackAbility = this.selectedUnit.getBasicAttackAbility();
                    
                    const targetUnit = this.unitManager.getUnitAtTileCoord(tileCoord, gameDataManager.clientBattleMap);

                    if (
                        targetUnit &&
                        attackAbility.isValidTarget(0, targetUnit, this.selectedUnit, gameDataManager) &&
                        attackAbility.canUnitUseAbility(gameDataManager, this.selectedUnit, [targetUnit]) &&
                        attackAbility.doesUnitHaveResourcesForAbility(this.selectedUnit)
                    ) {
                        issueUnitOrder(new UnitOrder(this.selectedUnit, OrderType.USE_ABILITY, [targetUnit], attackAbility));
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
                        if (
                            moveAbility.canUnitUseAbility(gameDataManager, this.selectedUnit, [targetCoord]) &&
                            moveAbility.doesUnitHaveResourcesForAbility(this.selectedUnit)
                        ) {
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
