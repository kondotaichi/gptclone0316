import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ChatWindowProps {
  userId: string;
  threadId: string;
}

interface Message {
  id?: number;
  thread_id: string | number;
  user_id: string;
  content: string;
  response?: string;
  type?: "user" | "ai"; // 明示的にタイプ管理
}

const ChatWindow: React.FC<ChatWindowProps> = ({ userId, threadId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // メッセージ取得
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/messages?thread_id=${threadId}`)
      .then((res) => {
        const formattedMessages = res.data.flatMap((msg: Message) => [
          { ...msg, type: "user" },
          msg.response
            ? {
                thread_id: msg.thread_id,
                user_id: "AI",
                content: msg.response,
                type: "ai",
              }
            : null,
        ]).filter(Boolean) as Message[];

        setMessages(formattedMessages);
      })
      .catch((err) => console.error("メッセージ取得エラー:", err));
  }, [threadId]);

  // 自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // メッセージ送信処理
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      thread_id: threadId,
      user_id: userId,
      content: input,
      type: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await axios.post(`${API_BASE_URL}/messages`, userMessage);

      if (res.data.response) {
        const aiMessage: Message = {
          thread_id: threadId,
          user_id: "AI",
          content: res.data.response,
          type: "ai",
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (err) {
      console.error("メッセージ送信エラー:", err);
      const errorMessage: Message = {
        thread_id: threadId,
        user_id: "AI",
        content: "AI応答エラー",
        type: "ai",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="chat-window">
      <h2>Thread {threadId}</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <div className="message-text">{msg.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
