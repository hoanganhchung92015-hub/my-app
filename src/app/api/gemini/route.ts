import { GoogleGenerativeAI } from "@google/generative-ai"; // Dòng này cực kỳ quan trọng
import { NextResponse } from "next/server";

export async function POST(req) {
  // 1. Kiểm tra API Key ngay lập tức
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Chưa cấu hình API Key trên Vercel" }, { status: 500 });
  }

  try {
    const { subject, prompt } = await req.json();
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `Bạn là chuyên gia ${subject}. Giải theo 3 chế độ: 1. Đáp án+CASIO, 2. Gia sư ngắn gọn, 3. Luyện Skill. Trả về LaTeX.`
    });

    const result = await model.generateContent(prompt);
    return NextResponse.json({ data: result.response.text() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
