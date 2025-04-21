require('dotenv').config(); // ✅ 반드시 최상단에!

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const MONGO_URI = process.env.MONGODB_URI;
const app = express();
const PORT = 5001;

// ✅ [🔁 수정된 위치] CORS 및 JSON 파싱 미들웨어를 라우터 등록보다 먼저 실행!
app.use(cors()); // ✅ CORS 허용 - 반드시 라우터 전에 실행해야 함!
app.use(express.json());

// ✅ [추가된 설명] 라우터 등록은 이 아래에 있어야 요청을 차단하지 않음
const searchRoutes = require('./routes/search');
app.use('/api/search', searchRoutes);

// server/server.js 내부
const adminRoutes = require('./routes/admin'); // 추가
app.use('/api/admin', adminRoutes); // 추가

// server.js에 추가
const optionsRoutes = require('./routes/options');
app.use('/api/options', optionsRoutes);

// ✅ 기본 라우트
app.get('/', (req, res) => {
  res.send('타이어 창고 백엔드 서버 실행 중!');
});

// ✅ DB 연결
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB 연결 성공!');
    console.log('📌 연결된 DB 이름:', mongoose.connection.name); // ⬅️ 이 줄 추가
  })
  .catch((err) => console.error('❌ MongoDB 연결 실패:', err));

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});