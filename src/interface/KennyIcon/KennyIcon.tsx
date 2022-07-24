import React from "react";

import styled from "styled-components";
import {
  KennyIconName,
  KennyIconDetails,
  KennyIconConstants,
} from "./KennyIconConstants";

const IconDiv = styled.div<{ iconDetails: KennyIconDetails }>`
  background: url("${(props) => props.iconDetails.iconPath}") no-repeat;
  background-size: contain;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

type KennyIconProps = {
  icon: KennyIconName;
  size: "sm" | "md" | "lg";
};

export default function KennyIcon({ icon }: KennyIconProps): JSX.Element {
  return <IconDiv iconDetails={KennyIconConstants[icon]} />;
}
