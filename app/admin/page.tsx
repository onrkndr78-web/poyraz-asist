"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  role?: string;
  username?: string;
  agencyName?: string;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [user, setUser] =
    useState<User | null>(null);

  useEffect(() => {
    const savedUser =
      localStorage.getItem("poyraz_user");

    if (!savedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsed =
        JSON.parse(savedUser) as User;

      if (parsed.role !== "admin") {
        router.push("/login");
        return;
      }

      setUser(parsed);
    } catch {
      router.push("/login");
    }
  }, [router]);

  function logout() {
    localStorage.removeItem(
      "poyraz_user"
    );

    router.push("/login");
  }

  if (!user) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "Arial, sans-serif",
        }}
      >
        Yükleniyor...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        fontFamily:
          "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          background: "#0b2d4d",
          color: "white",
          padding: "18px 30px",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: "20px",
          boxShadow:
            "0 3px 12px rgba(0,0,0,0.12)",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: "800",
            }}
          >
            POYRAZ ASİST
          </div>

          <div
            style={{
              fontSize: "13px",
              opacity: 0.8,
              marginTop: "3px",
            }}
          >
            Genel Merkez Yönetim Paneli
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div
            style={{
              textAlign: "right",
            }}
          >
            <div
              style={{
                fontWeight: "700",
              }}
            >
              Genel Merkez
            </div>

            <div
              style={{
                fontSize: "12px",
                opacity: 0.75,
                marginTop: "3px",
              }}
            >
              Yönetici
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              background: "white",
              color: "#0b2d4d",
              border: "none",
              borderRadius: "8px",
              padding: "10px 16px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Çıkış
          </button>
        </div>
      </header>

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "30px",
        }}
      >
        {/* HOŞ GELDİNİZ */}
        <section
          style={{
            background:
              "linear-gradient(135deg,#0b2d4d,#17699e)",
            color: "white",
            borderRadius: "16px",
            padding: "30px",
            marginBottom: "25px",
            boxShadow:
              "0 8px 25px rgba(11,45,77,0.18)",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              opacity: 0.8,
              marginBottom: "8px",
            }}
          >
            GENEL MERKEZ
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "30px",
            }}
          >
            Hoş Geldiniz
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              opacity: 0.85,
            }}
          >
            Poyraz Asist genel merkez
            yönetim panelinden tüm
            operasyonları yönetebilirsiniz.
          </p>
        </section>

        {/* ANA MENÜ */}
        <section
          style={{
            background: "white",
            borderRadius: "15px",
            padding: "25px",
            marginBottom: "25px",
            boxShadow:
              "0 4px 18px rgba(0,0,0,0.06)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#102a43",
              fontSize: "21px",
            }}
          >
            ⚡ Yönetim Menüsü
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
            }}
          >
            <MenuCard
              icon="🚗"
              title="Asist Talepleri"
              description="Acentelerden gelen asist taleplerini yönetin."
              onClick={() =>
                router.push(
                  "/admin/assistance"
                )
              }
            />

            <MenuCard
              icon="📋"
              title="Poliçe Hareketleri"
              description="Verilen hizmetleri, araç bilgilerini ve operasyon kayıtlarını yönetin."
              onClick={() =>
                router.push(
                  "/admin/policy-movements"
                )
              }
            />

            <MenuCard
              icon="📄"
              title="Poliçeler"
              description="Tüm poliçeleri ve poliçe bilgilerini görüntüleyin."
              onClick={() =>
                router.push(
                  "/admin/policies"
                )
              }
            />

            <MenuCard
              icon="🏢"
              title="Acenteler"
              description="Acente bilgilerini ve acente hesaplarını yönetin."
              onClick={() =>
                router.push(
                  "/admin/agencies"
                )
              }
            />

            <MenuCard
              icon="👥"
              title="Müşteriler"
              description="Müşteri kayıtlarını ve bilgilerini yönetin."
              onClick={() =>
                router.push(
                  "/admin/customers"
                )
              }
            />

            <MenuCard
              icon="📊"
              title="Raporlar"
              description="Satış, poliçe ve operasyon raporlarını görüntüleyin."
              onClick={() =>
                router.push(
                  "/admin/reports"
                )
              }
            />
          </div>
        </section>

        {/* OPERASYON AYRIMI */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "18px",
          }}
        >
          <InfoCard
            icon="🚗"
            title="Asist Operasyonu"
            description="Bekliyor → Atandı → Yolda → Tamamlandı"
            buttonText="Asist Taleplerine Git"
            onClick={() =>
              router.push(
                "/admin/assistance"
              )
            }
          />

          <InfoCard
            icon="📋"
            title="Poliçe Hareketleri"
            description="Verilen hizmet, araç fotoğrafları ve operasyon kayıtları"
            buttonText="Poliçe Hareketlerine Git"
            onClick={() =>
              router.push(
                "/admin/policy-movements"
              )
            }
          />
        </section>

        {/* BİLGİ */}
        <div
          style={{
            marginTop: "25px",
            background: "#eaf4ff",
            borderRadius: "12px",
            padding: "16px 20px",
            color: "#1e40af",
            fontSize: "13px",
          }}
        >
          <strong>
            ℹ️ Sistem Yapısı:
          </strong>{" "}
          Asist Talepleri ve Poliçe
          Hareketleri birbirinden tamamen
          ayrı yönetilir.
        </div>
      </div>
    </main>
  );
}

function MenuCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "#f8fafc",
        border: "1px solid #e1e7ee",
        borderRadius: "13px",
        padding: "22px",
        cursor: "pointer",
        textAlign: "left",
        transition:
          "all 0.2s ease",
      }}
    >
      <div
        style={{
          fontSize: "32px",
          marginBottom: "12px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#102a43",
          fontSize: "17px",
          fontWeight: "800",
          marginBottom: "7px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#718096",
          fontSize: "13px",
          lineHeight: "1.5",
        }}
      >
        {description}
      </div>
    </button>
  );
}

function InfoCard({
  icon,
  title,
  description,
  buttonText,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "14px",
        padding: "22px",
        boxShadow:
          "0 4px 18px rgba(0,0,0,0.06)",
        borderTop:
          "4px solid #0b2d4d",
      }}
    >
      <div
        style={{
          fontSize: "30px",
          marginBottom: "10px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          margin: "0 0 8px",
          color: "#102a43",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#718096",
          fontSize: "13px",
          lineHeight: "1.5",
          minHeight: "40px",
        }}
      >
        {description}
      </p>

      <button
        onClick={onClick}
        style={{
          marginTop: "8px",
          background: "#0b2d4d",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "10px 14px",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        {buttonText} →
      </button>
    </div>
  );
}