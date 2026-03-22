import React, { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import axios from "axios";
import "./App.css"; 

export default function Editor({ fileId, username }) {
  const ref = useRef(null);
  const editorRef = useRef(null);
  const [status, setStatus] = useState("Đang kết nối...");
  const [usersOnline, setUsersOnline] = useState([]);

  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const API_URL = SERVER_URL?.replace("wss", "https");

  // ✅ FIX: Đặt save ở ngoài
  const save = async () => {
    if (!editorRef.current) return;

    setStatus("Đang lưu...");

    try {
      await axios.post(`${API_URL}/save`, {
        fileId,
        content: editorRef.current.getValue()
      });

      setStatus("Đã lưu ✅");
      setTimeout(() => setStatus("Đã kết nối"), 1500);
    } catch (err) {
      setStatus("Lỗi lưu file ❌");
    }
  };

  useEffect(() => {
    if (!ref.current) return;

    const ydoc = new Y.Doc();

    const provider = new WebsocketProvider(
      SERVER_URL,
      fileId,
      ydoc
    );

    const yText = ydoc.getText("monaco");

    provider.on("status", (e) => {
      setStatus(e.status === "connected" ? "Đã kết nối" : "Đang kết nối...");
    });

    const editor = monaco.editor.create(ref.current, {
      value: "",
      language: "javascript",
      theme: "vs-dark",
      automaticLayout: true,
      fontSize: 15,
      fontFamily: "var(--font-monaco)",
      minimap: { enabled: false }
    });

    editorRef.current = editor;

    const binding = new MonacoBinding(
      yText,
      editor.getModel(),
      new Set([editor]),
      provider.awareness
    );

    const userColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

    provider.awareness.setLocalStateField("user", {
      name: username,
      color: userColor
    });

    provider.awareness.on("change", () => {
      const states = Array.from(provider.awareness.getStates().values());
      const names = states.filter(s => s.user).map(s => s.user.name);
      setUsersOnline([...new Set(names)]);
    });

    axios.get(`${API_URL}/load/${fileId}`)
      .then(res => {
        if (yText.toString().length === 0 && res.data.content) {
          yText.insert(0, res.data.content);
        }
      })
      .catch(() => setStatus("Lỗi load file ❌"));

    return () => {
      binding.destroy();
      editor.dispose();
      provider.destroy();
      ydoc.destroy();
    };
  }, [fileId, username, SERVER_URL, API_URL]);

  return (
    <div className="editor-wrapper">

      <div style={statusBarEnhanced}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={dotStyle}></span>

          <span style={{ color: "#ccc" }}>{status}</span>

          <span style={{ color: "#444" }}>|</span>

          <span style={{ color: "#999" }}>
            👥 {usersOnline.length} online
          </span>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {/* ✅ NÚT SAVE */}
          <button onClick={save} style={saveBtn}>
            💾 Save
          </button>

          {usersOnline.map((name, i) => (
            <span key={i} style={userTagEnhanced}>
              {name}
            </span>
          ))}
        </div>
      </div>

      <div ref={ref} className="monaco-container" />
    </div>
  );
}

// 🎨 Style
const statusBarEnhanced = {
  padding: "12px 20px",
  background: "#1a1a1a",
  display: "flex",
  justifyContent: "space-between"
};

const dotStyle = {
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  background: "cyan"
};

const userTagEnhanced = {
  background: "#222",
  color: "cyan",
  padding: "4px 10px",
  borderRadius: "6px",
  fontSize: "12px"
};

const saveBtn = {
  background: "cyan",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold"
};