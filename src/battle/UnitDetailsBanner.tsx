import React from 'react';
import BattleUnit from "./BattleUnits/BattleUnit"
import styled from 'styled-components';

const bannerHeight = '80px';
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
}

export type UnitDetailsBannerState = {
    
}

export default class UnitDetailsBanner extends React.Component<UnitDetailsBannerProps, UnitDetailsBannerState> {
    render() {
        const { selectedUnit } = this.props;
        const top = selectedUnit ? `calc(100% - ${bannerHeight})` : `100%`
        const actionPoints = [];
        const movementPoints = [];
        if (selectedUnit) {
            const abilityPoints = selectedUnit.getAbilityPoints();
            for (let i = 0; i < abilityPoints.action.available; i++) {
                if (i < abilityPoints.action.available - abilityPoints.action.used) {
                    actionPoints.push((<ActionPoint key={i} />));
                } else {
                    actionPoints.push((<UsedPoint key={i} />));
                }
            }

            for (let i = 0; i < abilityPoints.movement.available; i++) {
                if (i < abilityPoints.movement.available - abilityPoints.movement.used) {
                    movementPoints.push((<MovementPoint key={i} />));
                } else {
                    movementPoints.push((<UsedPoint key={i} />));
                }
            }
        }

        return (
            <BottomBanner style={{ top }}>
                <BottomSection style={{ flexBasis: '20%' }}>
                    { selectedUnit && `Health: ${selectedUnit.health.current} / ${selectedUnit.health.max}` }
                </BottomSection>
                <BottomSection style={{ flexGrow: 1 }}>{selectedUnit && selectedUnit.owner}</BottomSection>
                <BottomSection style={{ flexBasis: '20%' }}>
                    <ActionPointContainer>{actionPoints}</ActionPointContainer>
                    <ActionPointContainer>{movementPoints}</ActionPointContainer>
                </BottomSection>
            </BottomBanner>
        )
    }
}