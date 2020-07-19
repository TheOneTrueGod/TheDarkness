import MissionUnit from "../../../object_defs/Campaign/Mission/MissionUnit.js";
import { SpriteList } from "../SpriteUtils";
import { TileCoord, UnitOwner, Team, CurrentTurn } from "../BattleTypes";
import { getTileSize } from "../BattleConstants";
import { tileCoordToPosition } from "../BattleHelpers";
import BaseAbility from "../UnitAbilities/BaseAbility.js";
import AbilityMap from "../UnitAbilities/AbilityMap";
import { UnitDef, TempPlayerUnitDef } from "./UnitDef";
import User from "../../../object_defs/User.js";

export enum AbilityPointType {
    ACTION = 'action',
    MOVEMENT = 'movement'
};

interface SpriteDecorations {
    readyForAction: PIXI.Sprite | null,
    selected: PIXI.Sprite | null,
};

export default class BattleUnit {
    sprite: PIXI.Sprite | null = null;
    tileCoord: TileCoord;
    id: number;
    unitDef: UnitDef;
    team: Team;
    health: { current: number, max: number };
    initiativeNumber: number = 0;
    owner: UnitOwner;
    spriteDecorations: SpriteDecorations;
    abilityPointsUsed: { action: number, movement: number } = { action: 0, movement: 0 };

    constructor(unitDef: UnitDef, id: number, owner: UnitOwner, team: Team, tileCoord: TileCoord) {
        this.unitDef = unitDef;
        this.tileCoord = { x: tileCoord.x, y: tileCoord.y };
        this.id = id;
        this.owner = owner;
        this.team = team;
        this.spriteDecorations = {
            readyForAction: null,
            selected: null,
        };

        this.health = {
            current: unitDef.health,
            max: unitDef.health,
        };
    }

    getAbilityPoints() {
        return {
            action: {
                used: this.abilityPointsUsed.action,
                available: this.unitDef.actionPoints,
            },
            movement: {
                used: this.abilityPointsUsed.movement,
                available: this.unitDef.movementPoints,
            }
        }
    }

    getBasicMoveAbility(): BaseAbility {
        return AbilityMap.BasicMove;
    }

    getBasicAttackAbility(): BaseAbility {
        return AbilityMap.BasicAttack;
    }

    useAbilityPoints(type: AbilityPointType, amount: number) {
        if (type === AbilityPointType.MOVEMENT) {
            this.abilityPointsUsed.movement += amount;
        }
        if (type === AbilityPointType.ACTION) {
            this.abilityPointsUsed.action += amount;
        }
    }

    hasAbilityPoints(type: AbilityPointType, amount: number): boolean {
        if (type === AbilityPointType.MOVEMENT) {
            const movementPoints = this.getAbilityPoints().movement;
            return movementPoints.available - movementPoints.used >= amount;
        }
        if (type === AbilityPointType.ACTION) {
            const actionPoints = this.getAbilityPoints().action;
            return actionPoints.available - actionPoints.used >= amount;
        }
        return false;
    }

    setTileCoord(tileCoord: TileCoord) {
        const position = tileCoordToPosition(tileCoord);
        this.tileCoord = tileCoord;
        this.sprite.position.x = position.x;
        this.sprite.position.y = position.y;
    }

    static fromMissionUnit(id: number, missionUnit: MissionUnit, tileCoord: TileCoord) {
        return new BattleUnit(TempPlayerUnitDef, id, missionUnit.ownerId, 'players', tileCoord);
    }

    getSpriteTexture(pixiLoader: PIXI.Loader): PIXI.Texture {
        return pixiLoader.resources[this.unitDef.image].texture;
    }

    getUnitSize(): TileCoord {
        return { x: this.unitDef.size.x, y: this.unitDef.size.y };
    }

    getSprite(pixiLoader: PIXI.Loader) {
        if (this.sprite) { return this.sprite; }

        const spriteTexture = this.getSpriteTexture(pixiLoader);

        this.sprite = new PIXI.Sprite(spriteTexture);
        const tileSize = getTileSize();
        
        this.sprite.position.x = this.tileCoord.x * tileSize.x;
        this.sprite.position.y = this.tileCoord.y * tileSize.y;

        const unitSize = this.getUnitSize();
        
        this.createSpriteDecorations(this.sprite);

        this.sprite.width = tileSize.x * unitSize.x;
        this.sprite.height = tileSize.y * unitSize.y;

        return this.sprite;
    }

    createSpriteDecorations(sprite: PIXI.Sprite) {
        this.spriteDecorations.readyForAction = this.createReadyForActionSprite(sprite.width, sprite.height);
        sprite.addChild(this.spriteDecorations.readyForAction);

        this.spriteDecorations.selected = this.createSelectedSprite(sprite.width, sprite.height);
        sprite.addChild(this.spriteDecorations.selected);
    }

    createReadyForActionSprite(width: number, height: number): PIXI.Sprite {
        const RFASprite = new PIXI.Sprite();
        var graphics = new PIXI.Graphics();
        const lineSize = 2;
        graphics.lineStyle(lineSize, 0x00FF00);
        graphics.drawRect(0, 0, width - lineSize, height - lineSize);
        RFASprite.addChild(graphics);
        RFASprite.visible = false;
        return RFASprite;
    }

    createSelectedSprite(width: number, height: number): PIXI.Sprite {
        const RFASprite = new PIXI.Sprite();
        var graphics = new PIXI.Graphics();
        const lineSize = 4;
        graphics.lineStyle(lineSize, 0xFFFFFF);
        graphics.drawRect(0, 0, width - lineSize, height - lineSize);
        RFASprite.addChild(graphics);
        RFASprite.visible = false;
        return RFASprite;
    }

    setShowReadyForAction(ready: boolean) {
        this.spriteDecorations.readyForAction.visible = ready;
    }

    setSelected(selected: boolean) {
        this.spriteDecorations.selected.visible = selected;
    }

    canReceiveOrders(user: User, currentTurn: CurrentTurn) {
        return user.id === this.owner && currentTurn.owner === this.owner && currentTurn.team === this.team;
    }

    dealDamage(amount: number) {
        this.health.current -= amount;
    }

    onTurnStart() {
        this.abilityPointsUsed = { action: 0, movement: 0 };
    }
};