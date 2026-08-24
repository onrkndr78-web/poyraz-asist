"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Policy = {
  id?: string;
  customer?: string;
  phone?: string;
  tc?: string;
  plate?: string;
  vehicle?: string;
  package?: string;
  price?: number;
  startDate?: string;
  endDate?: string;
};

export default function PoliceDetailPage() {
  const router = useRouter();

  const [policy, setPolicy] =
    useState<Policy | null>(null);

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          "poyraz_selected_policy"
        );

      if (!saved) return;

      const data = JSON.parse(saved);

      setPolicy(data);
    } catch {
      setPolicy(null);
    }
  }, []);

  if (!policy) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#eef3f8",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "18px",
            textAlign: "center",
            boxShadow:
              "0 5px 20px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Poliçe bulunamadı</h2>

          <button
            onClick={() =>
              router.push(
                "/acente/police-list"
              )
            }
            style={buttonStyle}
          >
            ← Poliçelerime Dön
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#eef3f8",
        padding: "30px 15px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "850px",
          margin: "auto",
          background: "white",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow:
            "0 6px 30px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg,#0c416d,#17699e)",
            color: "white",
            padding: "30px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "30px",
              fontWeight: "bold",
            }}
          >
            POYRAZ ASİST
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "18px",
            }}
          >
            🧾 POLİÇE BELGESİ
          </div>
        </div>

        <div style={{ padding: "35px" }}>
          <div
            style={{
              background: "#f4f7fb",
              padding: "18px",
              borderRadius: "10px",
              marginBottom: "25px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                color: "#777",
              }}
            >
              Poliçe No
            </div>

            <strong
              style={{
                color: "#0c416d",
                fontSize: "19px",
              }}
            >
              {policy.id || "-"}
            </strong>
          </div>

          <SectionTitle>
            👤 Müşteri Bilgileri
          </SectionTitle>

          <div style={gridStyle}>
            <Info
              title="Ad Soyad"
              value={policy.customer}
            />

            <Info
              title="Telefon"
              value={policy.phone}
            />

            <Info
              title="TC / VKN"
              value={policy.tc}
            />
          </div>

          <SectionTitle>
            🚗 Araç Bilgileri
          </SectionTitle>

          <div style={gridStyle}>
            <Info
              title="Plaka"
              value={policy.plate}
            />

            <Info
              title="Araç Marka / Model"
              value={policy.vehicle}
            />
          </div>

          <SectionTitle>
            📦 Asist Paketi
          </SectionTitle>

          <div
            style={{
              background: "#eaf3ff",
              border:
                "2px solid #0c416d",
              padding: "25px",
              borderRadius: "15px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "30px",
              }}
            >
              {policy.package === "STAR"
                ? "⭐"
                : policy.package === "PLAT"
                ? "💎"
                : "🥇"}
            </div>

            <div
              style={{
                color: "#0c416d",
                fontSize: "25px",
                fontWeight: "bold",
              }}
            >
              {policy.package ||
                "GOLD"}
            </div>

            <div
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                marginTop: "8px",
              }}
            >
              {policy.price || 0} TL
            </div>
          </div>

          <SectionTitle>
            📅 Poliçe Tarihleri
          </SectionTitle>

          <div style={gridStyle}>
            <Info
              title="Başlangıç"
              value={policy.startDate}
            />

            <Info
              title="Bitiş"
              value={policy.endDate}
            />
          </div>

          <SectionTitle>
            🛠️ Asist Hizmetleri
          </SectionTitle>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(230px,1fr))",
              gap: "10px",
            }}
          >
            {getFeatures(
              policy.package
            ).map(
              (feature, index) => (
                <div
                  key={index}
                  style={{
                    padding: "14px",
                    background:
                      "#f6f9fc",
                    borderRadius: "9px",
                    border:
                      "1px solid #e1e7ed",
                  }}
                >
                  ✓ {feature}
                </div>
              )
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: "15px",
              marginTop: "35px",
            }}
          >
            <button
              onClick={() =>
                router.push(
                  "/acente/police-list"
                )
              }
              style={{
                ...buttonStyle,
                background: "#e8eef4",
                color: "#173b59",
              }}
            >
              ← Poliçelerim
            </button>

            <button
              onClick={() =>
                window.print()
              }
              style={buttonStyle}
            >
              🖨️ Yazdır / PDF
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function getFeatures(
  packageName?: string
) {
  if (packageName === "STAR") {
    return [
      "7/24 Yol Yardım Hizmeti",
      "Çekici Hizmeti",
      "Akü Takviyesi",
      "Lastik Değişimi",
      "Yakıt Desteği",
    ];
  }

  if (packageName === "PLAT") {
    return [
      "7/24 Yol Yardım Hizmeti",
      "Çekici Hizmeti",
      "Akü Takviyesi",
      "Lastik Değişimi",
      "Yakıt Desteği",
      "Arıza Yol Yardımı",
      "Genişletilmiş Asist Hizmeti",
    ];
  }

  return [
    "7/24 Yol Yardım Hizmeti",
    "Çekici Hizmeti",
    "Akü Takviyesi",
    "Lastik Değişimi",
    "Yakıt Desteği",
    "Arıza Yol Yardımı",
  ];
}

function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h2
      style={{
        color: "#0c416d",
        fontSize: "19px",
        marginTop: "30px",
        marginBottom: "15px",
      }}
    >
      {children}
    </h2>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value?: string;
}) {
  return (
    <div
      style={{
        background: "#f7f9fb",
        padding: "16px",
        borderRadius: "10px",
        border:
          "1px solid #e2e8ee",
      }}
    >
      <div
        style={{
          color: "#777",
          fontSize: "12px",
          marginBottom: "6px",
        }}
      >
        {title}
      </div>

      <strong>
        {value || "-"}
      </strong>
    </div>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "15px",
};

const buttonStyle = {
  flex: 1,
  padding: "14px",
  background: "#0c416d",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "15px",
  fontWeight: "bold" as const,
  cursor: "pointer",
};