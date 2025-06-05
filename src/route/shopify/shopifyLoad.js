const express = require("express");
const router = express.Router();

const shopifyRoute = require("./shopifyRoute")
const isAuthenticate = require("../../middleware/user/isUserAuthenticateMiddleware")

const defaultRoutes = [
    {
        prefix: "/shopify",
        route: shopifyRoute,
        middleware:isAuthenticate
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