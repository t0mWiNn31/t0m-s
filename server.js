require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('.'));

// --- ဒီအပိုင်းက ကိုကို့ဆီမှာ မပါခဲ့တဲ့ AI ချက်တဲ့ အပိုင်းပါ ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        // Gemini 1.5 Flash က ပိုမြန်ပြီး ဈေးသက်သာပါတယ်
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent(req.body.message);
        const response = await result.response;
        const text = response.text();
        
        res.json({ reply: text });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "ဗျာလ် စဉ်းစားလို့ မရဖြစ်နေတယ် ကိုကို။" });
    }
});

// Website ရဲ့ အဓိက စာမျက်နှာတွေကို လမ်းကြောင်းပေးတာ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
