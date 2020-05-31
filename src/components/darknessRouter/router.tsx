import { connect } from "react-redux"
import { ReactElement } from "react";

interface RouterProps {

}

const UnconnectedDarknessRouter : React.FunctionComponent<RouterProps> = 
    ({ children }) => {
    return <>{children}</>
}

const DarknessRouter = connect((state) => {
    {}
})(UnconnectedDarknessRouter);

export default DarknessRouter;