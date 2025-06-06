const express = require("express");
const router = express.Router();

const characterRoute = require("./characterRoute");

const defaultRoutes = [
    {
        prefix: "/character",
        route: characterRoute,
    },
   
   
]
defaultRoutes.forEach((route) => {
    if (route.middleware) {
        router.use(route.prefix, route.middleware, route.route);
    } else {
        router.use(route.prefix, route.route);
    }
});

module.exports = router;