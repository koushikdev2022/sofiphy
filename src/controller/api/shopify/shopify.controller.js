require('dotenv').config();
const axios = require('axios');

exports.order = async (req, res) => {
  try {
    const shopDomain = process.env.SHOP1_DOMAIN;
    console.log(shopDomain)
    const token = process.env.SHOP1_ACCESS_TOKEN;
    console.log(token)

    const url = `https://${shopDomain}/admin/api/2024-01/orders.json?status=any`;

    const response = await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      }
    });

    return res.status(200).json({
      status: true,
      status_code: 200,
      count:response.data.orders.length,
      orders: response.data.orders
      
    });

  } catch (error) {
    console.error('Error fetching Shopify orders:', error?.response?.data || error.message);

    const status = error?.response?.status || 500;
    const msg = error?.response?.data?.message || "Internal Server Error";

    return res.status(status).json({
      msg,
      status: false,
      status_code: status
    });
  }
};
const normalizeVendor = (str) => str?.toLowerCase().replace(/[^a-z0-9]/g, '');

exports.getVendorOrders = async (req, res) => {
  try {
    const requestedVendor = req.user.full_name;
    console.log(requestedVendor,)

    const normalizedRequestedVendor = normalizeVendor(requestedVendor);


    const shopDomain = process.env.SHOP1_DOMAIN;
    const token = process.env.SHOP1_ACCESS_TOKEN;

    const url = `https://${shopDomain}/admin/api/2024-01/orders.json?status=any&limit=250`;

    const response = await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      }
    });

    // Filter orders where any line item's vendor matches the normalized input
    const filteredOrders = response.data.orders.filter(order =>
      order.line_items?.some(item =>
        normalizeVendor(item.vendor) === normalizedRequestedVendor
      )
    );
    const length = filteredOrders.length;
    return res.status(200).json({
      status: true,
      status_code: 200,
      vendor: requestedVendor,
      orders: filteredOrders,
      length:length
    });

  } catch (error) {
    console.error('Error fetching vendor orders:', error?.response?.data || error.message);
    const status = error?.response?.status || 500;
    return res.status(status).json({
      msg: error?.response?.data?.message || "Internal Server Error",
      status: false,
      status_code: status
    });
  }
};
