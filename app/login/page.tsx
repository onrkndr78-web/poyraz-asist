"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Agency = {
  id: string;
  name: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  commissionRate: number;
  active: boolean;
  createdAt: string;
};

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function login() {
    setError("");
    setLoading(true);

    const cleanUsername = username.trim();

    // =========================
    // ADMIN GİRİŞİ
    // =========================
    if (
      cleanUsername === "admin" &&
      password === "1234"
    ) {
      localStorage.setItem(
        "poyraz_user",
        JSON.stringify({
          role: "admin",
          username: "admin",
        })
      );

      router.push("/admin");
      return;
    }

    // =========================
    // ACENTELERİ AL
    // =========================
    let agencies: Agency[] = [];

    try {
      const savedAgencies =
        localStorage.getItem(
          "poyraz_agencies"
        );

      if (savedAgencies) {
        const parsed =
          JSON.parse(savedAgencies);

        if (Array.isArray(parsed)) {
          agencies = parsed;
        }
      }
    } catch {
      agencies = [];
    }

    // =========================
    // ACENTE GİRİŞİ
    // =========================
    const agency = agencies.find(
      (item) =>
        String(item.username ?? "")
          .toLowerCase() ===
          cleanUsername.toLowerCase() &&
        String(item.password ?? "") ===
          password
    );

    if (agency) {
      // PASİF ACENTE KONTROLÜ
      if (agency.active === false) {
        setError(
          "❌ Bu acente hesabı pasif durumdadır."
        );
        setLoading(false);
        return;
      }

      // ACENTE BİLGİLERİNİ KAYDET
      localStorage.setItem(
        "poyraz_user",
        JSON.stringify({
          role: "acente",
          username: agency.username,
          agencyId: agency.id,
          agencyName: agency.name,
          commissionRate:
            Number(
              agency.commissionRate
            ) || 35,
        })
      );

      router.push("/acente");
      return;
    }

    // =========================
    // HATALI GİRİŞ
    // =========================
    setError(
      "❌ Kullanıcı adı veya şifre hatalı."
    );

    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#071d2f,#0c416d,#17699e)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "white",
          padding: "40px",
          borderRadius: "22px",
          boxShadow:
            "0 15px 45px rgba(0,0,0,0.3)",
          boxSizing: "border-box",
        }}
      >
        {/* LOGO / BAŞLIK */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              fontSize: "50px",
              marginBottom: "10px",
            }}
          >
            🛡️
          </div>

          <h1
            style={{
              margin: 0,
              color: "#0c416d",
              fontSize: "28px",
            }}
          >
            POYRAZ ASİST
          </h1>

          <p
            style={{
              color: "#777",
              marginTop: "8px",
            }}
          >
            Güvenli Yönetim Sistemi
          </p>
        </div>

        {/* KULLANICI ADI */}
        <label
          style={{
            display: "block",
            marginBottom: "7px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Kullanıcı Adı
        </label>

        <input
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          placeholder="Kullanıcı adınızı girin"
          autoComplete="username"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              login();
            }
          }}
          style={{
            width: "100%",
            padding: "14px",
            border:
              "1px solid #d5dce5",
            borderRadius: "10px",
            marginBottom: "18px",
            boxSizing: "border-box",
            fontSize: "15px",
          }}
        />

        {/* ŞİFRE */}
        <label
          style={{
            display: "block",
            marginBottom: "7px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Şifre
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          placeholder="Şifrenizi girin"
          autoComplete="current-password"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              login();
            }
          }}
          style={{
            width: "100%",
            padding: "14px",
            border:
              "1px solid #d5dce5",
            borderRadius: "10px",
            marginBottom: "20px",
            boxSizing: "border-box",
            fontSize: "15px",
          }}
        />

        {/* HATA */}
        {error && (
          <div
            style={{
              background: "#fff1f1",
              color: "#b42318",
              padding: "12px",
              borderRadius: "9px",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* GİRİŞ */}
        <button
          onClick={login}
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            background: loading
              ? "#7b9ab2"
              : "#0c416d",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "17px",
            fontWeight: "bold",
            cursor: loading
              ? "not-allowed"
              : "pointer",
          }}
        >
          {loading
            ? "Giriş yapılıyor..."
            : "🔐 GİRİŞ YAP"}
        </button>

        {/* BİLGİ */}
        <div
          style={{
            marginTop: "25px",
            padding: "15px",
            background: "#f5f7fa",
            borderRadius: "10px",
            fontSize: "13px",
            color: "#666",
          }}
        >
          <strong>Giriş Bilgisi</strong>

          <div
            style={{
              marginTop: "8px",
            }}
          >
            Yönetici:{" "}
            <b>admin / 1234</b>
          </div>

          <div
            style={{
              marginTop: "5px",
            }}
          >
            Acente hesabı,{" "}
            <b>Admin → Acenteler</b>{" "}
            bölümünden oluşturulur.
          </div>
        </div>
      </div>
    </main>
  );
}