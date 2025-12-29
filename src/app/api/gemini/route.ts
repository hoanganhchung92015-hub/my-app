import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    // 1. Lấy dữ liệu từ body request
    const { subject, prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Thiếu API Key" }, { status: 500 });
    }

    // 2. Khởi tạo Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `Bạn là chuyên gia ${subject}. 
      Giải bài theo 3 chế độ: 
      1. Đáp án + CASIO.
      2. Gia sư AI ngắn gọn.
      3. Luyện Skill (2 câu trắc nghiệm). 
      Trả về văn bản sạch, dùng LaTeX cho công thức.`,
    });

    // 3. Gọi API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. Trả về kết quả bằng NextResponse
    return NextResponse.json({ data: text });

  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json(
      { error: "Lỗi xử lý AI", details: error.message },
      { status: 500 }
    );
  }
}
