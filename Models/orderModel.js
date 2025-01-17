const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import uuid for generating unique IDs

const orderSchema = new mongoose.Schema({
    orderId: { 
        type: String, 
        default: () => uuidv4(), // Generate a unique order ID
        unique: true 
    },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    serviceSelected: { type: String, required: true },
    packageSelected: { type: String, required: true }, // Package selected (Basic, Standard, Premium)
    amountPaid: { type: Number, required: true }, // Amount paid
    totalAmount: { type: Number, required: true }, // Total amount of the package
    message: { type: String, required: true },
    custom: { type: String, default: '' }, // Custom field (optional)
    orderStatus: { 
        type: String, 
        default: 'pending', 
        enum: ['pending', 'In Progress', 'Completed'] // Allowed statuses
    },
    updates: { 
        type: [String], 
        default: [] // Array to store updates as strings
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
