import { GoogleGenerativeAI } from "@google/generative-ai"; // Sửa tên thư viện có dấu gạch ngang
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Lấy dữ liệu từ body request
    const { prompt, image, subject } = await req.json();

    // 2. Kiểm tra API Key (Tránh lỗi 500 khi chưa cấu hình biến môi trường)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Thiếu GEMINI_API_KEY trong cấu hình Vercel/Environment." },
        { status: 500 }
      );
    }

    // 3. Khởi tạo Gemini với System Instruction
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `Bạn là chuyên gia ${subject}. Giải bài theo 3 chế độ: 1. Đáp án+CASIO, 2. Gia sư AI ngắn gọn, 3. Luyện Skill (2 câu trắc nghiệm). Trả về văn bản sạch, dùng LaTeX cho công thức.`,
    });

    // 4. Xử lý nội dung gửi đi (Hỗ trợ cả chữ và hình ảnh)
    // Nếu có image, gửi mảng [text, image_data], nếu không chỉ gửi text
    const content = image
      ? [prompt, { inlineData: { data: image, mimeType: "image/jpeg" } }]
      : prompt;

    const result = await model.generateContent(content);
    const response = await result.response;
    const text = response.text();

    // 5. Trả về kết quả chuẩn NextResponse
    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("Gemini Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Lỗi xử lý API nội bộ" },
      { status: 500 }
    );
  }
}
