import React from 'react';

import styled from 'styled-components';
import Campaign from '../../../object_defs/Campaign';

const Row = styled.a`
    width: 100%;
    display: flex;
    cursor: pointer;
`;

const CellId = styled.span`
    flex-grow: 1;
    margin: 10px 0;
    max-width: 20px;
`;

const CellName = styled.span`
    flex-grow: 3;
    margin: 10px 0;
`;

type CampaignRowProps = {
    campaign: Campaign;
}

export default function CampaignRow ({ campaign }: CampaignRowProps): JSX.Element {
    const campaignUri = campaign.getCampaignUri();
    return (
        <Row href={campaignUri}>
            <CellId>{ campaign.id }</CellId>
            <CellName>{ campaign.name }</CellName>
        </Row>
    );
}