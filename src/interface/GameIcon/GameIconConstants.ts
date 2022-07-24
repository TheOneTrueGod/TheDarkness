export type GameIconName =
  | "Move"
  | "Sword"
  | "Bow"
  | "Teleport"
  | "Slash"
  | "SwordDash"
  | "Arrowhead"
  | "ExplosiveArrow"
  | "Crossbow";

export type GameIconDetails = { iconPath: string };

const kenneyBoardgameIconPath = "/assets/kenney_boardgameicons/PNG/64";
const gameIconsPath = "/assets/AbilityIcons/";

export const GameIconConstants: Record<GameIconName, GameIconDetails> = {
  Move: {
    iconPath: `${kenneyBoardgameIconPath}/pawn_up.png`,
  },
  Sword: {
    iconPath: `${kenneyBoardgameIconPath}/sword.png`,
  },
  Bow: {
    iconPath: `${kenneyBoardgameIconPath}/bow.png`,
  },
  Teleport: {
    iconPath: `${gameIconsPath}/teleport.svg`,
  },
  Slash: {
    iconPath: `${gameIconsPath}/saberslash.svg`,
  },
  SwordDash: {
    iconPath: `${gameIconsPath}/swordswingthrough.svg`,
  },
  Arrowhead: {
    iconPath: `${gameIconsPath}/arrowhead.svg`,
  },
  ExplosiveArrow: {
    iconPath: `${gameIconsPath}/explosivearrow.svg`,
  },
  Crossbow: {
    iconPath: `${gameIconsPath}/crossbow.svg`,
  },
};
