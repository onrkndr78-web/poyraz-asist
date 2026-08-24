"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Policy = {
  id?: string | number;
  policyNumber?: string;
  policyNo?: string;
  agencyName?: string;
  agency?: string;
  customerName?: string;
  customer?: string;
  premium?: number;
  price?: number;
  commission?: number;
  poyraz?: number;
  createdAt?: string;
  date?: string;
  status?: string;
};

function money(value: unknown) {
  const number = Number(value) || 0;

  return (
    number.toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " TL"
  );
}

function premium(policy: Policy) {
  return (
    Number(
      policy.premium ??
        policy.price ??
        0
    ) || 0
  );
}

function commission(policy: Policy) {
  const price = premium(policy);

  if (
    policy.commission !==
    undefined
  ) {
    return (
      Number(
        policy.commission
      ) || 0
    );
  }

  return price * 0.35;
}

function poyraz(policy: Policy) {
  if (
    policy.poyraz !==
    undefined
  ) {
    return (
      Number(
        policy.poyraz
      ) || 0
    );
  }

  return (
    premium(policy) -
    commission(policy)
  );
}

function agencyName(policy: Policy) {
  return (
    String(
      policy.agencyName ??
        policy.agency ??
        "Bilinmeyen Acente"
    ).trim() ||
    "Bilinmeyen Acente"
  );
}

function policyNumber(policy: Policy) {
  return (
    String(
      policy.policyNumber ??
        policy.policyNo ??
        "-"
    ).trim() || "-"
  );
}

function customerName(policy: Policy) {
  return (
    String(
      policy.customerName ??
        policy.customer ??
        "-"
    ).trim() || "-"
  );
}

function policyDate(policy: Policy) {
  return (
    String(
      policy.createdAt ??
        policy.date ??
        ""
    ).trim()
  );
}

export default function FinancePage() {
  const router = useRouter();

  const [policies, setPolicies] =
    useState<Policy[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    const savedUser =
      localStorage.getItem(
        "poyraz_user"
      );

    if (!savedUser) {
      router.push("/login");
      return;
    }

    try {
      const user =
        JSON.parse(savedUser);

      if (
        user?.role !==
        "admin"
      ) {
        router.push("/login");
        return;
      }
    } catch {
      router.push("/login");
      return;
    }

    loadFinance();
  }, [router]);

  function loadFinance() {
    try {
      const saved =
        localStorage.getItem(
          "poyraz_policies"
        );

      if (!saved) {
        setPolicies([]);
        setLoading(false);
        return;
      }

      const parsed =
        JSON.parse(saved);

      if (
        Array.isArray(parsed)
      ) {
        setPolicies(
          parsed
        );
      } else {
        setPolicies([]);
      }
    } catch {
      setPolicies([]);
    }

    setLoading(false);
  }

  /*
   * TOPLAM FİNANS
   */

  const totalSales =
    policies.reduce(
      (sum, policy) =>
        sum +
        premium(policy),
      0
    );

  const totalCommission =
    policies.reduce(
      (sum, policy) =>
        sum +
        commission(policy),
      0
    );

  const totalPoyraz =
    policies.reduce(
      (sum, policy) =>
        sum +
        poyraz(policy),
      0
    );

  /*
   * BU AY
   */

  const now =
    new Date();

  const currentMonth =
    now.getMonth();

  const currentYear =
    now.getFullYear();

  const monthlyPolicies =
    policies.filter(
      (policy) => {
        const rawDate =
          policyDate(
            policy
          );

        if (!rawDate) {
          return false;
        }

        const date =
          new Date(
            rawDate
          );

        if (
          Number.isNaN(
            date.getTime()
          )
        ) {
          return false;
        }

        return (
          date.getMonth() ===
            currentMonth &&
          date.getFullYear() ===
            currentYear
        );
      }
    );

  const monthlySales =
    monthlyPolicies.reduce(
      (sum, policy) =>
        sum +
        premium(policy),
      0
    );

  const monthlyCommission =
    monthlyPolicies.reduce(
      (sum, policy) =>
        sum +
        commission(policy),
      0
    );

  const monthlyPoyraz =
    monthlyPolicies.reduce(
      (sum, policy) =>
        sum +
        poyraz(policy),
      0
    );

  /*
   * ARAMA
   */

  const filteredPolicies =
    policies.filter(
      (policy) => {
        const text =
          search
            .trim()
            .toLowerCase();

        if (!text) {
          return true;
        }

        return (
          policyNumber(
            policy
          )
            .toLowerCase()
            .includes(text) ||

          agencyName(
            policy
          )
            .toLowerCase()
            .includes(text) ||

          customerName(
            policy
          )
            .toLowerCase()
            .includes(text)
        );
      }
    );

  return (
    <main
      style={{
        minHeight:
          "100vh",
        background:
          "#f4f7fb",
        fontFamily:
          "Arial, sans-serif",
      }}
    >
      {/* HEADER */}

      <header
        style={{
          background:
            "#0b2d4d",
          color:
            "white",
          padding:
            "18px 30px",
          display:
            "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          boxShadow:
            "0 3px 12px rgba(0,0,0,0.12)",
        }}
      >
        <div>
          <div
            style={{
              fontSize:
                "24px",
              fontWeight:
                "800",
            }}
          >
            POYRAZ ASİST
          </div>

          <div
            style={{
              fontSize:
                "13px",
              opacity:
                0.8,
              marginTop:
                "3px",
            }}
          >
            Finans Yönetimi
          </div>
        </div>

        <button
          onClick={() =>
            router.push(
              "/admin"
            )
          }
          style={{
            background:
              "white",
            color:
              "#0b2d4d",
            border:
              "none",
            borderRadius:
              "8px",
            padding:
              "10px 17px",
            fontWeight:
              "700",
            cursor:
              "pointer",
          }}
        >
          ← Admin Paneli
        </button>
      </header>

      <div
        style={{
          maxWidth:
            "1400px",
          margin:
            "0 auto",
          padding:
            "30px",
        }}
      >
        {/* BAŞLIK */}

        <div
          style={{
            marginBottom:
              "25px",
          }}
        >
          <h1
            style={{
              margin: 0,
              color:
                "#102a43",
              fontSize:
                "30px",
            }}
          >
            💰 Finans
          </h1>

          <p
            style={{
              color:
                "#6b7c93",
              marginTop:
                "8px",
            }}
          >
            Poyraz Asist satış ve
            komisyon finans raporu
          </p>
        </div>

        {/* ANA KARTLAR */}

        <section
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(230px, 1fr))",
            gap:
              "20px",
            marginBottom:
              "25px",
          }}
        >
          <FinanceCard
            title="Toplam Satış"
            value={money(
              totalSales
            )}
            icon="💰"
          />

          <FinanceCard
            title="Acente Komisyonu"
            value={money(
              totalCommission
            )}
            icon="🤝"
            green
          />

          <FinanceCard
            title="Poyraz Asist"
            value={money(
              totalPoyraz
            )}
            icon="🏢"
            blue
          />

          <FinanceCard
            title="Poliçe Sayısı"
            value={policies.length.toLocaleString(
              "tr-TR"
            )}
            icon="📄"
          />
        </section>

        {/* BU AY */}

        <section
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(230px, 1fr))",
            gap:
              "20px",
            marginBottom:
              "25px",
          }}
        >
          <SmallCard
            title="Bu Ay Satış"
            value={money(
              monthlySales
            )}
          />

          <SmallCard
            title="Bu Ay Komisyon"
            value={money(
              monthlyCommission
            )}
          />

          <SmallCard
            title="Bu Ay Poyraz"
            value={money(
              monthlyPoyraz
            )}
          />

          <SmallCard
            title="Bu Ay Poliçe"
            value={monthlyPolicies.length.toLocaleString(
              "tr-TR"
            )}
          />
        </section>

        {/* KOMİSYON BİLGİSİ */}

        <div
          style={{
            background:
              "#eaf4ff",
            border:
              "1px solid #cfe5ff",
            borderRadius:
              "12px",
            padding:
              "18px 20px",
            marginBottom:
              "25px",
            color:
              "#1e40af",
          }}
        >
          <strong>
            💡 Komisyon Dağılımı
          </strong>

          <div
            style={{
              marginTop:
                "8px",
              display:
                "flex",
              gap:
                "25px",
              flexWrap:
                "wrap",
            }}
          >
            <span>
              🤝 Acente:{" "}
              <strong>
                %35
              </strong>
            </span>

            <span>
              🏢 Poyraz Asist:{" "}
              <strong>
                %65
              </strong>
            </span>
          </div>
        </div>

        {/* ARAMA */}

        <div
          style={{
            background:
              "white",
            padding:
              "20px",
            borderRadius:
              "14px",
            marginBottom:
              "20px",
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
            placeholder="🔎 Poliçe no, acente veya müşteri ara..."
            style={{
              width:
                "100%",
              boxSizing:
                "border-box",
              padding:
                "14px",
              border:
                "1px solid #dce3ea",
              borderRadius:
                "9px",
              fontSize:
                "14px",
              outline:
                "none",
            }}
          />
        </div>

        {/* FİNANS TABLOSU */}

        <div
          style={{
            background:
              "white",
            borderRadius:
              "14px",
            overflow:
              "hidden",
            boxShadow:
              "0 4px 18px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              padding:
                "22px",
              borderBottom:
                "1px solid #edf1f5",
            }}
          >
            <h2
              style={{
                margin: 0,
                color:
                  "#102a43",
              }}
            >
              📊 Finans Hareketleri
            </h2>

            <p
              style={{
                margin:
                  "7px 0 0",
                color:
                  "#718096",
                fontSize:
                  "13px",
              }}
            >
              Poliçe bazında satış,
              acente komisyonu ve
              Poyraz Asist payı
            </p>
          </div>

          {loading ? (
            <div
              style={{
                padding:
                  "40px",
                textAlign:
                  "center",
              }}
            >
              Finans verileri
              yükleniyor...
            </div>
          ) : filteredPolicies.length ===
            0 ? (
            <div
              style={{
                padding:
                  "50px",
                textAlign:
                  "center",
                color:
                  "#718096",
              }}
            >
              Henüz finans hareketi
              bulunmuyor.
            </div>
          ) : (
            <div
              style={{
                overflowX:
                  "auto",
              }}
            >
              <table
                style={{
                  width:
                    "100%",
                  borderCollapse:
                    "collapse",
                  minWidth:
                    "950px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background:
                        "#f5f7fa",
                    }}
                  >
                    <th
                      style={
                        thStyle
                      }
                    >
                      Poliçe No
                    </th>

                    <th
                      style={
                        thStyle
                      }
                    >
                      Acente
                    </th>

                    <th
                      style={
                        thStyle
                      }
                    >
                      Müşteri
                    </th>

                    <th
                      style={
                        thStyle
                      }
                    >
                      Satış
                    </th>

                    <th
                      style={
                        thStyle
                      }
                    >
                      Acente %35
                    </th>

                    <th
                      style={
                        thStyle
                      }
                    >
                      Poyraz %65
                    </th>

                    <th
                      style={
                        thStyle
                      }
                    >
                      Tarih
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPolicies.map(
                    (
                      policy,
                      index
                    ) => {
                      const date =
                        policyDate(
                          policy
                        );

                      let displayDate =
                        "-";

                      if (
                        date
                      ) {
                        const parsed =
                          new Date(
                            date
                          );

                        if (
                          !Number.isNaN(
                            parsed.getTime()
                          )
                        ) {
                          displayDate =
                            parsed.toLocaleDateString(
                              "tr-TR"
                            );
                        } else {
                          displayDate =
                            date;
                        }
                      }

                      return (
                        <tr
                          key={
                            policy.id ??
                            `${policyNumber(
                              policy
                            )}-${index}`
                          }
                          style={{
                            borderBottom:
                              "1px solid #edf1f5",
                          }}
                        >
                          <td
                            style={
                              tdStyle
                            }
                          >
                            <strong>
                              {policyNumber(
                                policy
                              )}
                            </strong>
                          </td>

                          <td
                            style={
                              tdStyle
                            }
                          >
                            {agencyName(
                              policy
                            )}
                          </td>

                          <td
                            style={
                              tdStyle
                            }
                          >
                            {customerName(
                              policy
                            )}
                          </td>

                          <td
                            style={
                              tdStyle
                            }
                          >
                            {money(
                              premium(
                                policy
                              )
                            )}
                          </td>

                          <td
                            style={{
                              ...tdStyle,
                              color:
                                "#15803d",
                              fontWeight:
                                "700",
                            }}
                          >
                            {money(
                              commission(
                                policy
                              )
                            )}
                          </td>

                          <td
                            style={{
                              ...tdStyle,
                              color:
                                "#0b2d4d",
                              fontWeight:
                                "700",
                            }}
                          >
                            {money(
                              poyraz(
                                policy
                              )
                            )}
                          </td>

                          <td
                            style={
                              tdStyle
                            }
                          >
                            {
                              displayDate
                            }
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ALT NOT */}

        <div
          style={{
            marginTop:
              "20px",
            padding:
              "15px 20px",
            background:
              "#fff8e6",
            borderRadius:
              "10px",
            color:
              "#8a5a00",
            fontSize:
              "13px",
          }}
        >
          <strong>
            ℹ️ Bilgi:
          </strong>{" "}
          Finans ekranındaki tüm rakamlar
          sistemde kayıtlı poliçelerden
          otomatik hesaplanmaktadır.
        </div>
      </div>
    </main>
  );
}

function FinanceCard({
  title,
  value,
  icon,
  green,
  blue,
}: {
  title: string;
  value: string;
  icon: string;
  green?: boolean;
  blue?: boolean;
}) {
  return (
    <div
      style={{
        background:
          "white",
        borderRadius:
          "14px",
        padding:
          "23px",
        boxShadow:
          "0 4px 18px rgba(0,0,0,0.06)",
        borderLeft:
          `5px solid ${
            green
              ? "#16a34a"
              : blue
              ? "#0b2d4d"
              : "#d97706"
          }`,
      }}
    >
      <div
        style={{
          fontSize:
            "28px",
          marginBottom:
            "12px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color:
            "#718096",
          fontSize:
            "14px",
          marginBottom:
            "7px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          color:
            "#102a43",
          fontSize:
            "25px",
          fontWeight:
            "800",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function SmallCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        background:
          "white",
        borderRadius:
          "12px",
        padding:
          "20px",
        boxShadow:
          "0 3px 14px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          color:
            "#718096",
          fontSize:
            "13px",
          marginBottom:
            "8px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          color:
            "#102a43",
          fontSize:
            "22px",
          fontWeight:
            "800",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties =
  {
    padding:
      "14px 12px",
    textAlign:
      "left",
    fontSize:
      "13px",
    color:
      "#52606d",
    whiteSpace:
      "nowrap",
  };

const tdStyle: React.CSSProperties =
  {
    padding:
      "14px 12px",
    fontSize:
      "13px",
    color:
      "#334e68",
    whiteSpace:
      "nowrap",
  };