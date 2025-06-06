require('dotenv').config();
const axios = require('axios');

const {CresModel} = require("../../../models");
exports.order = async (req, res) => {
  try {
    const userData = req?.params?.id;
    const requestedVendor = req.user.full_name;
   
    const creds = await CresModel.findByPk(userData);

    const normalizedRequestedVendor = normalizeVendor(requestedVendor);


    const shopDomain = creds?.shop1_domain;
    const token = creds?.shop1_access_token;
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
    const userData = req?.params?.id;
    const requestedVendor = req.user.full_name;
   
    const creds = await CresModel.findByPk(userData);
    const normalizedRequestedVendor = normalizeVendor(requestedVendor);


    const shopDomain = creds?.shop1_domain;
    const token = creds?.shop1_access_token;

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


exports.products = async (req, res) => {
  try {
    const userData = req?.params?.id;
    const requestedVendor = req.user.full_name;
   
    const creds = await CresModel.findByPk(userData);
    const normalizedRequestedVendor = normalizeVendor(requestedVendor);

    const shopDomain = creds?.shop1_domain;
    const token = creds?.shop1_access_token;
    
    // Change URL to fetch products instead of orders
    const url = `https://${shopDomain}/admin/api/2024-01/products.json`;

    const response = await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      }
    });

    return res.status(200).json({
      status: true,
      status_code: 200,
      url:url.length,
      count: response.data.products.length,
      products: response.data.products
    });

  } catch (error) {
    console.error('Error fetching Shopify products:', error?.response?.data || error.message);

    const status = error?.response?.status || 500;
    const msg = error?.response?.data?.message || "Internal Server Error";

    return res.status(status).json({
      msg,
      status: false,
      status_code: status
    });
  }
};





exports.allProducts = async (req, res) => {
  try {
    const userData = req?.params?.id;
    const requestedVendor = req.user.full_name;
   
    const creds = await CresModel.findByPk(userData);
    const normalizedRequestedVendor = normalizeVendor(requestedVendor);

    const shopDomain = creds?.shop1_domain;
    const token = creds?.shop1_access_token;
    
    let allProducts = [];
    let url = `https://${shopDomain}/admin/api/2024-01/products.json?limit=250`;
    
    // Fetch all products with pagination
    while (url) {
      const response = await axios.get(url, {
        headers: {
          'X-Shopify-Access-Token': token,
          'Content-Type': 'application/json'
        }
      });

      allProducts = allProducts.concat(response.data.products);
      
      // Check for next page link in headers
      const linkHeader = response.headers.link;
      const nextPageMatch = linkHeader && linkHeader.match(/<([^>]+)>;\s*rel="next"/);
      url = nextPageMatch ? nextPageMatch[1] : null;
    }

    return res.status(200).json({
      status: true,
      status_code: 200,
      count: allProducts.length,
      products: allProducts
    });

  } catch (error) {
    console.error('Error fetching all Shopify products:', error?.response?.data || error.message);

    const status = error?.response?.status || 500;
    const msg = error?.response?.data?.message || "Internal Server Error";

    return res.status(status).json({
      msg,
      status: false,
      status_code: status
    });
  }
};

// Fetch products with specific fields only (for better performance)
exports.productsLight = async (req, res) => {
  try {
    const userData = req?.params?.id;
    const requestedVendor = req.user.full_name;
   
    const creds = await CresModel.findByPk(userData);
    const normalizedRequestedVendor = normalizeVendor(requestedVendor);

    const shopDomain = creds?.shop1_domain;
    const token = creds?.shop1_access_token;
    
    // Fetch only specific fields for better performance
    const fields = 'id,title,handle,product_type,vendor,status,created_at,updated_at';
    const url = `https://${shopDomain}/admin/api/2024-01/products.json?fields=${fields}&limit=250`;

    const response = await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      }
    });

    return res.status(200).json({
      status: true,
      status_code: 200,
      count: response.data.products.length,
      products: response.data.products
    });

  } catch (error) {
    console.error('Error fetching Shopify products (light):', error?.response?.data || error.message);

    const status = error?.response?.status || 500;
    const msg = error?.response?.data?.message || "Internal Server Error";

    return res.status(status).json({
      msg,
      status: false,
      status_code: status
    });
  }
};




exports.getVendorProducts = async (req, res) => {
  try {
    const userData = req?.params?.id;
    const requestedVendor = req.user.full_name;
   
    const creds = await CresModel.findByPk(userData);
    const normalizedRequestedVendor = normalizeVendor(requestedVendor);

    const shopDomain = creds?.shop1_domain;
    const token = creds?.shop1_access_token;

    const url = `https://${shopDomain}/admin/api/2024-01/products.json?limit=250`;

    const response = await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      }
    });

    // Filter products where vendor matches the normalized input
    const filteredProducts = response.data.products.filter(product =>
      normalizeVendor(product.vendor) === normalizedRequestedVendor
    );

    const length = filteredProducts.length;
    
    return res.status(200).json({
      status: true,
      status_code: 200,
      vendor: requestedVendor,
      products: filteredProducts,
      length: length
    });

  } catch (error) {
    console.error('Error fetching vendor products:', error?.response?.data || error.message);
    const status = error?.response?.status || 500;
    return res.status(status).json({
      msg: error?.response?.data?.message || "Internal Server Error",
      status: false,
      status_code: status
    });
  }
};




exports.creds = async(req,res)=>{
  try{
      const cred = await CresModel.findAll()
      return res.status(200).json({
        "message":"data found",
        "status":true,
        "status_code":200,
        "data":cred
      })
  }catch (error) {
    console.error('Error fetching vendor products:', error?.response?.data || error.message);
    const status = error?.response?.status || 500;
    return res.status(status).json({
      msg: error?.response?.data?.message || "Internal Server Error",
      status: false,
      status_code: status
    });
  }
}