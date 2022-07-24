import React from "react";
import BattleUnit from "../BattleUnits/BattleUnit";
import styled from "styled-components";
import BaseAbility from "../UnitAbilities/BaseAbility";
import ReactTooltip from "react-tooltip";
import { GameIconConstants } from "../../interface/GameIcon/GameIconConstants";
import GameIcon from "../../interface/GameIcon/GameIcon";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const AbilitySlot = styled.div`
  margin-right: 4px;
  margin-bottom: 4px;
  border: 2px solid gold;
  background: black;
  width: 30px;
  height: 30px;
  position: relative;
`;

const AbilityInSlot = styled(AbilitySlot)`
  cursor: pointer;
`;

const AbilityContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const AbilityContentLetter = styled(AbilityContent)`
  top: 50%;
  left: 50%;
  width: 50%;
  height: 50%;
  font-size: 11px;
  background: black;
  border-radius: 100%;
  color: #8e5f78;
`;

export type UnitResourceBarProps = {
  unit: BattleUnit;
  selectedAbility: BaseAbility;
  onAbilityClick: Function;
};

export type UnitResourceBarState = {};

export default class UnitResourceBar extends React.Component<
  UnitResourceBarProps,
  UnitResourceBarState
> {
  render() {
    const { unit, onAbilityClick, selectedAbility } = this.props;
    const slots = 16;
    const abilities: Array<BaseAbility | undefined> = [];
    for (let i = 0; i < slots; i++) {
      if (i < unit.abilities.length) {
        abilities.push(unit.abilities[i]);
      } else {
        abilities.push(undefined);
      }
    }

    return (
      <Container>
        {abilities.map((ability, index) => {
          const displayDetails = ability && ability.getDisplayDetails();
          const Element = ability ? AbilityInSlot : AbilitySlot;
          const abilityIcon = ability ? ability.displayProps.icon : undefined;
          const displayLetter = ability
            ? displayDetails.tempDisplayLetter
            : undefined;

          return (
            <Element
              key={index}
              onClick={() => {
                ability && onAbilityClick(unit, ability);
              }}
              style={{
                borderColor:
                  ability && ability === selectedAbility ? "white" : "gold",
              }}
              data-tip={ability ? displayDetails.name : undefined}
            >
              {abilityIcon && (
                <AbilityContent>
                  <GameIcon icon={abilityIcon} size="sm" />
                </AbilityContent>
              )}
              {displayLetter && (
                <AbilityContentLetter>{displayLetter}</AbilityContentLetter>
              )}
            </Element>
          );
        })}
        <ReactTooltip />
      </Container>
    );
  }
}
