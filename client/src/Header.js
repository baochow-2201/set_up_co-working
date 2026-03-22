import React from "react";
import "./App.css"; 

// Thêm "share" vào danh sách nhận Props ở đây
export default function Header({ fileId, save, share, toggleTheme, isDarkMode }) {
  return (
    <div style={headerStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        
        <div style={logoStyle}>C</div>
        
        <span style={brandNameStyle}>Co-work Solutions</span>
        
        <span style={verticalDividerStyle}></span>
        
        <span style={fileIdStyle}>{fileId}</span>
      </div>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        
        {/* Nút đổi giao diện */}
        <button 
          className="btn-modern btn-theme-toggle" 
          onClick={toggleTheme}
          style={themeButtonStyle}
          title={isDarkMode ? "Chuyển sang chế độ Sáng" : "Chuyển sang chế độ Tối"}
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>

        
        {/* Nút Share - PHẢI THÊM onClick={share} VÀO ĐÂY */}
        <button className="btn-modern btn-action" onClick={share}>
           🔗 Share
        </button>
      </div>
    </div>
  );
}

// --- Phần Style giữ nguyên như cậu đã viết ---
const headerStyle = {
  height: "70px",
  padding: "0 25px",
  background: "var(--bg-panel)", 
  backdropFilter: "blur(12px)",
  borderBottom: "1px solid var(--border-color)", 
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "all 0.3s ease" 
};

const brandNameStyle = {
  fontSize: "22px",      
  fontWeight: "800",     
  letterSpacing: "0.5px",
  color: "var(--text-main)" 
};

const logoStyle = {
  width: "32px", 
  height: "32px", 
  background: "var(--bg-input)", 
  borderRadius: "6px",
  display: "grid", 
  placeItems: "center", 
  fontSize: "18px",      
  fontWeight: "bold",
  color: "var(--primary-cyan)",
  border: "1px solid var(--border-color)"
};

const verticalDividerStyle = {
  width: "2px",          
  height: "28px",        
  backgroundColor: "var(--border-color)",
  margin: "0 5px",       
  borderRadius: "2px"
};

const fileIdStyle = {
  color: "var(--primary-cyan)",
  fontSize: "18px",      
  fontWeight: "600",
  fontFamily: "var(--font-monaco)",
};

const themeButtonStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  fontSize: "20px",
  cursor: "pointer",
  border: "1px solid var(--border-color)",
  background: "rgba(255, 255, 255, 0.05)",
  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
};