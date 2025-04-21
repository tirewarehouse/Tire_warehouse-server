// models/TireType.js
const mongoose = require('mongoose');
const tireTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});
module.exports = mongoose.model('TireType', tireTypeSchema);