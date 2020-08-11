import React from 'react';
import BattleUnit from '../BattleUnits/BattleUnit';
import styled from 'styled-components';

const RoundedDiv = styled.div`
    border-radius: 4px;
`;

const OuterRoundedDiv = styled(RoundedDiv)`
`;

const ContainerDiv = styled(RoundedDiv)`
    display: flex;
    padding: 1px 4px;
    width: 100%;
    height: 24px;
    border: 1px solid gray;
    background: black;
    position: relative;
`;

const InnerRoundedDiv = styled(RoundedDiv)`
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
`;

export type UnitResourceBarProps = {
    color: string;
    currValue: number;
    maxValue: number;
    pointsPerPip?: number;
}

export type UnitResourceBarState = {
    
}

export default class UnitResourceBar extends React.Component<UnitResourceBarProps, UnitResourceBarState> {
    render() {
        const { currValue, maxValue, color, pointsPerPip = 1 } = this.props;
        const barPercentages = [];
        for (let i = 0; i < maxValue; i += pointsPerPip) {
            if (i + pointsPerPip < currValue) { barPercentages.push(1); }
            else if (i > currValue) { barPercentages.push(0); }
            else {
                if (i + pointsPerPip >= maxValue) {
                    barPercentages.push((currValue - i) / (maxValue - i));
                } else {
                    barPercentages.push((currValue - i) / pointsPerPip);
                }
            }
        }

        return (
            <ContainerDiv>
                <div style={{
                    width: '40px',
                    display: 'flex', justifyContent: 'center',
                }}>
                    <div style={{ fontSize: '10px', background: 'black', color: 'white', borderRadius: '4px', padding: '1px 4px'}}>
                        {currValue} / {maxValue}
                    </div>
                </div>
                {barPercentages.map((percent, index, arr) => {
                    let flexGrow = 1;
                    if (index === barPercentages.length - 1) {
                        flexGrow = (maxValue % pointsPerPip) / pointsPerPip;
                        if (flexGrow === 0) { flexGrow = 1; }
                    }
                    return (
                        <React.Fragment key={index}>
                            <OuterRoundedDiv style={{ flexGrow, position: 'relative', height: '100%' }} key={index}>
                                <InnerRoundedDiv style={{ width: `100%`, background: 'black' }}/>
                                <InnerRoundedDiv style={{ width: `${Math.floor(percent * 100)}%`, background: color }}/>
                                <InnerRoundedDiv style={{ width: '100%', border: '1px solid gray' }} />
                            </OuterRoundedDiv>
                            {(index < arr.length - 1) && (<div key={`spacer-${index}`} style={{ width: '8px' }} />)}
                        </React.Fragment>
                    );
                })}
            </ContainerDiv>
        );
    }
}
