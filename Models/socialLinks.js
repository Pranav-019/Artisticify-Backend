const mongoose = require('mongoose');

const socialLinksSchema = new mongoose.Schema({
    whatsapp: { type: String, required: false },
    twitter: { type: String, required: false },
    instagram: { type: String, required: false },
    linkedin: { type: String, required: false },
    facebook: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model('SocialLinks', socialLinksSchema);
