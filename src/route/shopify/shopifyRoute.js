const express = require("express");
const shopifyRoute = express.Router();

const shopifyController = require("../../controller/api/shopify/shopify.controller");

shopifyRoute.get('/order/:id',shopifyController.order);
shopifyRoute.get('/order-vendor/:id',shopifyController.getVendorOrders);
shopifyRoute.get('/product/:id',shopifyController.products);
shopifyRoute.get('/product-vendor/:id',shopifyController.getVendorProducts);
shopifyRoute.get('/all-cred',shopifyController.creds);
shopifyRoute.get('/total-order/:id',shopifyController.totalOrder);
shopifyRoute.get('/total-product/:id',shopifyController.totalProduct);
shopifyRoute.get('/total-order-cancel-summery/:id',shopifyController.cancelOrder);
shopifyRoute.get('/total-order-cancel/:id',shopifyController.cancelOrderSimple);

shopifyRoute.get('/total-paid-order/:id',shopifyController.getTotalPaidPendingOrders);


shopifyRoute.get('/top-sell-product/:id',shopifyController.topSellingProductsPieChart);



module.exports = shopifyRoute;