import { useNavigate } from 'react-router-dom';

function VerifySuccess() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>✅ 驗證成功</h2>
      <p>您的帳號已啟用，請前往登入。</p>
      <button
        onClick={() => navigate("/login")}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        前往登入
      </button>
    </div>
  );
}

export default VerifySuccess;