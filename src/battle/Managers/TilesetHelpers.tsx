import PIXI from "pixi.js";

type TileDetails = {
  tilePosition: { x: number; y: number };
  variants?: { x: number; y: number; weight: number }[];
};

export const TilesetImages = {
  EMPTY_SPACE: {
    tilePosition: { x: 0, y: 0 },
    variants: [
      { x: 0, y: 0, weight: 60 },
      { x: 1, y: 0, weight: 1 },
      { x: 2, y: 0, weight: 1 },
      { x: 3, y: 0, weight: 1 },
      { x: 4, y: 0, weight: 1 },
      { x: 5, y: 0, weight: 1 },
      { x: 6, y: 0, weight: 1 },
      { x: 7, y: 0, weight: 1 },
    ],
  } as TileDetails,
  ROCK: {
    tilePosition: { x: 1, y: 0 },
    variants: [
      { x: 1, y: 0, weight: 1 },
      { x: 2, y: 0, weight: 1 },
      { x: 3, y: 0, weight: 1 },
      { x: 4, y: 0, weight: 1 },
    ],
  } as TileDetails,
};

export type TileName = keyof typeof TilesetImages;

export function extractTilesetImage(
  tilesetTexture: PIXI.Texture,
  tileName: TileName,
  variantSeed?: number
) {
  if (!(tileName in TilesetImages)) {
    throw new Error(`'${tileName}' not a valid TileName`);
  }

  const imageSize = { x: 16, y: 16 };
  const imageGap = { x: 1, y: 1 };

  const tilesetDef = TilesetImages[tileName];
  let tileFramePosition = TilesetImages[tileName].tilePosition;
  if (variantSeed !== undefined && tilesetDef.variants !== undefined) {
    let totalWeight = tilesetDef.variants.reduce(
      (prev, curr) => prev + curr.weight,
      0
    );

    const weightRoll =
      Math.floor(variantSeed * Math.random() * totalWeight) % totalWeight;

    let weightSum = 0;
    let foundOne = false;
    for (let i = 0; i < tilesetDef.variants.length; i++) {
      weightSum += tilesetDef.variants[i].weight;
      if (weightSum > weightRoll) {
        tileFramePosition = tilesetDef.variants[i];
        foundOne = true;
        break;
      }
    }
    if (!foundOne) {
      console.warn("Didn't find one :(");
    }
  }

  const t32Rect = new PIXI.Rectangle(
    imageSize.x * tileFramePosition.x + tileFramePosition.x * imageGap.x,
    imageSize.y * tileFramePosition.y + tileFramePosition.y * imageGap.y,
    imageSize.x,
    imageSize.y
  );

  const framedTexture = new PIXI.Texture(tilesetTexture.baseTexture, t32Rect);

  const terrainSprite = new PIXI.Sprite(framedTexture);
  return terrainSprite;
}
