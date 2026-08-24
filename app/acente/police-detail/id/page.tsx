"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

const packageInfo: Record<
  string,
  {
    name: string;
    icon: string;
    color: string;
    features: string[];
  }
> = {
  STAR: {
    name: "STAR",
    icon: "⭐",
    color: "#d99b00",
    features: [
      "7/24 Yol Yardım Hizmeti",
      "Çekici Hizmeti",
      "Akü Takviyesi",
      "Lastik Değişimi",
      "Yakıt Desteği",
    ],
  },

  GOLD: {
    name: "GOLD",
    icon: "🥇",
    color: "#b8860b",
    features: [
      "7/24 Yol Yardım Hizmeti",
      "Çekici Hizmeti",
      "Akü Takviyesi",
      "Lastik Değişimi",
      "Yakıt Desteği",
      "Arıza Durumunda Yol Yardım",
    ],
  },

  PLAT: {
    name: "PLAT",
    icon: "💎",
    color: "#1677b8",
    features: [
      "7/24 Yol Yardım Hizmeti",
      "Çekici Hizmeti",
      "Akü Takviyesi",
      "Lastik Değişimi",
      "Yakıt Desteği",
      "Arıza Durumunda Yol Yardım",
      "Genişletilmiş Asist Hizmeti",
    ],
  },
};

export default function PoliceDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [policy, setPolicy] =
    useState<Policy | null>(null);

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem("poyraz_policies");

      if (!saved) return;

      const list = JSON.parse(saved);

      if (!Array.isArray(list)) return;

      const found = list.find(
        (item: Policy) =>
          item.id === params.id
      );

      if (found) {
        setPolicy(found);
      }
    } catch {
      setPolicy(null);
    }
  }, [params.id]);

  if (!policy) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#eef3f8",
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "18px",
            textAlign: "center",
          }}
        >
          <h2>Poliçe bulunamadı</h2>

          <button
            onClick={() =>
              router.push(
                "/acente/police-list"
              )
            }
            style={backButton}
          >
            ← Poliçelerime Dön
          </button>
        </div>
      </main>
    );
  }

  const info =
    packageInfo[policy.package || "GOLD"] ||
    packageInfo.GOLD;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#eef3f8",
        padding: "30px 15px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        className="print-area"
        style={{
          maxWidth: "900px",
          margin: "auto",
          background: "white",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow:
            "0 6px 30px rgba(0,0,0,0.10)",
        }}
      >
        {/* ÜST BAŞLIK */}

        <div
          style={{
            background:
              "linear-gradient(135deg,#0c416d,#17699e)",
            color: "white",
            padding: "30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
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
                marginTop: "7px",
                opacity: 0.9,
              }}
            >
              Yol Yardım & Asist Hizmetleri
            </div>
          </div>

          <div
            style={{
              textAlign: "right",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                opacity: 0.8,
              }}
            >
              POLİÇE BELGESİ
            </div>

            <strong>
              {policy.id}
            </strong>
          </div>
        </div>

        <div
          style={{
            padding: "35px",
          }}
        >
          {/* DURUM */}

          <div
            style={{
              background: "#e9f8ef",
              color: "#168044",
              padding: "14px 18px",
              borderRadius: "10px",
              marginBottom: "25px",
              fontWeight: "bold",
            }}
          >
            ✓ POLİÇE AKTİF
          </div>

          {/* MÜŞTERİ */}

          <SectionTitle>
            👤 Müşteri Bilgileri
          </SectionTitle>

          <div style={grid}>
            <Info
              title="Ad Soyad"
              value={policy.customer}
            />

            <Info
              title="TC / VKN"
              value={policy.tc}
            />

            <Info
              title="Telefon"
              value={policy.phone}
            />
          </div>

          {/* ARAÇ */}

          <SectionTitle>
            🚗 Araç Bilgileri
          </SectionTitle>

          <div style={grid}>
            <Info
              title="Plaka"
              value={policy.plate}
            />

            <Info
              title="Araç Marka / Model"
              value={policy.vehicle}
            />
          </div>

          {/* PAKET */}

          <SectionTitle>
            📦 Asist Paketi
          </SectionTitle>

          <div
            style={{
              border: `2px solid ${info.color}`,
              borderRadius: "15px",
              padding: "25px",
              textAlign: "center",
              background: "#fafafa",
            }}
          >
            <div
              style={{
                fontSize: "30px",
              }}
            >
              {info.icon}
            </div>

            <div
              style={{
                fontSize: "26px",
                fontWeight: "bold",
                color: info.color,
                marginTop: "8px",
              }}
            >
              {info.name}
            </div>

            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              {policy.price} TL
            </div>
          </div>

          {/* TARİHLER */}

          <SectionTitle>
            📅 Poliçe Süresi
          </SectionTitle>

          <div style={grid}>
            <Info
              title="Başlangıç Tarihi"
              value={policy.startDate}
            />

            <Info
              title="Bitiş Tarihi"
              value={policy.endDate}
            />
          </div>

          {/* TEMİNATLAR */}

          <SectionTitle>
            🛠️ Asist Hizmetleri
          </SectionTitle>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(250px,1fr))",
              gap: "10px",
            }}
          >
            {info.features.map(
              (feature, index) => (
                <div
                  key={index}
                  style={{
                    background: "#f5f8fb",
                    padding: "14px",
                    borderRadius: "9px",
                    border:
                      "1px solid #e1e8ef",
                  }}
                >
                  ✓ {feature}
                </div>
              )
            )}
          </div>

          {/* ALT BİLGİ */}

          <div
            style={{
              marginTop: "30px",
              padding: "18px",
              background: "#f7f9fb",
              borderRadius: "10px",
              fontSize: "13px",
              color: "#666",
            }}
          >
            Bu belge Poyraz Asist acente sistemi
            üzerinden oluşturulmuştur.
          </div>

          {/* BUTONLAR */}

          <div
            className="no-print"
            style={{
              display: "flex",
              gap: "15px",
              marginTop: "30px",
            }}
          >
            <button
              onClick={() =>
                router.push(
                  "/acente/police-list"
                )
              }
              style={backButton}
            >
              ← Poliçelerim
            </button>

            <button
              onClick={() =>
                window.print()
              }
              style={printButton}
            >
              🖨️ Yazdır / PDF
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          .print-area {
            box-shadow: none !important;
            border-radius: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </main>
  );
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
          "1px solid #e3e8ed",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          color: "#777",
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

const grid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "15px",
};

const backButton = {
  flex: 1,
  padding: "14px",
  border: "none",
  borderRadius: "10px",
  background: "#e7edf3",
  color: "#173b59",
  fontSize: "15px",
  fontWeight: "bold" as const,
  cursor: "pointer",
};

const printButton = {
  flex: 1,
  padding: "14px",
  border: "none",
  borderRadius: "10px",
  background: "#0c416d",
  color: "white",
  fontSize: "15px",
  fontWeight: "bold" as const,
  cursor: "pointer",
};