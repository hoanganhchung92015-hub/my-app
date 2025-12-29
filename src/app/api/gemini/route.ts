import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse, NextRequest } from "next/server"; // Thêm NextRequest ở đây

export async function POST(req: NextRequest) { // Thêm kiểu : NextRequest vào đây
  // 1. Kiểm tra API Key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Chưa cấu hình API Key" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { subject, prompt } = body;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `Bạn là chuyên gia ${subject}. Giải bài theo 3 chế độ: 1. Đáp án+CASIO, 2. Gia sư AI ngắn gọn, 3. Luyện Skill (2 câu trắc nghiệm). Trả về văn bản sạch, dùng LaTeX cho công thức.`
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ data: text });
  } catch (error: any) { // Thêm : any ở đây để tránh lỗi bắt lỗi
    console.error("Lỗi:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
