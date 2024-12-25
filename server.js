import express from 'express';
import cors from 'cors';
import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';

// .env 파일에서 환경변수 로드
dotenv.config();

const app = express();

// CORS 및 JSON 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Groq 인스턴스 생성
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// 채팅 엔드포인트
app.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.1-70b-versatile",
            temperature: 1,
            max_tokens: 1024,
            top_p: 1,
            stream: false
        });

        res.json({ response: chatCompletion.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});

// 서버 시작
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});