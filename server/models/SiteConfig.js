
const mongoose = require('mongoose');

const siteConfigSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    trim: true
  },
  homeHeroText: {
    type: String,
    trim: true
  },
  contactInfo: {
    address: String,
    phone: String,
    email: String,
    workingHours: String
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SiteConfig', siteConfigSchema);
