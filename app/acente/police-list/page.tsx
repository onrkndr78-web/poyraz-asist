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

export default function PoliceListPage() {
  const router = useRouter();

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved =
      localStorage.getItem("poyraz_policies");

    if (!saved) return;

    try {
      const data = JSON.parse(saved);

      if (Array.isArray(data)) {
        setPolicies(data);
      }
    } catch {
      setPolicies([]);
    }
  }, []);

  function viewPolicy(policy: Policy) {
    localStorage.setItem(
      "poyraz_selected_policy",
      JSON.stringify(policy)
    );

    router.push("/acente/police-detail");
  }

  const filtered = policies.filter((policy) => {
    const text = search
      .toLowerCase()
      .trim();

    if (!text) return true;

    return (
      (policy.customer || "")
        .toLowerCase()
        .includes(text) ||
      (policy.tc || "")
        .toLowerCase()
        .includes(text) ||
      (policy.plate || "")
        .toLowerCase()
        .includes(text) ||
      (policy.id || "")
        .toLowerCase()
        .includes(text)
    );
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#eef3f8",
        padding: "35px 20px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "1300px",
          margin: "auto",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg,#0c416d,#17699e)",
            color: "white",
            padding: "30px",
            borderRadius: "18px",
            marginBottom: "25px",
          }}
        >
          <h1 style={{ margin: 0 }}>
            📋 Poliçelerim
          </h1>

          <p>
            Oluşturduğunuz poliçeleri
            görüntüleyebilirsiniz.
          </p>
        </div>

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "18px",
            marginBottom: "25px",
          }}
        >
          <h2 style={{ color: "#0c416d" }}>
            🔎 Poliçe Ara
          </h2>

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Ad Soyad, TC/VKN, Plaka veya Poliçe No"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px",
              border:
                "1px solid #d5dce5",
              borderRadius: "10px",
              fontSize: "15px",
            }}
          />
        </div>

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "18px",
            overflowX: "auto",
          }}
        >
          <h2 style={{ color: "#0c416d" }}>
            Poliçe Listesi
          </h2>

          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "50px",
                color: "#777",
              }}
            >
              Henüz poliçe bulunmuyor.
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
                minWidth: "1050px",
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>
                    Müşteri
                  </th>

                  <th style={thStyle}>
                    TC / VKN
                  </th>

                  <th style={thStyle}>
                    Plaka
                  </th>

                  <th style={thStyle}>
                    Araç
                  </th>

                  <th style={thStyle}>
                    Paket
                  </th>

                  <th style={thStyle}>
                    Fiyat
                  </th>

                  <th style={thStyle}>
                    Başlangıç
                  </th>

                  <th style={thStyle}>
                    Bitiş
                  </th>

                  <th style={thStyle}>
                    İşlem
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map(
                  (policy, index) => (
                    <tr
                      key={
                        policy.id ||
                        index
                      }
                    >
                      <td style={tdStyle}>
                        <strong>
                          {policy.customer ||
                            "-"}
                        </strong>
                      </td>

                      <td style={tdStyle}>
                        {policy.tc || "-"}
                      </td>

                      <td style={tdStyle}>
                        {policy.plate || "-"}
                      </td>

                      <td style={tdStyle}>
                        {policy.vehicle ||
                          "-"}
                      </td>

                      <td style={tdStyle}>
                        {policy.package ||
                          "-"}
                      </td>

                      <td style={tdStyle}>
                        {policy.price
                          ? `${policy.price} TL`
                          : "-"}
                      </td>

                      <td style={tdStyle}>
                        {policy.startDate ||
                          "-"}
                      </td>

                      <td style={tdStyle}>
                        {policy.endDate ||
                          "-"}
                      </td>

                      <td style={tdStyle}>
                        <button
                          onClick={() =>
                            viewPolicy(
                              policy
                            )
                          }
                          style={{
                            padding:
                              "10px 16px",
                            background:
                              "#0c416d",
                            color:
                              "white",
                            border:
                              "none",
                            borderRadius:
                              "8px",
                            cursor:
                              "pointer",
                            fontWeight:
                              "bold",
                          }}
                        >
                          👁️ Görüntüle
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <button
            onClick={() =>
              router.push("/acente")
            }
            style={{
              padding: "12px 22px",
              background: "white",
              color: "#0c416d",
              border:
                "1px solid #d5dce5",
              borderRadius: "9px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ← Acente Paneline Dön
          </button>
        </div>
      </div>
    </main>
  );
}

const thStyle = {
  textAlign: "left" as const,
  padding: "14px",
  background: "#f1f5f9",
  color: "#173b59",
  borderBottom:
    "2px solid #dce3ea",
};

const tdStyle = {
  padding: "14px",
  borderBottom:
    "1px solid #e8edf2",
  whiteSpace: "nowrap" as const,
};