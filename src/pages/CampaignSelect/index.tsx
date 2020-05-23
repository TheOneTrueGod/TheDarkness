import React, { useState, useEffect } from 'react';

export default function CampaignSelect () {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        fetch(
            '/api/get-campaigns',
            { method: 'GET' }
        )
        .then(res => res.json())
        .then(response => {
            console.log(response);
        });
    });


    return <>
        <h2>Campaign Select</h2>
        { isLoading && <div>Loading...</div>}
    </>;
};
