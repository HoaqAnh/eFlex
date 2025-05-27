import TokenService from './tokenService';

const BASE_URL = "http://localhost:8080/api/v1";
const API_KEY = "AIzaSyAnGoBuTNS4jCcozAzcr0OaciTQFScOEzg";

export const ChatBot = async (question, chatHistory = []) => {
  try {
    const payload = {
      ChatHistory: chatHistory,
      Question: question,
    };

    const token = TokenService.getToken();

    if (!token) {
      console.error("Không tìm thấy token, người dùng chưa đăng nhập");
      return null;
    }

    // Kiểm tra token hợp lệ
    if (!TokenService.isTokenValid()) {
      console.error("Token không hợp lệ hoặc đã hết hạn");
      TokenService.clearTokens();
      return null;
    }

    const response = await fetch(`${BASE_URL}/chatbot?apiKey=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      credentials: "include"
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        TokenService.clearTokens();
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        throw new Error(`Error: ${response.status}. ${response.statusText}`);
      }
    }
    
    const data = await response.json();

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "An unexpected error occurred.",
      status: 500,
      data: null,
    };
  }
};