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


exports.totalOrder = async(req,res)=>{
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
}

exports.totalProduct = async(req,res)=>{
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
}



exports.cancelOrder = async (req, res) => {
  try {
    const userData = req?.params?.id;
    
    const creds = await CresModel.findByPk(userData);
    if (!creds) {
      return res.status(404).json({
        msg: "User credentials not found",
        status: false,
        status_code: 404
      });
    }

    const shopDomain = creds?.shop1_domain;
    const token = creds?.shop1_access_token;

    if (!shopDomain || !token) {
      return res.status(400).json({
        msg: "Shop domain or access token missing",
        status: false,
        status_code: 400
      });
    }

    // Fetch all orders that can be cancelled
    let allOrders = [];
    let hasNextPage = true;
    let pageInfo = '';

    // Get all orders with pagination
    while (hasNextPage && allOrders.length < 2000) { // Safety limit
      const url = `https://${shopDomain}/admin/api/2024-01/orders.json?status=any&limit=250${pageInfo}`;
      
      const response = await axios.get(url, {
        headers: {
          'X-Shopify-Access-Token': token,
          'Content-Type': 'application/json'
        }
      });

      allOrders = [...allOrders, ...response.data.orders];
      
      hasNextPage = response.data.orders.length === 250;
      if (hasNextPage) {
        const lastOrderId = response.data.orders[response.data.orders.length - 1].id;
        pageInfo = `&since_id=${lastOrderId}`;
      }
    }

    // Filter orders that can be cancelled
    const ordersToCancel = allOrders.filter(order => 
      order.cancelled_at === null && // Not already cancelled
      order.financial_status !== 'refunded' && // Not already refunded
      (
        order.financial_status === 'paid' || 
        order.financial_status === 'pending' || 
        order.financial_status === 'authorized' ||
        order.financial_status === 'partially_paid' ||
        order.financial_status === 'voided'
      )
    );

    let cancelledCount = 0;
    let failedCount = 0;
    const cancelResults = [];

    // Cancel each order
    for (const order of ordersToCancel) {
      try {
        const cancelUrl = `https://${shopDomain}/admin/api/2024-01/orders/${order.id}/cancel.json`;
        
        const cancelPayload = {
          reason: 'other',
          email: true, // Send cancellation email to customer
          refund: order.financial_status === 'paid' // Auto-refund only paid orders
        };

        await axios.post(cancelUrl, cancelPayload, {
          headers: {
            'X-Shopify-Access-Token': token,
            'Content-Type': 'application/json'
          }
        });

        cancelledCount++;
        cancelResults.push({
          order_id: order.id,
          order_number: order.order_number,
          financial_status: order.financial_status,
          total_price: order.total_price,
          status: 'cancelled'
        });

        // Add small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (cancelError) {
        failedCount++;
        console.error(`Failed to cancel order ${order.id}:`, cancelError?.response?.data);
        
        cancelResults.push({
          order_id: order.id,
          order_number: order.order_number,
          financial_status: order.financial_status,
          total_price: order.total_price,
          status: 'failed',
          error: cancelError?.response?.data?.errors || cancelError.message
        });
      }
    }

    // Calculate summary
    const totalRefundAmount = cancelResults
      .filter(result => result.status === 'cancelled' && result.financial_status === 'paid')
      .reduce((sum, result) => sum + parseFloat(result.total_price || 0), 0);

    return res.status(200).json({
      status: true,
      status_code: 200,
      message: "Order cancellation process completed",
      cancelOrder: cancelledCount, // This is the length you requested
      failed_cancellations: failedCount,
      total_orders_processed: ordersToCancel.length,
      total_refund_amount: totalRefundAmount.toFixed(2),
      summary: {
        successfully_cancelled: cancelledCount,
        failed_to_cancel: failedCount,
        total_found: ordersToCancel.length
      },
      details: cancelResults
    });

  } catch (error) {
    console.error('Error in cancelOrder function:', error?.response?.data || error.message);
    const status = error?.response?.status || 500;
    return res.status(status).json({
      msg: error?.response?.data?.message || "Internal Server Error",
      status: false,
      status_code: status,
      cancelOrder: 0 // Return 0 if error occurs
    });
  }
}

// Alternative simpler version that just returns the count
exports.cancelOrderSimple = async (req, res) => {
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

    // Filter orders for this vendor
    const filteredOrders = response.data.orders.filter(order =>
      order.line_items?.some(item =>
        normalizeVendor(item.vendor) === normalizedRequestedVendor
      )
    );

    // Calculate cancelled orders
    const cancelledOrders = filteredOrders.filter(order => order.cancelled_at !== null);
    const cancelledCount = cancelledOrders.length;

    return res.status(200).json({
      status: true,
      status_code: 200,
      vendor: requestedVendor,
      totalOrders: filteredOrders.length,
      cancelledOrdersCount: cancelledCount,
      orders: filteredOrders
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




exports.getTotalPaidPendingOrders = async (req, res) => {
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

    // Filter orders for this vendor
    const filteredOrders = response.data.orders.filter(order =>
      order.line_items?.some(item =>
        normalizeVendor(item.vendor) === normalizedRequestedVendor
      )
    );

    // Calculate cancelled orders
    const cancelledOrders = filteredOrders.filter(order => order.cancelled_at !== null);
    const cancelledCount = cancelledOrders.length;

    // Calculate paid orders
    const paidOrders = filteredOrders.filter(order => order.financial_status === 'paid');
    const paidCount = paidOrders.length;

    return res.status(200).json({
      status: true,
      status_code: 200,
      vendor: requestedVendor,
      totalOrders: filteredOrders.length,
      cancelledOrdersCount: cancelledCount,
      paidOrdersCount: paidCount,
      orders: filteredOrders
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
}


exports.topSellingProductsPieChart = async (req, res) => {
  try {
    const userData = req?.params?.id;
    const requestedVendor = req.user.full_name;
    
    const creds = await CresModel.findByPk(userData);
    const normalizedRequestedVendor = normalizeVendor(requestedVendor);

    const shopDomain = creds?.shop1_domain;
    const token = creds?.shop1_access_token;

    if (!shopDomain || !token) {
      return res.status(400).json({
        status: false,
        status_code: 400,
        message: "Shop credentials not found"
      });
    }

    // Fetch orders from Shopify
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

    // Extract and analyze product sales data
    const productSales = {};
    let totalQuantity = 0;

    filteredOrders.forEach(order => {
      order.line_items?.forEach(item => {
        if (normalizeVendor(item.vendor) === normalizedRequestedVendor) {
          const productName = item.name || item.title || 'Unknown Product';
          const quantity = parseInt(item.quantity) || 0;
          
          if (productSales[productName]) {
            productSales[productName].quantity += quantity;
            productSales[productName].revenue += parseFloat(item.price) * quantity;
          } else {
            productSales[productName] = {
              quantity: quantity,
              revenue: parseFloat(item.price) * quantity,
              price: parseFloat(item.price)
            };
          }
          totalQuantity += quantity;
        }
      });
    });

    // Convert to array and sort by quantity
    const productArray = Object.entries(productSales).map(([name, data]) => ({
      name,
      quantity: data.quantity,
      revenue: data.revenue,
      price: data.price,
      percentage: ((data.quantity / totalQuantity) * 100).toFixed(2)
    }));

    // Sort by quantity (descending)
    productArray.sort((a, b) => b.quantity - a.quantity);

    // Get top 10 products for better visualization
    const topProducts = productArray.slice(0, 10);

    // Prepare pie chart data
    const pieChartData = topProducts.map(product => ({
      label: product.name,
      value: product.quantity,
      percentage: product.percentage,
      revenue: product.revenue.toFixed(2)
    }));

    // Generate colors for pie chart
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
    ];

    const chartData = {
      labels: pieChartData.map(item => item.label),
      datasets: [{
        data: pieChartData.map(item => item.value),
        backgroundColor: colors.slice(0, pieChartData.length),
        borderColor: colors.slice(0, pieChartData.length),
        borderWidth: 1
      }]
    };

    return res.status(200).json({
      status: true,
      status_code: 200,
      vendor: requestedVendor,
      totalOrders: filteredOrders.length,
      totalProducts: productArray.length,
      totalQuantitySold: totalQuantity,
      topProducts: topProducts,
      pieChartData: chartData,
      chartConfig: {
        type: 'pie',
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
            },
            title: {
              display: true,
              text: `Top Selling Products - ${requestedVendor}`
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const product = pieChartData[context.dataIndex];
                  return `${product.label}: ${product.value} units (${product.percentage}%) - $${product.revenue}`;
                }
              }
            }
          }
        }
      }
    });

  } catch (error) {
    console.error('Error generating pie chart data:', error?.response?.data || error.message);
    const status = error?.response?.status || 500;
    return res.status(status).json({
      msg: error?.response?.data?.message || "Internal Server Error",
      status: false,
      status_code: status
    });
  }
};



exports.getProductSalesByDate = async (req, res) => {
  try {
    const userData = req?.body?.id;
    const { startDate, endDate, productName } = req.body;
    const requestedVendor = req.user.full_name;

    const creds = await CresModel.findByPk(userData);
    if (!creds?.shop1_domain || !creds?.shop1_access_token) {
      return res.status(400).json({ status: false, message: "Shop credentials not found" });
    }

    const shopDomain = creds.shop1_domain;
    const token = creds.shop1_access_token;

    // Build URL based on whether dates are provided or not
    let url = `https://${shopDomain}/admin/api/2024-01/orders.json?status=any&limit=250`;

    if (startDate && endDate) {
      url += `&created_at_min=${startDate}T00:00:00Z&created_at_max=${endDate}T23:59:59Z`;
    }

    const response = await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      }
    });

    // Filter orders by vendor and product name
    const normalizedVendor = normalizeVendor(requestedVendor);
    const normalizedProductName = productName?.toLowerCase() || "";

    const filteredItems = [];

    response.data.orders.forEach(order => {
      order.line_items.forEach(item => {
        if (normalizeVendor(item.vendor) === normalizedVendor &&
            (!normalizedProductName || item.name.toLowerCase().includes(normalizedProductName))) {
          filteredItems.push({
            date: order.created_at.slice(0, 10),
            productName: item.name,
            quantity: item.quantity,
            revenue: parseFloat(item.price) * item.quantity
          });
        }
      });
    });

    // Group by date
    const salesByDate = {};
    filteredItems.forEach(item => {
      if (!salesByDate[item.date]) {
        salesByDate[item.date] = { quantity: 0, revenue: 0 };
      }
      salesByDate[item.date].quantity += item.quantity;
      salesByDate[item.date].revenue += item.revenue;
    });

    return res.json({
      status: true,
      vendor: requestedVendor,
      product: productName,
      startDate: startDate || "all",
      endDate: endDate || "all",
      sales: Object.entries(salesByDate).map(([date, data]) => ({
        date,
        quantity: data.quantity,
        revenue: data.revenue.toFixed(2)
      }))
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};
