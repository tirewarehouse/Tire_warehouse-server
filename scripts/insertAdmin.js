// server/scripts/insertAdmin.js
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const exists = await Admin.findOne({ phone: '111-1111-1111' });
    if (exists) {
      console.log('✅ 테스트 관리자 계정 이미 존재함');
    } else {
      await Admin.create({ phone: '111-1111-1111', password: '1111' });
      console.log('✅ 테스트 관리자 계정 생성 완료');
    }
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ DB 연결 실패:', err);
  });