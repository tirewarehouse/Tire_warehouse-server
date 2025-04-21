// server/models/Tire.js

const mongoose = require('mongoose');

// 🔧 위치 스키마 서브도큐먼트 정의
const locationSchema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  z: { type: Number, required: true },
});

const tireSchema = new mongoose.Schema({
  carNumber: { type: String, required: true, unique: true }, // 차량번호가 기본 키
  company: { type: String, required: true },
  dateIn: { type: Date, required: true, default: Date.now },
  dateOut: { type: Date, require: false }, // ✅ 출고일 추가
  quantity: { type: Number, required: true },
  type: { type: String, required: true },

  // ✅ 여러 개의 위치 정보 저장
  locations: { type: [locationSchema], required: true }, 
  memo: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Tire', tireSchema);