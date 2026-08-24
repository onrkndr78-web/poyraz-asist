"use client";

import { useState } from "react";

export default function GirisPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function login() {
    setError("");

    if (!username || !password) {
      setError("Kullanıcı adı ve şifre giriniz.");
      return;
    }

    try {
      const data = localStorage.getItem(
        "poyraz_agencies"
      );

      const agencies = data
        ? JSON.parse(data)
        : [];

      const agency = agencies.find(
        (a: any) =>
          a.username === username &&
          a.password === password
      );

      if (!agency) {
        setError(
          "Kullanıcı adı veya şifre hatalı."
        );
        return;
      }

      if (!agency.active) {
        setError(
          "Bu acente hesabı pasif durumdadır."
        );
        return;
      }

      localStorage.setItem(
        "poyraz_current_agency",
        JSON.stringify({
          id: agency.id,
          name: agency.name,
          username: agency.username,
          phone: agency.phone,
          email: agency.email,
          commission: agency.commission,
        })
      );

      window.location.href = "/acente";
    } catch {
      setError(
        "Giriş sırasında bir hata oluştu."
      );
    }
  }

  return (
    <main className="login">

      <div className="box">

        <div className="logo">
          POYRAZ <span>ASİST</span>
        </div>

        <h1>Acente Girişi</h1>

        <p>
          Poyraz Asist Acente Portalı
        </p>

        <label>
          Kullanıcı Adı
        </label>

        <input
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          placeholder="Kullanıcı adınız"
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
          placeholder="Şifreniz"
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
          GİRİŞ YAP
        </button>

        <div className="demo">
          İlk test acentesi:
          <br />
          Kullanıcı: <b>gkn001</b>
          <br />
          Şifre: <b>123456</b>
        </div>

      </div>

      <style jsx>{`

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
          font-size: 27px;
          font-weight: 900;
          color: #071a32;
          margin-bottom: 25px;
        }

        .logo span {
          color: #f5a900;
        }

        h1 {
          margin: 0;
          color: #172b4d;
        }

        p {
          color: #718096;
          margin-bottom: 30px;
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
        }

      `}</style>

    </main>
  );
}