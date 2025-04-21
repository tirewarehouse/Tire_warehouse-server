// server/models/Admin.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    match: /^\d{3}-\d{4}-\d{4}$/, // 전화번호 형식 검사
    unique: true
  },
  password: {
    type: String,
    required: true,
    maxlength: 20 // 20자 제한
  },
  name: {
    type: String,
    required: false // ✅ 필수로 설정할 경우
    // required: false // 👉 선택 사항으로 하려면 이렇게
  }
});

module.exports = mongoose.model('Admin', adminSchema);