import React, { useState } from "react";

interface SidebarProps {
    userId: string;
    navigate: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navigate }) => {
    const [threadTitle, setThreadTitle] = useState("");
    const [threads, setThreads] = useState<string[]>(["new", "あたら"]);

    const handleCreateThread = () => {
        if (threadTitle.trim() !== "") {
            setThreads([...threads, threadTitle]);
            setThreadTitle("");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div className="sidebar">
            {/* ✅ アプリタイトル */}
            <h1 className="app-title">THREADS</h1>

            {/* ✅ ログアウトボタン */}
            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>

            {/* ✅ 新規スレッド作成 */}
            <div className="thread-form">
                <input
                    type="text"
                    value={threadTitle}
                    onChange={(e) => setThreadTitle(e.target.value)}
                    placeholder="New thread title"
                />
                <button onClick={handleCreateThread}>Create</button>
            </div>

            {/* ✅ スレッド一覧 */}
            <ul>
                {threads.map((thread, index) => (
                    <li key={index} onClick={() => navigate(`/chat/${thread}`)}>
                        {thread}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
