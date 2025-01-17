const express = require('express');
const router = express.Router();
const Order = require('../Models/orderModel'); // Import the Order model

// Fetch all orders
router.get('/', async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    // Return the list of orders
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  const {
    customerName,
    customerEmail,
    city,
    phone,
    serviceSelected,
    packageSelected,
    amountPaid,
    totalAmount,
    message,
    custom
  } = req.body;

  try {
    // Create a new order document
    const newOrder = new Order({
      customerName,
      customerEmail,
      city,
      phone,
      serviceSelected,
      packageSelected,
      amountPaid,
      totalAmount,
      message,
      custom // Optional field
    });

    // Save the new order to the database
    await newOrder.save();

    // Return the created order as a response
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status and add updates
router.put('/:orderId', async (req, res) => {
  const { orderId } = req.params; // Get orderId from route parameters
  const { orderStatus, newUpdate } = req.body; // Expecting a new status and update message

  try {
    // Find the order by orderId (MongoDB uses _id by default)
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the order status if provided
    if (orderStatus) {
      order.orderStatus = orderStatus;
    }

    // Add new update to the updates array if provided
    if (newUpdate) {
      order.updates.push(newUpdate);
    }

    // Save the updated order
    await order.save();

    // Return the updated order as a response
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
