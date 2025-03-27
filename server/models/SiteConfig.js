
const mongoose = require('mongoose');

const customPageSchema = new mongoose.Schema({
  title: String,
  content: String,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

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
  seo: {
    title: String,
    description: String,
    keywords: String,
    ogImage: String
  },
  customPages: {
    type: Map,
    of: customPageSchema
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SiteConfig', siteConfigSchema);
