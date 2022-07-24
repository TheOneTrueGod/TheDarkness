import React from "react";
import BattleUnit from "../BattleUnits/BattleUnit";
import styled from "styled-components";
import UnitResourceBar from "./UnitResourceBar";
import UnitAbilityBar from "./UnitAbilityBar";
import User from "../../../object_defs/User";
import BaseAbility from "../UnitAbilities/BaseAbility";

const bannerHeight = "88px";
const BottomBanner = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: ${bannerHeight};
  background: lightgray;
  transition: all 0.3s ease;

  display: flex;
  flex-direction: row;
  text-align: center;
`;

const BottomSection = styled.div`
  border-left: 1px solid black;
  border-right: 1px solid black;
  padding: 4px;
`;

const UsedPoint = styled.div`
  margin: 0.5px;
  border: 1px solid black;
  width: 8px;
  height: 8px;
  background: gray;
  border-radius: 50%;
`;

const ActionPoint = styled(UsedPoint)`
  background: white;
`;

const MovementPoint = styled(UsedPoint)`
  background: red;
`;

const ActionPointContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 2px;
`;

export type UnitDetailsBannerProps = {
  selectedUnit: BattleUnit | null;
  selectedAbility: BaseAbility | null;
  onAbilityClick: Function;
  user: User;
};

export type UnitDetailsBannerState = {};

export default class UnitDetailsBanner extends React.Component<
  UnitDetailsBannerProps,
  UnitDetailsBannerState
> {
  render() {
    const { selectedUnit, selectedAbility, user, onAbilityClick } = this.props;
    const top = selectedUnit ? `calc(100% - ${bannerHeight})` : `100%`;
    const actionPoints = [];

    const movementPoints = [];
    if (selectedUnit) {
      const abilityPoints = selectedUnit.getAbilityPoints();
      for (let i = 0; i < abilityPoints.action.available; i++) {
        if (i < abilityPoints.action.available - abilityPoints.action.used) {
          actionPoints.push(<ActionPoint key={i} />);
        } else {
          actionPoints.push(<UsedPoint key={i} />);
        }
      }

      for (let i = 0; i < abilityPoints.movement.available; i++) {
        if (
          i <
          abilityPoints.movement.available - abilityPoints.movement.used
        ) {
          movementPoints.push(<MovementPoint key={i} />);
        } else {
          movementPoints.push(<UsedPoint key={i} />);
        }
      }
    }

    const isOwner = selectedUnit && selectedUnit.owner == user.id;

    return (
      <BottomBanner style={{ top }}>
        <BottomSection style={{ flexBasis: "30%" }}>
          {selectedUnit && (
            <>
              <UnitResourceBar resource={selectedUnit.health} />
              {isOwner &&
                selectedUnit.energyResources.map((resource, index) => {
                  return (
                    <React.Fragment key={resource.type}>
                      <div style={{ height: "4px" }}></div>
                      <UnitResourceBar resource={resource} />
                    </React.Fragment>
                  );
                })}
            </>
          )}
        </BottomSection>
        <BottomSection style={{ flexGrow: 1 }}>
          {selectedUnit && isOwner && (
            <UnitAbilityBar
              unit={selectedUnit}
              selectedAbility={selectedAbility}
              onAbilityClick={onAbilityClick}
            />
          )}
        </BottomSection>
        <BottomSection style={{ flexBasis: "20%" }}>
          <ActionPointContainer>{actionPoints}</ActionPointContainer>
          <ActionPointContainer>{movementPoints}</ActionPointContainer>
        </BottomSection>
      </BottomBanner>
    );
  }
}
