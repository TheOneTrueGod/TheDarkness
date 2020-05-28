import React, { useState } from 'react';

import styled from 'styled-components';
import Campaign from '../../../object_defs/Campaign/Campaign';
import { makeAPICall } from '../../app/helpers';

const Row = styled.span`
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

const CellDelete = styled.span`
    flex-grow: 1;
    margin: 10px 0;
`;

type CampaignRowProps = {
    campaign: Campaign;
}

export default function CampaignRow ({ campaign }: CampaignRowProps): JSX.Element {
    const campaignUri = campaign.getCampaignUri();
    const [reallyDelete, setReallyDelete] = useState(false);

    function deleteCampaign() {
        makeAPICall('/api/delete-campaign', { campaignId: campaign.id })
            .then(() => {
                window.location.reload();
            });
    }

    function navigateToCampaign() {
        window.location.href = campaignUri;
    }

    return (
        <Row>
            <CellId onClick={navigateToCampaign}>{ campaign.id }</CellId>
            <CellName onClick={navigateToCampaign}>{ campaign.name }</CellName>
            <CellDelete onClick={(event)=> {
                if (!reallyDelete) { 
                    setReallyDelete(true);
                } else {
                    deleteCampaign(); 
                }
            }}>{ reallyDelete ? 'Really Delete?' : 'Delete' }</CellDelete>
        </Row>
    );
}