"use client";

import { useState } from "react";

export default function YoneticiGirisPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function login() {
    setError("");

    if (
      username.trim() === "admin" &&
      password === "123456"
    ) {
      localStorage.setItem(
        "poyraz_admin_logged",
        "true"
      );

      window.location.href = "/yonetici";
      return;
    }

    setError("Yönetici kullanıcı adı veya şifre hatalı.");
  }

  return (
    <main className="login">

      <div className="box">

        <div className="logo">
          POYRAZ <span>ASİST</span>
        </div>

        <div className="subtitle">
          YÖNETİCİ PANELİ
        </div>

        <h1>Yönetici Girişi</h1>

        <p>
          Poyraz Asist Yönetim Merkezi
        </p>

        <label>
          Kullanıcı Adı
        </label>

        <input
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          placeholder="Yönetici kullanıcı adı"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              login();
            }
          }}
        />

        <label>
          Şifre
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          placeholder="Yönetici şifresi"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              login();
            }
          }}
        />

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <button onClick={login}>
          YÖNETİCİ GİRİŞİ
        </button>

        <div className="demo">
          Test giriş bilgileri
          <br />
          Kullanıcı: <b>admin</b>
          <br />
          Şifre: <b>123456</b>
        </div>

      </div>

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .login {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #071a32;
          font-family: Arial, sans-serif;
        }

        .box {
          width: 420px;
          background: white;
          padding: 40px;
          border-radius: 18px;
          box-shadow:
            0 20px 60px rgba(0,0,0,.25);
        }

        .logo {
          font-size: 28px;
          font-weight: 900;
          color: #071a32;
        }

        .logo span {
          color: #f5a900;
        }

        .subtitle {
          margin-top: 6px;
          color: #718096;
          font-size: 11px;
          letter-spacing: 2px;
          font-weight: bold;
        }

        h1 {
          margin: 28px 0 8px;
          color: #172b4d;
        }

        p {
          color: #718096;
          margin-bottom: 28px;
        }

        label {
          display: block;
          margin: 15px 0 7px;
          font-weight: bold;
          color: #172b4d;
          font-size: 14px;
        }

        input {
          width: 100%;
          padding: 14px;
          border: 1px solid #d8e0e8;
          border-radius: 8px;
          font-size: 15px;
          outline: none;
        }

        input:focus {
          border-color: #0c416d;
        }

        button {
          width: 100%;
          margin-top: 22px;
          padding: 14px;
          border: 0;
          border-radius: 8px;
          background: #f5a900;
          color: #071a32;
          font-weight: 900;
          cursor: pointer;
        }

        button:hover {
          background: #ffb91f;
        }

        .error {
          margin-top: 15px;
          padding: 12px;
          background: #fff0f0;
          color: #c53030;
          border-radius: 8px;
          font-size: 13px;
        }

        .demo {
          margin-top: 25px;
          padding: 13px;
          background: #f4f7fb;
          border-radius: 8px;
          color: #718096;
          font-size: 12px;
          text-align: center;
          line-height: 1.7;
        }

      `}</style>

    </main>
  );
}