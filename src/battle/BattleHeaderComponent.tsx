import React from "react";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import { CurrentTurn } from "./BattleTypes";
import User from "../../object_defs/User";

const Banner = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;

  display: flex;
  flex-direction: row;
  text-align: center;
`;

const BannerSection = styled.div`
  padding: 4px;
`;

const CenterBannerSection = styled(BannerSection)`
  flex-grow: 1;
  background: lightgray;
`;

const RightBannerSection = styled(BannerSection)`
  flex-basis: "20%";
  background: lightgray;
`;

export type BattleHeaderComponentProps = {
  user: User;
  currentTurn: CurrentTurn;
  turnEnding: boolean;
  onEndTurnClick: Function;
};

export type BattleHeaderComponentState = {};

export default class BattleHeaderComponent extends React.Component<
  BattleHeaderComponentProps,
  BattleHeaderComponentState
> {
  render() {
    const { onEndTurnClick, currentTurn, turnEnding, user } = this.props;
    const endTurnEnabled =
      currentTurn.owner === user.id &&
      currentTurn.team === "players" &&
      !turnEnding;

    return (
      <Banner>
        <BannerSection style={{ flexBasis: "20%" }}></BannerSection>
        <CenterBannerSection>
          Current Turn: {currentTurn.team} {currentTurn.owner}
        </CenterBannerSection>
        <RightBannerSection>
          <Button
            variant={endTurnEnabled ? "success" : "secondary"}
            disabled={!endTurnEnabled}
            onClick={() => {
              if (endTurnEnabled) {
                onEndTurnClick();
              }
            }}
          >
            End Turn
          </Button>
        </RightBannerSection>
      </Banner>
    );
  }
}
