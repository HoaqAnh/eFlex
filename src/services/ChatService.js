const BASE_URL = "http://localhost:8080/api/v1";
const API_KEY = "AIzaSyAnGoBuTNS4jCcozAzcr0OaciTQFScOEzg";
const token = localStorage.getItem("token");
export const ChatBot = async (question, chatHistory = []) => {
  try {
    const payload = {
      ChatHistory: chatHistory,
      Question: question,
    };

    const response = await fetch(`${BASE_URL}/chatbot?apiKey=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to get chatbot response.",
        status: response.status,
        data: data,
      };
    }

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