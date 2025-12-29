import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Khởi tạo với API Key của bạn
const apiKey = "YOUR_GEMINI_API_KEY";
const genAI = new GoogleGenerativeAI(apiKey);

async function giaiBaiTap(subject, userPrompt) {
  try {
    // 2. Cấu hình Model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `Bạn là chuyên gia ${subject}. 
      Giải bài theo 3 chế độ: 
      1. Đáp án + hướng dẫn bấm máy CASIO.
      2. Gia sư AI giải thích ngắn gọn bản chất.
      3. Luyện Skill: Đưa ra 2 câu hỏi trắc nghiệm tương tự bài toán.
      Yêu cầu: Trả về văn bản sạch, sử dụng LaTeX cho tất cả công thức toán học/hóa học.`,
    });

    // 3. Gửi yêu cầu
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const text = response.text();

    console.log("--- KẾT QUẢ GIẢI BÀI ---");
    console.log(text);
    return text;

  } catch (error) {
    console.error("Lỗi khi gọi Gemini API:", error.message);
  }
}

// Ví dụ thực thi:
const monHoc = "Toán học lớp 12";
const deBai = "Tính đạo hàm của hàm số $y = \ln(x^2 + 1)$";

giaiBaiTap(monHoc, deBai);
