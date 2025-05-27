// server/routes/options.js
const express = require('express');
const router = express.Router();
const Company = require('../models/Company'); // ✅ DB 모델 불러오기

// 🔧 고정된 타이어 종류 목록
const types = ['올시즌(All-Season)', '스노우(Snow)', '올웨더(All-weather)'];

// ✅ [회사 목록] DB에서 읽어오기
router.get('/companies', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies); // [{ _id, name }]
  } catch (error) {
    console.error('❌ 회사 목록 조회 실패:', error);
    res.status(500).json({ message: '회사 목록 조회 중 오류 발생' });
  }
});

// ✅ [타이어 종류] 하드코딩된 배열 그대로 반환
router.get('/types', (req, res) => {
  const result = types.map((name, idx) => ({
    _id: `t-${idx}`,
    name,
  }));
  res.json(result);
});

module.exports = router;