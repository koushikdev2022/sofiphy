const express = require("express");
const shopifyRoute = express.Router();

const shopifyController = require("../../controller/api/shopify/shopify.controller");

shopifyRoute.get('/order/:id',shopifyController.order);
shopifyRoute.get('/order-vendor/:id',shopifyController.getVendorOrders);
shopifyRoute.get('/product/:id',shopifyController.products);
shopifyRoute.get('/product-vendor/:id',shopifyController.getVendorProducts);
shopifyRoute.get('/all-cred',shopifyController.creds);


module.exports = shopifyRoute;