// scripts/insertTestTire.js
require('dotenv').config();
const mongoose = require('mongoose');
const Tire = require('../models/Tire');

const MONGO_URI = process.env.MONGODB_URI;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ DB 연결 성공');

    const sampleTire = {
        carNumber: "22나2222",
    company: "타이어나라",
    quantity: 2,
    type: "사계절용",
    locations: [
      { x: 2, y: 3, z: 1 },
      { x: 2, y: 3, z: 2 }
    ],
    memo: "교체용"
    };

    const result = await Tire.create(sampleTire);
    console.log('✅ 타이어 저장 완료:', result);
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('❌ 오류 발생:', err);
  });