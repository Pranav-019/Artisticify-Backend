const express = require('express');
const router = express.Router();
const Contact = require('../Models/contactModel'); // Ensure the path is correct
const Order = require('../Models/orderModel'); // Ensure the path is correct
const twilio = require('twilio');


// POST API to submit contact form
// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Get from .env
const authToken = process.env.TWILIO_AUTH_TOKEN; // Get from .env
const client = twilio(accountSid, authToken);// Replace with your Twilio Auth Token

// POST API to submit contact form
router.post('/submit', async (req, res) => {
    const { name, email, city, phone, serviceSelected, message } = req.body;

    // Validate input fields
    if (!name || !email || !city || !phone || !serviceSelected || !message) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Create a new contact document
        const newContact = new Contact({
            name,
            email,
            city,
            phone,
            serviceSelected,
            message,
            status: "new", // Default status
            leadType: "", // Default empty
            followUp: "" // Default empty
        });

        // Save contact to the database
        const savedContact = await newContact.save();

        // Send a WhatsApp message using Twilio
        try {
            const whatsappMessage = await client.messages.create({
                from: 'whatsapp:+14155238886', // Twilio WhatsApp number
                to: 'whatsapp:+919112808717', // Your WhatsApp number
                contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e', // Replace with your Content SID
                contentVariables: JSON.stringify({
                    "1": `New Lead: ${name}`,
                    "2": `City: ${city}, Phone: ${phone}, Service: ${serviceSelected}`
                }),
            });

            console.log(`WhatsApp message sent with SID: ${whatsappMessage.sid}`);
        } catch (twilioError) {
            console.error('Twilio message error:', twilioError.message);

            // Fallback to plain text message if Content SID fails
            await client.messages.create({
                from: 'whatsapp:+14155238886',
                to: 'whatsapp:+919112808717',
                body: `New Lead: ${name}\nCity: ${city}\nPhone: ${phone}\nService: ${serviceSelected}`,
            });

            console.log('Plain text WhatsApp message sent as fallback');
        }

        // Respond with success
        res.status(201).json({
            message: 'Contact form submitted successfully!',
            contact: savedContact,
        });
    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// GET API to fetch all contact form submissions
router.get('/', async (req, res) => {
    try {
        // Fetch all contacts from the database
        const contacts = await Contact.find();

        if (!contacts || contacts.length === 0) {
            return res.status(404).json({ message: 'No contacts found' });
        }

        // Return all the contacts data
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET API to fetch a specific contact by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the contact by ID
        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // Return the contact data
        res.status(200).json(contact);
    } catch (error) {
        console.error('Error fetching contact by ID:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PATCH API to update contact status
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { status, leadType, followUp } = req.body;

    try {
        // Find the contact by ID
        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // Handle status updates
        if (status === 'converted') {
            // Create an order if the status is "converted"
            const newOrder = new Order({
                customerName: contact.name,
                customerEmail: contact.email,
                city: contact.city,
                phone: contact.phone,
                serviceSelected: contact.serviceSelected,
                message: contact.message,
                contactId: contact._id, // Reference to the contact
                packageId: 'default-package-id', // Replace with actual value
                userId: 'default-user-id', // Replace with actual value
            });

            console.log("Creating new order for contact:", contact._id);
            await newOrder.save();
            console.log("Order created successfully");
        } else if (status === 'non-converted') {
            // Delete the contact if the status is "non-converted"
            console.log("Deleting contact with ID:", contact._id);
            await Contact.findByIdAndDelete(id);
            return res.status(200).json({ message: 'Contact marked as non-converted and deleted' });
        } else {
            // Update status and leadType if provided
            if (status) contact.status = status;
            if (leadType) contact.leadType = leadType;
        }

        // Append to the followUp array if provided
        if (followUp) {
            await Contact.findByIdAndUpdate(
                id,
                { $push: { followUp } }, // Add new follow-up update to the array
                { new: true } // Return the updated document
            );
        } else {
            await contact.save();
        }

        // Fetch the updated contact
        const updatedContact = await Contact.findById(id);

        res.status(200).json({ message: 'Contact updated successfully', contact: updatedContact });
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
module.exports = router;
