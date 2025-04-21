// scripts/deleteAllTires.js
require('dotenv').config();
const mongoose = require('mongoose');
const Tire = require('../models/Tire'); // 모델 경로 맞게 조정

const MONGO_URI = process.env.MONGODB_URI;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ DB 연결 성공');
    const result = await Tire.deleteMany({});
    console.log(`🗑️ 삭제된 타이어 수: ${result.deletedCount}`);
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('❌ DB 연결 실패:', err);
  });