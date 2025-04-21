// ✅ [기본 서버 코드]
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// ✅ [추가된 코드] 타이어 API 라우터 등록
const tireRoutes = require('./routes/tireRoutes');
app.use('/api/tire', tireRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB 연결 성공!'))
  .catch((err) => console.error('❌ MongoDB 연결 실패:', err));

// 테스트용 라우터
app.get('/', (req, res) => {
    res.send('서버가 잘 작동 중입니다!');
  });
  
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
