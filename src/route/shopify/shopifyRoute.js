const express = require("express");
const shopifyRoute = express.Router();

const shopifyController = require("../../controller/api/shopify/shopify.controller");

shopifyRoute.get('/order',shopifyController.order);

module.exports = shopifyRoute;