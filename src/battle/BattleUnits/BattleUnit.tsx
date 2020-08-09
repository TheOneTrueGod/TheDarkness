import MissionUnit from "../../../object_defs/Campaign/Mission/MissionUnit.js";
import { SpriteList } from "../SpriteUtils";
import { TileCoord, UnitOwner, Team, CurrentTurn, GamePosition } from "../BattleTypes";
import { getTileSize, DEBUG_MODE } from "../BattleConstants";
import { tileCoordToPosition } from "../BattleHelpers";
import BaseAbility from "../UnitAbilities/BaseAbility.js";
import AbilityMap from "../UnitAbilities/AbilityMap";
import { UnitDef, TempPlayerUnitDef } from "./UnitDef";
import User from "../../../object_defs/User.js";
import ClientBattleMap from "../BattleMap/ClientBattleMap.js";

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
    debugPathing: {
        target: TileCoord,
        path: Array<TileCoord>,
        previousPosition: TileCoord,
        debugSprites: Array<PIXI.Sprite>,
        spriteOffset: { x: number, y: number },
        debugColor: number,
    } = {
        target: { x: 0, y: 0 },
        path: [],
        previousPosition: { x: 0, y: 0 },
        debugSprites: [],
        spriteOffset: { x: Math.random(), y: Math.random()},
        debugColor: Math.floor(Math.random()*16777215)
    };

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

    addDebugSprite(coord: TileCoord, texture: PIXI.Texture) {
        const tileSize = getTileSize();

        const debugSprite = new PIXI.Sprite(texture);
        debugSprite.addChild(this.createDebugBorder({ x: debugSprite.width, y: debugSprite.height }, 8));

        debugSprite.width = tileSize.x / 4;
        debugSprite.height = tileSize.y / 4;
        debugSprite.position.x = coord.x * tileSize.x + this.debugPathing.spriteOffset.x * tileSize.x * 3 / 4;
        debugSprite.position.y = coord.y * tileSize.y + this.debugPathing.spriteOffset.y * tileSize.y * 3 / 4;

        this.debugPathing.debugSprites.push(debugSprite);

        return debugSprite;
    }

    removeAllDebugSprites() {
        this.debugPathing.debugSprites.forEach(sprite => {
            sprite.parent && sprite.parent.removeChild(sprite);
        });
        this.debugPathing.debugSprites = [];
    }

    updateDebugSprites(pixiLoader: PIXI.Loader, debugContainer: PIXI.Sprite) {
        if (this.team !== 'enemies') {
            return;
        }
        this.removeAllDebugSprites();

        debugContainer.addChild(
            this.addDebugSprite(
                this.debugPathing.target,
                pixiLoader.resources[SpriteList.CROSSHAIR].texture
            )
        );

        debugContainer.addChild(
            this.addDebugSprite(
                this.debugPathing.previousPosition,
                pixiLoader.resources[SpriteList.POSITION_MARKER].texture
            )
        );

        this.debugPathing.path.forEach((coord) => {
            debugContainer.addChild(
                this.addDebugSprite(
                    coord,
                    pixiLoader.resources[SpriteList.CIRCLE].texture
                )
            );
        })

    }

    static fromMissionUnit(id: number, missionUnit: MissionUnit, tileCoord: TileCoord) {
        return new BattleUnit(TempPlayerUnitDef, id, missionUnit.ownerId, 'players', tileCoord);
    }

    getSpriteTexture(pixiLoader: PIXI.Loader): PIXI.Texture {
        return pixiLoader.resources[this.unitDef.image].texture;
    }

    getUnitSize(): TileCoord {
        return { ...this.unitDef.size };
    }

    createDebugBorder(size: GamePosition, borderWidth: number = 3) {
        const gt = new PIXI.Graphics();
        gt.lineStyle(borderWidth, this.debugPathing.debugColor);
        gt.drawRect(0,0,size.x - 3,size.y - 3);
        gt.endFill();
    
        return gt;
    }

    getSprite(pixiLoader: PIXI.Loader) {
        if (this.sprite) { return this.sprite; }

        const spriteTexture = this.getSpriteTexture(pixiLoader);

        this.sprite = new PIXI.Sprite(spriteTexture);
        if (DEBUG_MODE) {
            this.sprite.addChild(this.createDebugBorder({ x: this.sprite.width, y: this.sprite.height }));
        }
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

    isTargetable() {
        return true;
    }

    canAct() {
        return true;
    }
    
    isOnOppositeTeam(team: Team) {
        if (this.team === 'allies' || this.team === 'players') {
            return team === 'enemies';
        }
        if (this.team === 'enemies') {
            return team === 'allies' || team === 'players';
        }
    }

    prepareForDeletion() {
        this.sprite.parent && this.sprite.parent.removeChild(this.sprite);
        this.removeAllDebugSprites();
    }

    // Lightness Related Stats
    getLightLevel() {
        return 3;
    }

    // phases
    onCleanupStep(clientBattleMap: ClientBattleMap) {
        console.log(clientBattleMap.isTileVisible({ ...this.tileCoord }));
        if (clientBattleMap.isTileVisible({ ...this.tileCoord })) {
            this.sprite.visible = true;
        } else {
            this.sprite.visible = false;
        }
    }
};