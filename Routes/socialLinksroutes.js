const express = require('express');
const router = express.Router();
const SocialLinks = require('../Models/socialLinks');

// Create or update social links (if no record exists, it creates one)
router.post('/add', async (req, res) => {
    try {
        const { whatsapp, twitter, instagram, linkedin, facebook } = req.body;

        let links = await SocialLinks.findOne();
        if (!links) {
            links = new SocialLinks({});
        }

        links.whatsapp = whatsapp || links.whatsapp;
        links.twitter = twitter || links.twitter;
        links.instagram = instagram || links.instagram;
        links.linkedin = linkedin || links.linkedin;
        links.facebook = facebook || links.facebook;

        await links.save();
        res.status(200).json({ success: true, message: 'Social links updated', links });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating links', error });
    }
});

// Update existing links (PUT request)
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { whatsapp, twitter, instagram, linkedin, facebook } = req.body;

        const updatedLinks = await SocialLinks.findByIdAndUpdate(
            id,
            { $set: { whatsapp, twitter, instagram, linkedin, facebook } },
            { new: true, runValidators: true }
        );

        if (!updatedLinks) {
            return res.status(404).json({ success: false, message: 'Links not found' });
        }

        res.status(200).json({ success: true, message: 'Social links updated', updatedLinks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating links', error });
    }
});

// Get social links
router.get('/get', async (req, res) => {
    try {
        const links = await SocialLinks.findOne();
        if (!links) {
            return res.status(404).json({ success: false, message: 'No links found' });
        }
        res.status(200).json({ success: true, links });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching links', error });
    }
});

module.exports = router;
