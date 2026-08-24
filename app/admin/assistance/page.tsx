"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AssistanceRequest = {
  id?: string;
  requestNo?: string;
  policyNumber?: string;
  agencyName?: string;
  customerName?: string;
  customerPhone?: string;
  vehiclePlate?: string;
  assistanceType?: string;
  city?: string;
  district?: string;
  address?: string;
  description?: string;
  priority?: string;
  status?: string;
  createdAt?: string;
};

const STATUS_OPTIONS = [
  "Bekliyor",
  "Atandı",
  "Yolda",
  "Tamamlandı",
  "İptal",
];

export default function AdminAssistancePage() {
  const router = useRouter();

  const [requests, setRequests] =
    useState<AssistanceRequest[]>([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("Tümü");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const savedUser =
      localStorage.getItem("poyraz_user");

    if (!savedUser) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      if (user.role !== "admin") {
        router.push("/login");
        return;
      }
    } catch {
      router.push("/login");
      return;
    }

    loadRequests();
  }, [router]);

  function loadRequests() {
    try {
      const saved =
        localStorage.getItem(
          "poyraz_assistance_requests"
        );

      if (!saved) {
        setRequests([]);
        setLoading(false);
        return;
      }

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setRequests(parsed);
      } else {
        setRequests([]);
      }
    } catch {
      setRequests([]);
    }

    setLoading(false);
  }

  function updateStatus(
    id: string | undefined,
    newStatus: string
  ) {
    if (!id) return;

    const updated = requests.map(
      (request) =>
        String(request.id) === String(id)
          ? {
              ...request,
              status: newStatus,
            }
          : request
    );

    setRequests(updated);

    localStorage.setItem(
      "poyraz_assistance_requests",
      JSON.stringify(updated)
    );
  }

  function deleteRequest(
    id: string | undefined
  ) {
    if (!id) return;

    const confirmed = window.confirm(
      "Bu asist talebini silmek istediğinize emin misiniz?"
    );

    if (!confirmed) return;

    const updated = requests.filter(
      (request) =>
        String(request.id) !== String(id)
    );

    setRequests(updated);

    localStorage.setItem(
      "poyraz_assistance_requests",
      JSON.stringify(updated)
    );
  }

  function formatDate(value?: string) {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleString("tr-TR");
  }

  function safeText(value: unknown) {
    return String(value ?? "");
  }

  const filteredRequests =
    requests.filter((request) => {
      const text =
        search.trim().toLowerCase();

      const matchesSearch =
        !text ||
        safeText(request.requestNo)
          .toLowerCase()
          .includes(text) ||
        safeText(request.policyNumber)
          .toLowerCase()
          .includes(text) ||
        safeText(request.agencyName)
          .toLowerCase()
          .includes(text) ||
        safeText(request.customerName)
          .toLowerCase()
          .includes(text) ||
        safeText(request.customerPhone)
          .toLowerCase()
          .includes(text) ||
        safeText(request.vehiclePlate)
          .toLowerCase()
          .includes(text) ||
        safeText(request.assistanceType)
          .toLowerCase()
          .includes(text) ||
        safeText(request.city)
          .toLowerCase()
          .includes(text) ||
        safeText(request.district)
          .toLowerCase()
          .includes(text);

      const status =
        request.status || "Bekliyor";

      const matchesStatus =
        statusFilter === "Tümü" ||
        status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  const totalRequests =
    requests.length;

  const waitingRequests =
    requests.filter(
      (request) =>
        (request.status ||
          "Bekliyor") ===
        "Bekliyor"
    ).length;

  const activeRequests =
    requests.filter(
      (request) =>
        request.status === "Atandı" ||
        request.status === "Yolda"
    ).length;

  const completedRequests =
    requests.filter(
      (request) =>
        request.status ===
        "Tamamlandı"
    ).length;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        fontFamily:
          "Arial, sans-serif",
        paddingBottom: "40px",
      }}
    >
      <header
        style={{
          background: "#0b2d4d",
          color: "white",
          padding: "18px 30px",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
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
            Asist Talep Yönetimi
          </div>
        </div>

        <button
          onClick={() =>
            router.push("/admin")
          }
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
          ← Admin Paneli
        </button>
      </header>

      <div
        style={{
          maxWidth: "1500px",
          margin: "0 auto",
          padding: "30px",
        }}
      >
        <div
          style={{
            marginBottom: "25px",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#102a43",
              fontSize: "30px",
            }}
          >
            🚗 Asist Talepleri
          </h1>

          <p
            style={{
              color: "#718096",
              marginTop: "8px",
            }}
          >
            Acenteler tarafından
            oluşturulan asist
            taleplerini buradan
            yönetin.
          </p>
        </div>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "18px",
            marginBottom: "25px",
          }}
        >
          <StatCard
            icon="🚨"
            title="Toplam Talep"
            value={totalRequests}
          />

          <StatCard
            icon="⏳"
            title="Bekleyen"
            value={waitingRequests}
          />

          <StatCard
            icon="🚛"
            title="Aktif Operasyon"
            value={activeRequests}
          />

          <StatCard
            icon="✅"
            title="Tamamlanan"
            value={completedRequests}
          />
        </section>

        <section
          style={{
            background: "white",
            borderRadius: "14px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow:
              "0 4px 18px rgba(0,0,0,0.06)",
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="🔎 Talep no, poliçe, acente, müşteri, plaka..."
            style={{
              flex: 1,
              minWidth: "300px",
              padding: "13px",
              border:
                "1px solid #d8dee6",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
            }}
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            style={{
              minWidth: "180px",
              padding: "13px",
              border:
                "1px solid #d8dee6",
              borderRadius: "8px",
              fontSize: "14px",
              background: "white",
            }}
          >
            <option value="Tümü">
              Tüm Durumlar
            </option>

            {STATUS_OPTIONS.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              )
            )}
          </select>
        </section>

        <section
          style={{
            background: "white",
            borderRadius: "15px",
            boxShadow:
              "0 4px 18px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "20px",
              borderBottom:
                "1px solid #edf1f5",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#102a43",
                fontSize: "20px",
              }}
            >
              📋 Asist Talep Listesi
            </h2>

            <p
              style={{
                margin:
                  "6px 0 0",
                color: "#718096",
                fontSize: "13px",
              }}
            >
              Gösterilen talep:{" "}
              <strong>
                {filteredRequests.length}
              </strong>
            </p>
          </div>

          {loading ? (
            <div
              style={{
                padding: "50px",
                textAlign: "center",
                color: "#718096",
              }}
            >
              Talepler yükleniyor...
            </div>
          ) : filteredRequests.length ===
            0 ? (
            <div
              style={{
                padding: "60px",
                textAlign: "center",
                color: "#718096",
              }}
            >
              <div
                style={{
                  fontSize: "45px",
                  marginBottom: "10px",
                }}
              >
                🚗
              </div>

              <strong>
                Asist talebi bulunamadı.
              </strong>

              <div
                style={{
                  marginTop: "7px",
                  fontSize: "13px",
                }}
              >
                Henüz oluşturulmuş
                bir asist talebi
                bulunmuyor.
              </div>
            </div>
          ) : (
            <div
              style={{
                overflowX: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse:
                    "collapse",
                  minWidth: "1500px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background:
                        "#f5f7fa",
                      textAlign: "left",
                    }}
                  >
                    <th style={thStyle}>
                      Talep No
                    </th>

                    <th style={thStyle}>
                      Poliçe
                    </th>

                    <th style={thStyle}>
                      Acente
                    </th>

                    <th style={thStyle}>
                      Müşteri
                    </th>

                    <th style={thStyle}>
                      Telefon
                    </th>

                    <th style={thStyle}>
                      Plaka
                    </th>

                    <th style={thStyle}>
                      Hizmet
                    </th>

                    <th style={thStyle}>
                      Konum
                    </th>

                    <th style={thStyle}>
                      Öncelik
                    </th>

                    <th style={thStyle}>
                      Durum
                    </th>

                    <th style={thStyle}>
                      Tarih
                    </th>

                    <th style={thStyle}>
                      İşlem
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRequests
                    .slice()
                    .reverse()
                    .map(
                      (
                        request,
                        index
                      ) => {
                        const status =
                          request.status ||
                          "Bekliyor";

                        const priority =
                          request.priority ||
                          "Normal";

                        return (
                          <tr
                            key={
                              request.id ||
                              index
                            }
                            style={{
                              borderBottom:
                                "1px solid #edf1f5",
                            }}
                          >
                            <td style={tdStyle}>
                              <strong>
                                {request.requestNo ||
                                  "-"}
                              </strong>
                            </td>

                            <td style={tdStyle}>
                              {request.policyNumber ||
                                "-"}
                            </td>

                            <td style={tdStyle}>
                              {request.agencyName ||
                                "-"}
                            </td>

                            <td style={tdStyle}>
                              {request.customerName ||
                                "-"}
                            </td>

                            <td style={tdStyle}>
                              {request.customerPhone ||
                                "-"}
                            </td>

                            <td style={tdStyle}>
                              <strong>
                                {request.vehiclePlate ||
                                  "-"}
                              </strong>
                            </td>

                            <td style={tdStyle}>
                              <span
                                style={{
                                  background:
                                    "#eaf4ff",
                                  color:
                                    "#0b2d4d",
                                  padding:
                                    "6px 9px",
                                  borderRadius:
                                    "20px",
                                  fontWeight:
                                    "700",
                                }}
                              >
                                {request.assistanceType ||
                                  "-"}
                              </span>
                            </td>

                            <td
                              style={{
                                ...tdStyle,
                                whiteSpace:
                                  "normal",
                                maxWidth:
                                  "220px",
                              }}
                            >
                              <strong>
                                {request.city ||
                                  "-"}
                                {" / "}
                                {request.district ||
                                  "-"}
                              </strong>

                              <div
                                style={{
                                  color:
                                    "#718096",
                                  fontSize:
                                    "12px",
                                  marginTop:
                                    "4px",
                                }}
                              >
                                {request.address ||
                                  "-"}
                              </div>
                            </td>

                            <td style={tdStyle}>
                              <PriorityBadge
                                priority={
                                  priority
                                }
                              />
                            </td>

                            <td style={tdStyle}>
                              <StatusBadge
                                status={
                                  status
                                }
                              />
                            </td>

                            <td style={tdStyle}>
                              {formatDate(
                                request.createdAt
                              )}
                            </td>

                            <td style={tdStyle}>
                              <div
                                style={{
                                  display:
                                    "flex",
                                  gap: "8px",
                                  alignItems:
                                    "center",
                                }}
                              >
                                <select
                                  value={
                                    status
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    updateStatus(
                                      request.id,
                                      e
                                        .target
                                        .value
                                    )
                                  }
                                  style={{
                                    padding:
                                      "8px",
                                    border:
                                      "1px solid #d8dee6",
                                    borderRadius:
                                      "7px",
                                    fontSize:
                                      "12px",
                                    background:
                                      "white",
                                  }}
                                >
                                  {STATUS_OPTIONS.map(
                                    (
                                      option
                                    ) => (
                                      <option
                                        key={
                                          option
                                        }
                                        value={
                                          option
                                        }
                                      >
                                        {
                                          option
                                        }
                                      </option>
                                    )
                                  )}
                                </select>

                                <button
                                  onClick={() =>
                                    deleteRequest(
                                      request.id
                                    )
                                  }
                                  style={{
                                    background:
                                      "#dc2626",
                                    color:
                                      "white",
                                    border:
                                      "none",
                                    borderRadius:
                                      "7px",
                                    padding:
                                      "8px 10px",
                                    cursor:
                                      "pointer",
                                    fontWeight:
                                      "700",
                                  }}
                                >
                                  Sil
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div
          style={{
            marginTop: "20px",
            background: "#eaf4ff",
            borderRadius: "12px",
            padding: "15px 20px",
            color: "#1e40af",
            fontSize: "13px",
          }}
        >
          <strong>
            ℹ️ Operasyon Akışı:
          </strong>{" "}
          Asist talepleri burada
          yönetilir. Durum sırası:
          <strong>
            {" "}
            Bekliyor → Atandı → Yolda →
            Tamamlandı
          </strong>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: number;
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "14px",
        padding: "22px",
        boxShadow:
          "0 4px 18px rgba(0,0,0,0.06)",
        borderLeft:
          "5px solid #0b2d4d",
      }}
    >
      <div
        style={{
          fontSize: "28px",
          marginBottom: "10px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#718096",
          fontSize: "13px",
          marginBottom: "7px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#102a43",
          fontSize: "25px",
          fontWeight: "800",
        }}
      >
        {value.toLocaleString("tr-TR")}
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  let background = "#fff7ed";
  let color = "#c2410c";

  if (status === "Atandı") {
    background = "#eff6ff";
    color = "#1d4ed8";
  }

  if (status === "Yolda") {
    background = "#fefce8";
    color = "#a16207";
  }

  if (status === "Tamamlandı") {
    background = "#ecfdf5";
    color = "#15803d";
  }

  if (status === "İptal") {
    background = "#fef2f2";
    color = "#dc2626";
  }

  return (
    <span
      style={{
        display: "inline-block",
        background,
        color,
        padding: "6px 10px",
        borderRadius: "20px",
        fontWeight: "700",
        fontSize: "12px",
      }}
    >
      {status}
    </span>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: string;
}) {
  let color = "#52606d";
  let background = "#f1f5f9";

  if (priority === "Yüksek") {
    color = "#d97706";
    background = "#fff7ed";
  }

  if (priority === "Acil") {
    color = "#dc2626";
    background = "#fef2f2";
  }

  return (
    <span
      style={{
        display: "inline-block",
        background,
        color,
        padding: "6px 10px",
        borderRadius: "20px",
        fontWeight: "700",
        fontSize: "12px",
      }}
    >
      {priority}
    </span>
  );
}

const thStyle: React.CSSProperties = {
  padding: "14px 12px",
  color: "#52606d",
  fontSize: "12px",
  fontWeight: "700",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 12px",
  color: "#334e68",
  fontSize: "13px",
  whiteSpace: "nowrap",
};