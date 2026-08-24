"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  role?: string;
  username?: string;
  agencyId?: string;
  agencyName?: string;
  commissionRate?: number;
};

type Policy = {
  id?: string;
  policyNumber?: string;
  customerName?: string;
  customerPhone?: string;
  vehiclePlate?: string;
  premium?: number;
  price?: number;
  commission?: number;
  commissionRate?: number;
  agencyId?: string;
  agencyName?: string;
  createdAt?: string;
};

export default function AcenteDashboard() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("poyraz_user");

    if (!savedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser) as User;

      if (parsedUser.role !== "acente") {
        router.push("/login");
        return;
      }

      setUser(parsedUser);
      loadPolicies(parsedUser);
    } catch {
      router.push("/login");
    }
  }, [router]);

  function loadPolicies(currentUser: User) {
    try {
      const savedPolicies = localStorage.getItem("poyraz_policies");

      if (!savedPolicies) {
        setPolicies([]);
        setLoading(false);
        return;
      }

      const parsed = JSON.parse(savedPolicies);

      if (!Array.isArray(parsed)) {
        setPolicies([]);
        setLoading(false);
        return;
      }

      const agencyPolicies = parsed.filter((policy: Policy) => {
        if (currentUser.agencyId && policy.agencyId) {
          return (
            String(policy.agencyId) ===
            String(currentUser.agencyId)
          );
        }

        if (currentUser.agencyName && policy.agencyName) {
          return (
            String(policy.agencyName).toLowerCase() ===
            String(currentUser.agencyName).toLowerCase()
          );
        }

        return false;
      });

      setPolicies(agencyPolicies);
    } catch {
      setPolicies([]);
    }

    setLoading(false);
  }

  function money(value: unknown) {
    const amount = Number(value) || 0;

    return (
      amount.toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " TL"
    );
  }

  function logout() {
    localStorage.removeItem("poyraz_user");
    router.push("/login");
  }

  const totalPolicies = policies.length;

  const totalPremium = policies.reduce(
    (total, policy) =>
      total +
      (Number(policy.premium ?? policy.price) || 0),
    0
  );

  const totalCommission = policies.reduce(
    (total, policy) =>
      total + (Number(policy.commission) || 0),
    0
  );

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyPolicies = policies.filter((policy) => {
    if (!policy.createdAt) {
      return false;
    }

    const date = new Date(policy.createdAt);

    return (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  });

  const recentPolicies = [...policies]
    .reverse()
    .slice(0, 8);

  if (!user) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
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
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          background: "#0b2d4d",
          color: "white",
          padding: "18px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          boxShadow: "0 3px 12px rgba(0,0,0,0.12)",
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
            Acente Paneli
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: "700" }}>
              {user.agencyName || user.username}
            </div>

            <div
              style={{
                fontSize: "12px",
                opacity: 0.75,
                marginTop: "3px",
              }}
            >
              Komisyon: %{Number(user.commissionRate) || 35}
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
        <section
          style={{
            background:
              "linear-gradient(135deg,#0b2d4d,#17699e)",
            color: "white",
            borderRadius: "16px",
            padding: "30px",
            marginBottom: "25px",
            boxShadow: "0 8px 25px rgba(11,45,77,0.18)",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              opacity: 0.8,
              marginBottom: "8px",
            }}
          >
            HOŞ GELDİNİZ
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "30px",
            }}
          >
            {user.agencyName || user.username}
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              opacity: 0.85,
            }}
          >
            Poyraz Asist acente yönetim panelinize hoş geldiniz.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
            marginBottom: "25px",
          }}
        >
          <StatCard
            icon="📄"
            title="Toplam Poliçe"
            value={totalPolicies.toLocaleString("tr-TR")}
            description="Toplam poliçeniz"
          />

          <StatCard
            icon="📅"
            title="Bu Ay"
            value={monthlyPolicies.length.toLocaleString("tr-TR")}
            description="Bu ayki poliçeleriniz"
          />

          <StatCard
            icon="💰"
            title="Toplam Prim"
            value={money(totalPremium)}
            description="Toplam satış tutarı"
          />

          <StatCard
            icon="🏆"
            title="Toplam Komisyon"
            value={money(totalCommission)}
            description="Kazandığınız komisyon"
          />
        </section>

        <section
          style={{
            background: "white",
            borderRadius: "14px",
            padding: "25px",
            marginBottom: "25px",
            boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#102a43",
              fontSize: "20px",
            }}
          >
            ⚡ Hızlı İşlemler
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
            }}
          >
            <QuickButton
              icon="📄"
              title="Yeni Poliçe"
              onClick={() =>
                router.push("/acente/policies/new")
              }
            />

            <QuickButton
              icon="📋"
              title="Poliçelerim"
              onClick={() =>
                router.push("/acente/policies")
              }
            />

            <QuickButton
              icon="🚗"
              title="Asist Talebi"
              onClick={() =>
                router.push("/acente/assistance")
              }
            />

            <QuickButton
              icon="📊"
              title="Poliçe Hareketleri"
              onClick={() =>
                router.push("/acente/policy-movements")
              }
            />

            <QuickButton
              icon="👤"
              title="Hesabım"
              onClick={() =>
                router.push("/acente/account")
              }
            />
          </div>
        </section>

        <section
          style={{
            background: "white",
            borderRadius: "14px",
            padding: "25px",
            boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
            overflowX: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              gap: "15px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  color: "#102a43",
                  fontSize: "20px",
                }}
              >
                📋 Son Poliçeler
              </h2>

              <p
                style={{
                  color: "#718096",
                  fontSize: "13px",
                  margin: "6px 0 0",
                }}
              >
                Sadece size ait poliçeler
              </p>
            </div>

            <button
              onClick={() =>
                router.push("/acente/policies")
              }
              style={{
                border: "none",
                background: "#0b2d4d",
                color: "white",
                padding: "9px 14px",
                borderRadius: "7px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Tümünü Gör
            </button>
          </div>

          {loading ? (
            <div
              style={{
                padding: "30px 0",
                textAlign: "center",
                color: "#718096",
              }}
            >
              Poliçeler yükleniyor...
            </div>
          ) : recentPolicies.length === 0 ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                background: "#f7f9fc",
                borderRadius: "10px",
                color: "#718096",
              }}
            >
              <div
                style={{
                  fontSize: "35px",
                  marginBottom: "10px",
                }}
              >
                📄
              </div>

              <div
                style={{
                  fontWeight: "700",
                  color: "#52606d",
                  marginBottom: "6px",
                }}
              >
                Henüz poliçeniz bulunmuyor.
              </div>

              <div
                style={{
                  fontSize: "13px",
                }}
              >
                İlk poliçenizi oluşturmak için
                "Yeni Poliçe" butonunu kullanabilirsiniz.
              </div>
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "800px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f5f7fa",
                    textAlign: "left",
                  }}
                >
                  <th style={thStyle}>Poliçe No</th>
                  <th style={thStyle}>Müşteri</th>
                  <th style={thStyle}>Plaka</th>
                  <th style={thStyle}>Prim</th>
                  <th style={thStyle}>Komisyon</th>
                  <th style={thStyle}>Tarih</th>
                </tr>
              </thead>

              <tbody>
                {recentPolicies.map((policy, index) => {
                  const premium =
                    Number(
                      policy.premium ?? policy.price
                    ) || 0;

                  const commission =
                    Number(policy.commission) || 0;

                  return (
                    <tr
                      key={policy.id ?? index}
                      style={{
                        borderBottom:
                          "1px solid #edf1f5",
                      }}
                    >
                      <td style={tdStyle}>
                        <strong>
                          {policy.policyNumber ?? "-"}
                        </strong>
                      </td>

                      <td style={tdStyle}>
                        {policy.customerName ?? "-"}
                      </td>

                      <td style={tdStyle}>
                        <strong>
                          {policy.vehiclePlate ?? "-"}
                        </strong>
                      </td>

                      <td style={tdStyle}>
                        {money(premium)}
                      </td>

                      <td style={tdStyle}>
                        {money(commission)}
                      </td>

                      <td style={tdStyle}>
                        {policy.createdAt
                          ? new Date(
                              policy.createdAt
                            ).toLocaleDateString("tr-TR")
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: string;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "14px",
        padding: "22px",
        boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
        borderLeft: "5px solid #0b2d4d",
      }}
    >
      <div
        style={{
          fontSize: "27px",
          marginBottom: "10px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#718096",
          fontSize: "13px",
          marginBottom: "6px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#102a43",
          fontSize: "23px",
          fontWeight: "800",
          marginBottom: "6px",
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#9aa6b2",
          fontSize: "12px",
        }}
      >
        {description}
      </div>
    </div>
  );
}

function QuickButton({
  icon,
  title,
  onClick,
}: {
  icon: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "#f5f7fa",
        border: "1px solid #e1e7ee",
        borderRadius: "10px",
        padding: "17px 14px",
        cursor: "pointer",
        fontWeight: "700",
        color: "#17324d",
        fontSize: "14px",
        textAlign: "left",
      }}
    >
      <span
        style={{
          fontSize: "21px",
          marginRight: "9px",
        }}
      >
        {icon}
      </span>

      {title}
    </button>
  );
}

const thStyle: React.CSSProperties = {
  padding: "13px 12px",
  color: "#52606d",
  fontSize: "13px",
  fontWeight: "700",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 12px",
  color: "#334e68",
  fontSize: "13px",
};