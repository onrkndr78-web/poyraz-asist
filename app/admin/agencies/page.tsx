"use client";

import { useEffect, useState } from "react";
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

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  username: "",
  password: "",
  commissionRate: 35,
};

export default function AgenciesPage() {
  const router = useRouter();

  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("poyraz_user");

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

    loadAgencies();
  }, [router]);

  function loadAgencies() {
    try {
      const saved = localStorage.getItem("poyraz_agencies");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          const cleaned: Agency[] = parsed.map(
            (agency: Partial<Agency>, index: number) => ({
              id:
                String(
                  agency.id ??
                    `${Date.now()}-${index}`
                ),
              name: String(
                agency.name ?? ""
              ),
              phone: String(
                agency.phone ?? ""
              ),
              email: String(
                agency.email ?? ""
              ),
              username: String(
                agency.username ?? ""
              ),
              password: String(
                agency.password ?? ""
              ),
              commissionRate:
                Number(
                  agency.commissionRate
                ) || 35,
              active:
                agency.active !== false,
              createdAt: String(
                agency.createdAt ??
                  new Date().toISOString()
              ),
            })
          );

          setAgencies(cleaned);
          localStorage.setItem(
            "poyraz_agencies",
            JSON.stringify(cleaned)
          );
        }
      }
    } catch {
      setAgencies([]);
    }
  }

  function saveAgencies(data: Agency[]) {
    localStorage.setItem(
      "poyraz_agencies",
      JSON.stringify(data)
    );

    setAgencies(data);
  }

  function handleChange(
    field: keyof typeof emptyForm,
    value: string | number
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  function saveAgency() {
    if (!form.name.trim()) {
      alert("Acente adını giriniz.");
      return;
    }

    if (!form.username.trim()) {
      alert("Kullanıcı adını giriniz.");
      return;
    }

    if (!form.password.trim()) {
      alert("Şifreyi giriniz.");
      return;
    }

    const commissionRate =
      Number(form.commissionRate);

    if (
      Number.isNaN(commissionRate) ||
      commissionRate < 0 ||
      commissionRate > 100
    ) {
      alert(
        "Komisyon oranı 0 ile 100 arasında olmalıdır."
      );
      return;
    }

    if (editingId) {
      const updated = agencies.map(
        (agency) =>
          agency.id === editingId
            ? {
                ...agency,
                name: form.name.trim(),
                phone: form.phone.trim(),
                email: form.email.trim(),
                username:
                  form.username.trim(),
                password: form.password,
                commissionRate,
              }
            : agency
      );

      saveAgencies(updated);
    } else {
      const usernameExists = agencies.some(
        (agency) =>
          String(agency.username ?? "")
            .toLowerCase() ===
          form.username
            .trim()
            .toLowerCase()
      );

      if (usernameExists) {
        alert(
          "Bu kullanıcı adı zaten kullanılıyor."
        );
        return;
      }

      const newAgency: Agency = {
        id:
          Date.now().toString() +
          Math.random()
            .toString(36)
            .substring(2, 8),
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        username: form.username.trim(),
        password: form.password,
        commissionRate,
        active: true,
        createdAt:
          new Date().toISOString(),
      };

      saveAgencies([
        ...agencies,
        newAgency,
      ]);
    }

    resetForm();
  }

  function editAgency(agency: Agency) {
    setForm({
      name: String(agency.name ?? ""),
      phone: String(agency.phone ?? ""),
      email: String(agency.email ?? ""),
      username: String(
        agency.username ?? ""
      ),
      password: String(
        agency.password ?? ""
      ),
      commissionRate:
        Number(
          agency.commissionRate
        ) || 35,
    });

    setEditingId(agency.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function deleteAgency(id: string) {
    const agency = agencies.find(
      (item) => item.id === id
    );

    if (!agency) return;

    const confirmed = confirm(
      `"${agency.name}" acentesini silmek istediğinize emin misiniz?`
    );

    if (!confirmed) return;

    saveAgencies(
      agencies.filter(
        (item) => item.id !== id
      )
    );
  }

  function toggleAgency(id: string) {
    const updated = agencies.map(
      (agency) =>
        agency.id === id
          ? {
              ...agency,
              active: !agency.active,
            }
          : agency
    );

    saveAgencies(updated);
  }

  const filteredAgencies =
    agencies.filter((agency) => {
      const text = search
        .trim()
        .toLowerCase();

      const name = String(
        agency.name ?? ""
      ).toLowerCase();

      const username = String(
        agency.username ?? ""
      ).toLowerCase();

      const phone = String(
        agency.phone ?? ""
      ).toLowerCase();

      const email = String(
        agency.email ?? ""
      ).toLowerCase();

      return (
        name.includes(text) ||
        username.includes(text) ||
        phone.includes(text) ||
        email.includes(text)
      );
    });

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
          justifyContent:
            "space-between",
          alignItems: "center",
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
            Acente Yönetimi
          </div>
        </div>

        <button
          onClick={() =>
            router.push("/admin")
          }
          style={topButtonStyle}
        >
          ← Dashboard
        </button>
      </header>

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
            marginBottom: "25px",
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
              Acenteler
            </h1>

            <p
              style={{
                marginTop: "8px",
                color: "#6b7c93",
              }}
            >
              Poyraz Asist acentelerini
              yönetin.
            </p>
          </div>

          <button
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
              }
            }}
            style={primaryButtonStyle}
          >
            {showForm
              ? "✕ Kapat"
              : "+ Yeni Acente"}
          </button>
        </div>

        {showForm && (
          <section
            style={{
              background: "white",
              borderRadius: "14px",
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
              {editingId
                ? "Acente Düzenle"
                : "Yeni Acente Ekle"}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "18px",
              }}
            >
              <Input
                label="Acente Adı *"
                value={form.name}
                onChange={(value) =>
                  handleChange(
                    "name",
                    value
                  )
                }
                placeholder="Örn: GKN Kibar Sigorta"
              />

              <Input
                label="Telefon"
                value={form.phone}
                onChange={(value) =>
                  handleChange(
                    "phone",
                    value
                  )
                }
                placeholder="05XX XXX XX XX"
              />

              <Input
                label="E-posta"
                value={form.email}
                onChange={(value) =>
                  handleChange(
                    "email",
                    value
                  )
                }
                placeholder="info@acente.com"
                type="email"
              />

              <Input
                label="Kullanıcı Adı *"
                value={form.username}
                onChange={(value) =>
                  handleChange(
                    "username",
                    value
                  )
                }
                placeholder="acente01"
              />

              <Input
                label="Şifre *"
                value={form.password}
                onChange={(value) =>
                  handleChange(
                    "password",
                    value
                  )
                }
                placeholder="Şifre"
                type="password"
              />

              <Input
                label="Komisyon Oranı (%)"
                value={String(
                  form.commissionRate
                )}
                onChange={(value) =>
                  handleChange(
                    "commissionRate",
                    Number(value)
                  )
                }
                placeholder="35"
                type="number"
              />
            </div>

            <div
              style={{
                marginTop: "22px",
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                onClick={saveAgency}
                style={primaryButtonStyle}
              >
                {editingId
                  ? "💾 Güncelle"
                  : "💾 Acente Kaydet"}
              </button>

              <button
                onClick={resetForm}
                style={secondaryButtonStyle}
              >
                Vazgeç
              </button>
            </div>
          </section>
        )}

        <section
          style={{
            background: "white",
            borderRadius: "14px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow:
              "0 4px 18px rgba(0,0,0,0.06)",
          }}
        >
          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="🔎 Acente adı, kullanıcı adı, telefon veya e-posta ara..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "13px 15px",
              border:
                "1px solid #d9e2ec",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            marginBottom: "20px",
          }}
        >
          <SummaryCard
            title="Toplam Acente"
            value={agencies.length}
          />

          <SummaryCard
            title="Aktif Acente"
            value={
              agencies.filter(
                (agency) =>
                  agency.active
              ).length
            }
          />

          <SummaryCard
            title="Pasif Acente"
            value={
              agencies.filter(
                (agency) =>
                  !agency.active
              ).length
            }
          />
        </section>

        <section
          style={{
            background: "white",
            borderRadius: "14px",
            padding: "25px",
            boxShadow:
              "0 4px 18px rgba(0,0,0,0.06)",
            overflowX: "auto",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#102a43",
              fontSize: "20px",
            }}
          >
            📋 Acente Listesi
          </h2>

          {filteredAgencies.length ===
          0 ? (
            <div
              style={{
                padding: "45px 20px",
                textAlign: "center",
                background: "#f7f9fc",
                borderRadius: "10px",
                color: "#718096",
              }}
            >
              {agencies.length === 0
                ? "Henüz acente eklenmedi."
                : "Aramanıza uygun acente bulunamadı."}
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
                minWidth: "1000px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f5f7fa",
                    textAlign: "left",
                  }}
                >
                  <th style={thStyle}>
                    Acente
                  </th>

                  <th style={thStyle}>
                    İletişim
                  </th>

                  <th style={thStyle}>
                    Kullanıcı
                  </th>

                  <th style={thStyle}>
                    Komisyon
                  </th>

                  <th style={thStyle}>
                    Durum
                  </th>

                  <th
                    style={{
                      ...thStyle,
                      textAlign:
                        "right",
                    }}
                  >
                    İşlemler
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAgencies.map(
                  (agency) => (
                    <tr
                      key={agency.id}
                      style={{
                        borderBottom:
                          "1px solid #edf1f5",
                      }}
                    >
                      <td style={tdStyle}>
                        <div
                          style={{
                            fontWeight: "700",
                            color:
                              "#102a43",
                          }}
                        >
                          {String(
                            agency.name ??
                              "-"
                          )}
                        </div>

                        <div
                          style={{
                            fontSize: "12px",
                            color:
                              "#8a9aa9",
                            marginTop:
                              "4px",
                          }}
                        >
                          {String(
                            agency.email ??
                              "E-posta yok"
                          )}
                        </div>
                      </td>

                      <td style={tdStyle}>
                        {String(
                          agency.phone ??
                            "-"
                        )}
                      </td>

                      <td style={tdStyle}>
                        {String(
                          agency.username ??
                            "-"
                        )}
                      </td>

                      <td style={tdStyle}>
                        <strong>
                          %
                          {Number(
                            agency.commissionRate
                          ) || 0}
                        </strong>
                      </td>

                      <td style={tdStyle}>
                        <button
                          onClick={() =>
                            toggleAgency(
                              agency.id
                            )
                          }
                          style={{
                            border: "none",
                            borderRadius:
                              "20px",
                            padding:
                              "6px 12px",
                            cursor:
                              "pointer",
                            fontWeight:
                              "700",
                            fontSize:
                              "12px",
                            background:
                              agency.active
                                ? "#d9f7e8"
                                : "#fde2e2",
                            color:
                              agency.active
                                ? "#147d4f"
                                : "#c53030",
                          }}
                        >
                          {agency.active
                            ? "AKTİF"
                            : "PASİF"}
                        </button>
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          textAlign:
                            "right",
                        }}
                      >
                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "flex-end",
                            gap: "7px",
                          }}
                        >
                          <button
                            onClick={() =>
                              editAgency(
                                agency
                              )
                            }
                            style={
                              editButtonStyle
                            }
                          >
                            ✏️ Düzenle
                          </button>

                          <button
                            onClick={() =>
                              deleteAgency(
                                agency.id
                              )
                            }
                            style={
                              deleteButtonStyle
                            }
                          >
                            🗑️ Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "7px",
          color: "#334e68",
          fontSize: "13px",
          fontWeight: "700",
        }}
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "12px 13px",
          border:
            "1px solid #d9e2ec",
          borderRadius: "8px",
          fontSize: "14px",
          outline: "none",
        }}
      />
    </div>
  );
}

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow:
          "0 4px 18px rgba(0,0,0,0.05)",
      }}
    >
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
        {value.toLocaleString(
          "tr-TR"
        )}
      </div>
    </div>
  );
}

const topButtonStyle: React.CSSProperties = {
  background: "white",
  color: "#0b2d4d",
  border: "none",
  borderRadius: "8px",
  padding: "10px 16px",
  fontWeight: "700",
  cursor: "pointer",
};

const primaryButtonStyle: React.CSSProperties = {
  background: "#0b2d4d",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "11px 17px",
  fontWeight: "700",
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  background: "#edf2f7",
  color: "#334e68",
  border: "none",
  borderRadius: "8px",
  padding: "11px 17px",
  fontWeight: "700",
  cursor: "pointer",
};

const editButtonStyle: React.CSSProperties = {
  background: "#e8f1fb",
  color: "#1769aa",
  border: "none",
  borderRadius: "7px",
  padding: "8px 11px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "12px",
};

const deleteButtonStyle: React.CSSProperties = {
  background: "#fde8e8",
  color: "#c53030",
  border: "none",
  borderRadius: "7px",
  padding: "8px 11px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "12px",
};

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