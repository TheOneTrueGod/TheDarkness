export type KennyIconName = "Move" | "Sword" | "Bow";

export type KennyIconDetails = { iconPath: string };
const boardgameIconPath = "/assets/kenney_boardgameicons/PNG/64";
export const KennyIconConstants: Record<KennyIconName, KennyIconDetails> = {
  Move: {
    iconPath: `${boardgameIconPath}/pawn_up.png`,
  },
  Sword: {
    iconPath: `${boardgameIconPath}/sword.png`,
  },
  Bow: {
    iconPath: `${boardgameIconPath}/bow.png`,
  },
};
