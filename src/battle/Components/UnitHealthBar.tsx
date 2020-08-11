import React from 'react';
import BattleUnit from '../BattleUnits/BattleUnit';
import styled from 'styled-components';

export type UnitHealthBarProps = {
    selectedUnit: BattleUnit;
}

export type UnitHealthBarState = {
    
}

const RoundedDiv = styled.div`
    border-radius: 4px;
`;

const OuterRoundedDiv = styled(RoundedDiv)`
    background: black;
    border: 1px solid gray;
`;

const ContainerDiv = styled(OuterRoundedDiv)`
    display: flex;
    padding: 1px 4px;
    width: 100%;
    height: 18px;
`;

const InnerRoundedDiv = styled(RoundedDiv)`
    background: red;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
`;

export default class UnitHealthBar extends React.Component<UnitHealthBarProps, UnitHealthBarState> {
    render() {
        const { selectedUnit } = this.props;
        const currentHealth = selectedUnit.health.current;
        const maxHealth = selectedUnit.health.max;
        const healthPerPip = 1;
        const barPercentages = [];
        for (let i = 0; i < maxHealth; i += healthPerPip) {
            if (i + healthPerPip < currentHealth) { barPercentages.push(1); }
            else if (i > currentHealth) { barPercentages.push(0); }
            else {
                if (i + healthPerPip >= maxHealth) {
                    barPercentages.push((currentHealth - i) / (maxHealth - i));
                } else {
                    barPercentages.push((currentHealth - i) / healthPerPip);
                }
            }
        }

        return (
            <ContainerDiv>
                {barPercentages.map((percent, index, arr) => {
                    let flexGrow = 1;
                    if (index === barPercentages.length - 1) {
                        flexGrow = (maxHealth % healthPerPip) / healthPerPip;
                        if (flexGrow === 0) { flexGrow = 1; }
                    }
                    return (
                        <React.Fragment key={index}>
                            <OuterRoundedDiv style={{ flexGrow, position: 'relative', height: '100%' }} key={index}>
                                <InnerRoundedDiv style={{ width: `100%`, background: 'black' }}/>
                                <InnerRoundedDiv style={{ width: `${Math.floor(percent * 100)}%` }}/>
                            </OuterRoundedDiv>
                            {(index < arr.length - 1) && (<div key={`spacer-${index}`} style={{ width: '8px' }} />)}
                        </React.Fragment>
                    );
                })}
            </ContainerDiv>
        );
    }
}
