import React from "react";

import styled from "styled-components";
import {
  GameIconName,
  GameIconDetails,
  GameIconConstants,
} from "./GameIconConstants";

const IconDiv = styled.div<{ iconDetails: GameIconDetails }>`
  background: url("${(props) => props.iconDetails.iconPath}") no-repeat;
  background-size: contain;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

type GameIconProps = {
  icon: GameIconName;
  size: "sm" | "md" | "lg";
};

export default function GameIcon({ icon }: GameIconProps): JSX.Element {
  if (GameIconConstants[icon] === undefined) {
    throw new Error(`${icon} is not a valid GameIconName`);
  }
  return <IconDiv iconDetails={GameIconConstants[icon]} />;
}
