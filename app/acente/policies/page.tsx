"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  role?: string;
  username?: string;
  agencyId?: string;
  agencyName?: string;
};

type AssistanceRequest = {
  id?: string;
  requestNo?: string;
  policyId?: string | number;
  policyNumber?: string;

  agencyId?: string;
  agencyName?: string;

  customerName?: string;
  customerPhone?: string;
  vehiclePlate?: string;

  assistanceType?: string;
  serviceType?: string;

  city?: string;
  district?: string;
  address?: string;

  status?: string;
  createdAt?: string;

  // Admin tarafında tutulabilir,
  // ancak acente ekranında gösterilmez.
  cost?: number;
  damagePrice?: number;
  serviceCost?: number;
};

type Policy = {
  id?: string;
  policyNumber?: string;

  customerName?: string;
  customerPhone?: string;
  customerIdentity?: string;

  vehiclePlate?: string;
  vehicleBrand?: string;
  vehicleModel?: string;

  startDate?: string;
  endDate?: string;

  premium?: number;
  price?: number;
  commission?: number;
  commissionRate?: number;

  agencyId?: string;
  agencyName?: string;

  createdAt?: string;
};

export default function AgencyPoliciesPage() {
  const router = useRouter();

  const [user, setUser] =
    useState<User | null>(null);

  const [policies, setPolicies] =
    useState<Policy[]>([]);

  const [assistanceRequests, setAssistanceRequests] =
    useState<AssistanceRequest[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    const savedUser =
      localStorage.getItem("poyraz_user");

    if (!savedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser =
        JSON.parse(savedUser) as User;

      if (parsedUser.role !== "acente") {
        router.push("/login");
        return;
      }

      setUser(parsedUser);

      loadPolicies(parsedUser);
      loadAssistanceRequests(parsedUser);
    } catch {
      router.push("/login");
    }
  }, [router]);

  function loadPolicies(currentUser: User) {
    try {
      const saved =
        localStorage.getItem(
          "poyraz_policies"
        );

      if (!saved) {
        setPolicies([]);
        return;
      }

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        setPolicies([]);
        return;
      }

      const agencyPolicies =
        parsed.filter(
          (policy: Policy) => {
            if (
              currentUser.agencyId &&
              policy.agencyId
            ) {
              return (
                String(policy.agencyId) ===
                String(currentUser.agencyId)
              );
            }

            if (
              currentUser.agencyName &&
              policy.agencyName
            ) {
              return (
                String(
                  policy.agencyName
                ).toLowerCase() ===
                String(
                  currentUser.agencyName
                ).toLowerCase()
              );
            }

            return false;
          }
        );

      setPolicies(agencyPolicies);
    } catch {
      setPolicies([]);
    }
  }

  function loadAssistanceRequests(
    currentUser: User
  ) {
    try {
      const saved =
        localStorage.getItem(
          "poyraz_assistance_requests"
        );

      if (!saved) {
        setAssistanceRequests([]);
        setLoading(false);
        return;
      }

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        setAssistanceRequests([]);
        setLoading(false);
        return;
      }

      const agencyRequests =
        parsed.filter(
          (request: AssistanceRequest) => {
            if (
              currentUser.agencyId &&
              request.agencyId
            ) {
              return (
                String(request.agencyId) ===
                String(currentUser.agencyId)
              );
            }

            if (
              currentUser.agencyName &&
              request.agencyName
            ) {
              return (
                String(
                  request.agencyName
                ).toLowerCase() ===
                String(
                  currentUser.agencyName
                ).toLowerCase()
              );
            }

            return false;
          }
        );

      setAssistanceRequests(
        agencyRequests
      );
    } catch {
      setAssistanceRequests([]);
    }

    setLoading(false);
  }

  function money(value: unknown) {
    const amount =
      Number(value) || 0;

    return (
      amount.toLocaleString(
        "tr-TR",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      ) + " TL"
    );
  }

  function date(value?: string) {
    if (!value) return "-";

    const parsed =
      new Date(value);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return value;
    }

    return parsed.toLocaleDateString(
      "tr-TR"
    );
  }

  function getServicesForPolicy(
    policy: Policy
  ) {
    const policyId =
      String(policy.id ?? "");

    const policyNumber =
      String(
        policy.policyNumber ?? ""
      );

    return assistanceRequests.filter(
      (request) => {
        const requestPolicyId =
          String(
            request.policyId ?? ""
          );

        const requestPolicyNumber =
          String(
            request.policyNumber ?? ""
          );

        const samePolicyId =
          policyId !== "" &&
          requestPolicyId !== "" &&
          policyId === requestPolicyId;

        const samePolicyNumber =
          policyNumber !== "" &&
          requestPolicyNumber !== "" &&
          policyNumber ===
            requestPolicyNumber;

        const sameCustomer =
          String(
            request.customerName ?? ""
          ).toLowerCase() ===
            String(
              policy.customerName ?? ""
            ).toLowerCase() &&
          String(
            request.vehiclePlate ?? ""
          ).toUpperCase() ===
            String(
              policy.vehiclePlate ?? ""
            ).toUpperCase();

        return (
          samePolicyId ||
          samePolicyNumber ||
          sameCustomer
        );
      }
    );
  }

  function getServiceName(
    request: AssistanceRequest
  ) {
    return (
      request.serviceType ||
      request.assistanceType ||
      "Asist Hizmeti"
    );
  }

  function getStatusLabel(
    status?: string
  ) {
    return status || "Bekliyor";
  }

  function statusStyle(
    status?: string
  ): React.CSSProperties {
    const current =
      status || "Bekliyor";

    if (current === "Tamamlandı") {
      return {
        background: "#ecfdf5",
        color: "#15803d",
      };
    }

    if (current === "Yolda") {
      return {
        background: "#fefce8",
        color: "#a16207",
      };
    }

    if (current === "Atandı") {
      return {
        background: "#eff6ff",
        color: "#1d4ed8",
      };
    }

    if (current === "İptal") {
      return {
        background: "#fef2f2",
        color: "#dc2626",
      };
    }

    return {
      background: "#fff7ed",
      color: "#c2410c",
    };
  }

  const filteredPolicies =
    policies.filter((policy) => {
      const text =
        search
          .trim()
          .toLowerCase();

      if (!text) return true;

      return (
        String(
          policy.policyNumber ?? ""
        )
          .toLowerCase()
          .includes(text) ||
        String(
          policy.customerName ?? ""
        )
          .toLowerCase()
          .includes(text) ||
        String(
          policy.customerPhone ?? ""
        )
          .toLowerCase()
          .includes(text) ||
        String(
          policy.vehiclePlate ?? ""
        )
          .toLowerCase()
          .includes(text)
      );
    });

  const totalPremium =
    policies.reduce(
      (sum, policy) =>
        sum +
        (Number(
          policy.premium ??
            policy.price
        ) || 0),
      0
    );

  const totalCommission =
    policies.reduce(
      (sum, policy) =>
        sum +
        (Number(
          policy.commission
        ) || 0),
      0
    );

  const poyrazTotal =
    totalPremium -
    totalCommission;

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
        paddingBottom: "40px",
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
            Poliçelerim ve Hizmet
            Hareketleri
          </div>
        </div>

        <button
          onClick={() =>
            router.push("/acente")
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
          ← Acente Paneli
        </button>
      </header>

      <div
        style={{
          maxWidth: "1500px",
          margin: "0 auto",
          padding: "30px",
        }}
      >
        {/* BAŞLIK */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: "15px",
            marginBottom: "25px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                color: "#102a43",
                fontSize: "30px",
              }}
            >
              📋 Poliçelerim
            </h1>

            <p
              style={{
                color: "#718096",
                marginTop: "8px",
              }}
            >
              {user.agencyName ||
                user.username}{" "}
              acentesine ait poliçeler
            </p>
          </div>

          <button
            onClick={() =>
              router.push(
                "/acente/policies/new"
              )
            }
            style={{
              background: "#0b2d4d",
              color: "white",
              border: "none",
              borderRadius: "9px",
              padding: "13px 18px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            + Yeni Poliçe
          </button>
        </div>

        {/* ÖZET */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "22px",
          }}
        >
          <SummaryCard
            title="Toplam Poliçe"
            value={policies.length.toLocaleString(
              "tr-TR"
            )}
            icon="📄"
          />

          <SummaryCard
            title="Toplam Satış"
            value={money(
              totalPremium
            )}
            icon="💰"
          />

          <SummaryCard
            title="Acente Komisyonu"
            value={money(
              totalCommission
            )}
            icon="🏆"
          />

          <SummaryCard
            title="Poyraz Asist"
            value={money(
              poyrazTotal
            )}
            icon="🏢"
          />
        </div>

        {/* ARAMA */}

        <div
          style={{
            background: "white",
            borderRadius: "14px",
            padding: "18px",
            marginBottom: "20px",
            boxShadow:
              "0 4px 18px rgba(0,0,0,0.06)",
          }}
        >
          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="🔎 Poliçe no, müşteri, telefon veya plaka ara..."
            style={{
              width: "100%",
              boxSizing:
                "border-box",
              padding:
                "13px 15px",
              border:
                "1px solid #d9e2ec",
              borderRadius: "9px",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>

        {/* TABLO */}

        <section
          style={{
            background: "white",
            borderRadius: "14px",
            padding: "20px",
            boxShadow:
              "0 4px 18px rgba(0,0,0,0.06)",
            overflowX: "auto",
          }}
        >
          {loading ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#718096",
              }}
            >
              Poliçeler yükleniyor...
            </div>
          ) : filteredPolicies.length ===
            0 ? (
            <div
              style={{
                padding:
                  "55px 20px",
                textAlign:
                  "center",
                color: "#718096",
              }}
            >
              <div
                style={{
                  fontSize: "45px",
                  marginBottom:
                    "12px",
                }}
              >
                📄
              </div>

              <h3
                style={{
                  margin:
                    "0 0 8px",
                  color:
                    "#334e68",
                }}
              >
                Poliçe bulunamadı
              </h3>

              <p
                style={{
                  margin: 0,
                  fontSize:
                    "13px",
                }}
              >
                Henüz poliçe
                oluşturulmamış veya
                arama kriterinize
                uygun poliçe
                bulunmuyor.
              </p>
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
                minWidth:
                  "1350px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background:
                      "#f5f7fa",
                    textAlign:
                      "left",
                  }}
                >
                  <th
                    style={thStyle}
                  >
                    Poliçe No
                  </th>

                  <th
                    style={thStyle}
                  >
                    Müşteri
                  </th>

                  <th
                    style={thStyle}
                  >
                    Telefon
                  </th>

                  <th
                    style={thStyle}
                  >
                    Plaka
                  </th>

                  <th
                    style={thStyle}
                  >
                    Prim
                  </th>

                  <th
                    style={thStyle}
                  >
                    Komisyon
                  </th>

                  <th
                    style={thStyle}
                  >
                    Poyraz Payı
                  </th>

                  <th
                    style={thStyle}
                  >
                    Başlangıç
                  </th>

                  <th
                    style={thStyle}
                  >
                    Bitiş
                  </th>

                  <th
                    style={thStyle}
                  >
                    Poliçe Hareketleri
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredPolicies.map(
                  (
                    policy,
                    index
                  ) => {
                    const premium =
                      Number(
                        policy.premium ??
                          policy.price
                      ) || 0;

                    const commission =
                      Number(
                        policy.commission
                      ) || 0;

                    const poyraz =
                      premium -
                      commission;

                    const services =
                      getServicesForPolicy(
                        policy
                      );

                    return (
                      <tr
                        key={
                          policy.id ??
                          index
                        }
                        style={{
                          borderBottom:
                            "1px solid #edf1f5",
                          verticalAlign:
                            "top",
                        }}
                      >
                        <td
                          style={
                            tdStyle
                          }
                        >
                          <strong>
                            {policy.policyNumber ??
                              "-"}
                          </strong>
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {policy.customerName ??
                            "-"}
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {policy.customerPhone ??
                            "-"}
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          <strong>
                            {policy.vehiclePlate ??
                              "-"}
                          </strong>
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {money(
                            premium
                          )}
                        </td>

                        <td
                          style={{
                            ...tdStyle,
                            color:
                              "#16803c",
                            fontWeight:
                              "700",
                          }}
                        >
                          {money(
                            commission
                          )}
                        </td>

                        <td
                          style={{
                            ...tdStyle,
                            fontWeight:
                              "700",
                          }}
                        >
                          {money(
                            poyraz
                          )}
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {date(
                            policy.startDate
                          )}
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {date(
                            policy.endDate
                          )}
                        </td>

                        {/* POLİÇE HAREKETLERİ */}
                        <td
                          style={{
                            ...tdStyle,
                            whiteSpace:
                              "normal",
                            minWidth:
                              "280px",
                          }}
                        >
                          {services.length ===
                          0 ? (
                            <div
                              style={{
                                color:
                                  "#94a3b8",
                                fontSize:
                                  "12px",
                              }}
                            >
                              Henüz hizmet
                              verilmedi.
                            </div>
                          ) : (
                            <div
                              style={{
                                display:
                                  "flex",
                                flexDirection:
                                  "column",
                                gap:
                                  "8px",
                              }}
                            >
                              {services
                                .slice()
                                .reverse()
                                .map(
                                  (
                                    service,
                                    serviceIndex
                                  ) => (
                                    <div
                                      key={
                                        service.id ??
                                        serviceIndex
                                      }
                                      style={{
                                        background:
                                          "#f8fafc",
                                        border:
                                          "1px solid #e2e8f0",
                                        borderRadius:
                                          "9px",
                                        padding:
                                          "9px 10px",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display:
                                            "flex",
                                          justifyContent:
                                            "space-between",
                                          alignItems:
                                            "center",
                                          gap:
                                            "8px",
                                        }}
                                      >
                                        <strong
                                          style={{
                                            color:
                                              "#0b2d4d",
                                            fontSize:
                                              "13px",
                                          }}
                                        >
                                          🚗{" "}
                                          {getServiceName(
                                            service
                                          )}
                                        </strong>

                                        <span
                                          style={{
                                            ...statusStyle(
                                              service.status
                                            ),
                                            padding:
                                              "4px 7px",
                                            borderRadius:
                                              "15px",
                                            fontSize:
                                              "10px",
                                            fontWeight:
                                              "700",
                                            whiteSpace:
                                              "nowrap",
                                          }}
                                        >
                                          {getStatusLabel(
                                            service.status
                                          )}
                                        </span>
                                      </div>

                                      <div
                                        style={{
                                          marginTop:
                                            "6px",
                                          color:
                                            "#64748b",
                                          fontSize:
                                            "11px",
                                        }}
                                      >
                                        {service.city ||
                                        service.district ? (
                                          <>
                                            📍{" "}
                                            {service.city ??
                                              "-"}
                                            {service.district
                                              ? ` / ${service.district}`
                                              : ""}
                                          </>
                                        ) : null}
                                      </div>

                                      {service.address ? (
                                        <div
                                          style={{
                                            marginTop:
                                              "3px",
                                            color:
                                              "#94a3b8",
                                            fontSize:
                                              "11px",
                                          }}
                                        >
                                          {service.address}
                                        </div>
                                      ) : null}

                                      {service.createdAt ? (
                                        <div
                                          style={{
                                            marginTop:
                                              "4px",
                                            color:
                                              "#94a3b8",
                                            fontSize:
                                              "10px",
                                          }}
                                        >
                                          {date(
                                            service.createdAt
                                          )}
                                        </div>
                                      ) : null}
                                    </div>
                                  )
                                )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          )}
        </section>

        {/* BİLGİ */}

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
            ℹ️ Poliçe Hareketleri:
          </strong>{" "}
          Acenteler kendi poliçelerine
          verilen hizmetleri görür.
          Örneğin{" "}
          <strong>
            Arıza, Lastik Değişimi,
            Akü Desteği, Çekici
          </strong>{" "}
          gibi hizmetler burada
          görüntülenir.
          <br />
          <br />
          <strong>
            🔒 Maliyet bilgileri bu
            ekranda gösterilmez.
          </strong>
        </div>
      </div>
    </main>
  );
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "14px",
        padding: "20px",
        boxShadow:
          "0 4px 18px rgba(0,0,0,0.06)",
        borderLeft:
          "5px solid #0b2d4d",
      }}
    >
      <div
        style={{
          fontSize: "25px",
          marginBottom: "8px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          fontSize: "12px",
          color: "#718096",
          marginBottom: "5px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "21px",
          fontWeight: "800",
          color: "#102a43",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function money(value: number) {
  return (
    value.toLocaleString(
      "tr-TR",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    ) + " TL"
  );
}

const thStyle: React.CSSProperties = {
  padding: "13px 12px",
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