import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

const ChatPage: React.FC = () => {
    const navigate = useNavigate();
    const { threadId } = useParams<{ threadId: string }>();
    const [user, setUser] = useState<{ user_id: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate("/");
        }
    }, [navigate]);

    return user ? (
        <div className="chat-container">
            <Sidebar userId={user.user_id} navigate={navigate} />
            {threadId ? (
                <ChatWindow userId={user.user_id} threadId={threadId} />
            ) : (
                <p style={{ margin: "20px", fontSize: "18px" }}>スレッドを選択してください</p>
            )}
        </div>
    ) : null;
};

export default ChatPage;
