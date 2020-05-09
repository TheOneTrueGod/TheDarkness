System.register("app", ["react-dom", "react"], function (exports_1, context_1) {
    "use strict";
    var ReactDOM, React;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (ReactDOM_1) {
                ReactDOM = ReactDOM_1;
            },
            function (React_1) {
                React = React_1;
            }
        ],
        execute: function () {
            ReactDOM.render(React.createElement("h2", null, "Hello, world!"), document.getElementById('reactContainer'));
        }
    };
});
//# sourceMappingURL=tsc.js.map