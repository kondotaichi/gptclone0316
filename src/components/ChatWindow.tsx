import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ChatWindowProps {
    userId: string;
    threadId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ userId, threadId }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // ✅ スレッドのメッセージを取得
    useEffect(() => {
        axios.get(`${API_BASE_URL}/messages?thread_id=${threadId}`)
            .then(res => {
                console.log("取得したメッセージ:", res.data); // デバッグ用
                setMessages(res.data);
            })
            .catch(err => console.error("メッセージ取得エラー:", err));
    }, [threadId]);

    // ✅ 最新のメッセージが常に一番下に表示されるようにする
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ✅ メッセージを送信し、AIの応答を受け取る
    const sendMessage = async () => {
        if (!input.trim()) return;
        try {
            // ユーザーのメッセージを先に追加
            const userMessage = { user_id: userId, content: input, type: "user" };
            setMessages(prev => [...prev, userMessage]);

            const res = await axios.post(`${API_BASE_URL}/messages`, {
                thread_id: threadId,
                user_id: userId,
                content: input
            });

            console.log("AIの応答:", res.data); // デバッグ用

            // AIの応答を追加
            const aiMessage = { user_id: "AI", content: res.data.response, type: "ai" };
            setMessages(prev => [...prev, aiMessage]);

            setInput("");
        } catch (err) {
            console.error("メッセージ送信エラー:", err);
            setMessages(prev => [...prev, { user_id: "AI", content: "AI応答エラー", type: "ai" }]);
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
