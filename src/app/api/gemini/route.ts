import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server"; // Luôn dùng NextResponse cho Next.js 13+

export async function POST(req: Request) {
  try {
    const { prompt, image, subject } = await req.json();
    
    // Bảo mật: Lấy Key trực tiếp từ môi trường Server
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        return NextResponse.json({ error: "Cần cập nhật GEMINI_API_KEY trên Vercel!" }, { status: 401 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `Bạn là chuyên gia ${subject}. Giải bài theo 3 chế độ: 1. Đáp án+CASIO, 2. Gia sư AI ngắn gọn, 3. Luyện Skill (2 câu trắc nghiệm). Trả về văn bản sạch, dùng LaTeX cho công thức.`
    });

    const result = await model.generateContent(image ? [prompt, { inlineData: { data: image, mimeType: "image/jpeg" } }] : prompt);
    
    return NextResponse.json({ text: result.response.text() });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
