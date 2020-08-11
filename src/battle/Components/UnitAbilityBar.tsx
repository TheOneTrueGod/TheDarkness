import React from 'react';
import BattleUnit from '../BattleUnits/BattleUnit';
import styled from 'styled-components';
import BaseAbility from '../UnitAbilities/BaseAbility';

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
`;

const AbilityInSlot = styled(AbilitySlot)`
    cursor: pointer;
`;

export type UnitResourceBarProps = {
    unit: BattleUnit;
}

export type UnitResourceBarState = {
    
}

export default class UnitResourceBar extends React.Component<UnitResourceBarProps, UnitResourceBarState> {
    render() {
        const { unit } = this.props;
        const slots = 16;
        const abilities: Array<BaseAbility | null> = [];
        for (let i = 0; i < slots; i++) {
            if (i < unit.abilities.length) {
                abilities.push(unit.abilities[i]);
            } else {
                abilities.push(null);
            }
        }
        return (
            <Container>
                {abilities.map((ability, index) => {
                    const displayDetails = ability && ability.getDisplayDetails();
                    const Element = ability ? AbilityInSlot : AbilitySlot;
                    return <Element key={index}>
                        {ability && displayDetails.tempDisplayLetter}
                    </Element>;
                })}
            </Container>
        );
    }
}