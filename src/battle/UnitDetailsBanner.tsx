import React from 'react';
import BattleUnit from "./BattleUnits/BattleUnit"
import styled from 'styled-components';

const bannerHeight = '80px';
const BottomBanner = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    height: ${bannerHeight};
    background: white;
    transition: all 0.3s ease;
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
        return (
            <BottomBanner style={{ top }}>
                {selectedUnit ? selectedUnit.owner : 'no unit'}
            </BottomBanner>
        )
    }
}