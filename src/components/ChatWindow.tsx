import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ChatWindowProps {
    userId: string;
    threadId: string;
}

interface Message {
    id?: number;
    thread_id: number;
    user_id: string;
    content: string;
    response?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ userId, threadId }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // ✅ スレッドのメッセージを取得
    useEffect(() => {
        axios.get(`${API_BASE_URL}/messages?thread_id=${threadId}`)
            .then(res => {
                console.log("取得したメッセージ:", res.data);
                setMessages(res.data);
            })
            .catch(err => console.error("メッセージ取得エラー:", err));
    }, [threadId]);

    // ✅ 最新のメッセージを常に一番下に表示
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    // ✅ メッセージを送信し、AIの応答を受け取る
    const sendMessage = async () => {
        if (!input.trim()) return;

        try {
            // ユーザーのメッセージを追加
            const userMessage: Message = {
                thread_id: Number(threadId), // ✅ `thread_id` を整数に変換
                user_id: userId,
                content: input // ✅ `message` ではなく `content`
            };
            setMessages(prev => [...prev, userMessage]);

            // バックエンドにメッセージ送信
            const res = await axios.post(`${API_BASE_URL}/messages`, userMessage);

            console.log("AIの応答:", res.data);

            // AIの応答を追加
            const aiMessage: Message = {
                thread_id: Number(threadId),
                user_id: "AI",
                content: res.data.response
            };
            setMessages(prev => [...prev, aiMessage]);

            setInput("");
        } catch (err) {
            console.error("メッセージ送信エラー:", err);
            setMessages(prev => [...prev, { thread_id: Number(threadId), user_id: "AI", content: "AI応答エラー" }]);
        }
    };

    return (
        <div className="chat-window">
            <h2>Thread {threadId}</h2>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.user_id === "AI" ? "ai" : "user"}`}>
                        <p>{msg.content}</p>
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
