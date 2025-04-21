// server/routes/options.js
const express = require('express');
const router = express.Router();

// 🔧 임시 고정된 데이터 (나중에 DB화 가능)
const companies = ['GS', '대우건설', '한솔', 'LG생활건강'];
const types = ['사계절용', '겨울용', 'SUV 전용'];

// ✅ key-value 객체로 변환하여 반환
router.get('/companies', (req, res) => {
  const result = companies.map((name, idx) => ({
    _id: `c-${idx}`,
    name,
  }));
  res.json(result);
});

router.get('/types', (req, res) => {
  const result = types.map((name, idx) => ({
    _id: `t-${idx}`,
    name,
  }));
  res.json(result);
});


  

module.exports = router;