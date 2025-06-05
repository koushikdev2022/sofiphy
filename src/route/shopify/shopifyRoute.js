const express = require("express");
const shopifyRoute = express.Router();

const shopifyController = require("../../controller/api/shopify/shopify.controller");

shopifyRoute.get('/order',shopifyController.order);
shopifyRoute.get('/order-vendor',shopifyController.getVendorOrders);


module.exports = shopifyRoute;