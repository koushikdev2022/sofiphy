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
