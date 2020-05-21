// Set up any config you need (you might not need this)
requirejs.config({
    basePath: "/built/local"
});

// Tell RequireJS to load your main module (and its dependencies)
require("app");