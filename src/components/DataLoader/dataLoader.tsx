import React, { useState, useEffect } from "react";
import { makeAPICall } from '../../app/helpers';

interface DataLoaderProps {
    apiURL: string;
    args?: object;
}

interface APIResponse {
    data: Object
}

const DataLoader : React.FunctionComponent<DataLoaderProps> = ({ apiURL, args, children }) => {
    const [serverCallState, setServerCallState] = useState({ isLoading: true, responseData: {}});
    if (typeof children !== "function") {
        throw new Error("Expected to get a function for children");
    }
    
    useEffect(() => {
        makeAPICall(apiURL, args ? args : {})
            .then((response: APIResponse) => {
                setServerCallState({ isLoading: false, responseData: response.data });
            });
    }, [apiURL, args]);

    return (<>
        { serverCallState.isLoading && (<div>...</div>) }
        { !serverCallState.isLoading && (children(serverCallState.responseData)) }
    </>);
}

export default DataLoader;
