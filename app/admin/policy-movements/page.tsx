"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Policy = {
  id?: string;
  policyNumber?: string;
  customerName?: string;
  customerPhone?: string;
  vehiclePlate?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  agencyId?: string;
  agencyName?: string;
};

type Movement = {
  id: string;
  policyId?: string;
  policyNumber?: string;
  agencyId?: string;
  agencyName?: string;
  customerName?: string;
  customerPhone?: string;
  vehiclePlate?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  serviceType: string;
  towTruck: string;
  serviceDate: string;
  cost: number;
  description: string;
  files: string[];
  createdAt: string;
};

const services = [
  "Arıza",
  "Çekici",
  "Lastik Değişimi",
  "Akü",
  "Yakıt",
  "Anahtar / Kilit",
  "Kaza",
  "Diğer",
];

export default function AdminPolicyMovementsPage() {
  const router = useRouter();

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);

  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [serviceType, setServiceType] = useState("Arıza");
  const [towTruck, setTowTruck] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

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

      const savedPolicies =
        localStorage.getItem("poyraz_policies");

      if (savedPolicies) {
        const data = JSON.parse(savedPolicies);

        if (Array.isArray(data)) {
          setPolicies(data);
        }
      }

      const savedMovements =
        localStorage.getItem("poyraz_policy_movements");

      if (savedMovements) {
        const data = JSON.parse(savedMovements);

        if (Array.isArray(data)) {
          setMovements(data);
        }
      }

      setServiceDate(
        new Date().toISOString().slice(0, 10)
      );
    } catch {
      router.push("/login");
    }
  }, [router]);

  const selectedPolicyData = policies.find(
    (policy) =>
      String(policy.id) === String(selectedPolicy)
  );

  function handlePhotoChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = event.target.files;

    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();

      reader.onload = () => {
        const result = String(reader.result || "");

        setPhotos((old) => [...old, result]);
      };

      reader.readAsDataURL(file);
    });

    event.target.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((old) =>
      old.filter((_, i) => i !== index)
    );
  }

  function saveMovement() {
    setMessage("");

    if (!selectedPolicyData) {
      setMessage("Lütfen poliçe seçin.");
      return;
    }

    if (!serviceType) {
      setMessage("Lütfen hizmet seçin.");
      return;
    }

    if (!serviceDate) {
      setMessage("Hizmet tarihini girin.");
      return;
    }

    const numericCost =
      cost.trim() === "" ? 0 : Number(cost);

    if (Number.isNaN(numericCost)) {
      setMessage("Maliyet rakam olarak girilmelidir.");
      return;
    }

    const newMovement: Movement = {
      id:
        "movement-" +
        Date.now() +
        "-" +
        Math.floor(Math.random() * 100000),

      policyId: selectedPolicyData.id,
      policyNumber: selectedPolicyData.policyNumber,

      agencyId: selectedPolicyData.agencyId,
      agencyName: selectedPolicyData.agencyName,

      customerName: selectedPolicyData.customerName,
      customerPhone: selectedPolicyData.customerPhone,

      vehiclePlate: selectedPolicyData.vehiclePlate,
      vehicleBrand: selectedPolicyData.vehicleBrand,
      vehicleModel: selectedPolicyData.vehicleModel,

      serviceType,

      towTruck: towTruck.trim(),

      serviceDate,

      cost: numericCost,

      description: description.trim(),

      files: photos,

      createdAt: new Date().toISOString(),
    };

    const updated = [
      ...movements,
      newMovement,
    ];

    try {
      localStorage.setItem(
        "poyraz_policy_movements",
        JSON.stringify(updated)
      );

      setMovements(updated);

      setSelectedPolicy("");
      setServiceType("Arıza");
      setTowTruck("");
      setCost("");
      setDescription("");
      setPhotos([]);

      setServiceDate(
        new Date().toISOString().slice(0, 10)
      );

      setMessage(
        "✅ Poliçe hareketi kaydedildi."
      );
    } catch {
      setMessage(
        "❌ Kayıt sırasında hata oluştu. Fotoğraf boyutu fazla olabilir."
      );
    }
  }

  function deleteMovement(id: string) {
    if (
      !window.confirm(
        "Bu poliçe hareketini silmek istediğinize emin misiniz?"
      )
    ) {
      return;
    }

    const updated = movements.filter(
      (movement) => movement.id !== id
    );

    setMovements(updated);

    localStorage.setItem(
      "poyraz_policy_movements",
      JSON.stringify(updated)
    );
  }

  function money(value: number) {
    return (
      Number(value || 0).toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " TL"
    );
  }

  function formatDate(value?: string) {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("tr-TR");
  }

  const filteredMovements = movements.filter(
    (movement) => {
      const text = search.trim().toLowerCase();

      if (!text) return true;

      return (
        String(movement.policyNumber || "")
          .toLowerCase()
          .includes(text) ||
        String(movement.agencyName || "")
          .toLowerCase()
          .includes(text) ||
        String(movement.customerName || "")
          .toLowerCase()
          .includes(text) ||
        String(movement.customerPhone || "")
          .toLowerCase()
          .includes(text) ||
        String(movement.vehiclePlate || "")
          .toLowerCase()
          .includes(text) ||
        String(movement.serviceType || "")
          .toLowerCase()
          .includes(text) ||
        String(movement.towTruck || "")
          .toLowerCase()
          .includes(text)
      );
    }
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        fontFamily: "Arial, sans-serif",
        paddingBottom: "60px",
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
            Admin • Poliçe Hareketleri
          </div>
        </div>

        <button
          onClick={() => router.push("/admin")}
          style={buttonSecondary}
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
        <h1
          style={{
            margin: "0 0 8px",
            color: "#102a43",
            fontSize: "30px",
          }}
        >
          📋 Poliçe Hareketleri
        </h1>

        <p
          style={{
            margin: "0 0 25px",
            color: "#718096",
          }}
        >
          Poliçelere verilen asist hizmetlerini
          buradan kaydedebilirsiniz.
        </p>

        {/* YENİ KAYIT */}
        <section style={cardStyle}>
          <h2 style={sectionTitle}>
            ➕ Yeni Hizmet Kaydı
          </h2>

          <div style={gridStyle}>
            <Field label="Poliçe">
              <select
                value={selectedPolicy}
                onChange={(e) =>
                  setSelectedPolicy(e.target.value)
                }
                style={inputStyle}
              >
                <option value="">
                  Poliçe seçin
                </option>

                {policies.map((policy, index) => (
                  <option
                    key={policy.id || index}
                    value={policy.id || ""}
                  >
                    {policy.policyNumber || "-"} -
                    {" "}
                    {policy.customerName || "-"} -
                    {" "}
                    {policy.vehiclePlate || "-"}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Verilen Hizmet">
              <select
                value={serviceType}
                onChange={(e) =>
                  setServiceType(e.target.value)
                }
                style={inputStyle}
              >
                {services.map((service) => (
                  <option
                    key={service}
                    value={service}
                  >
                    {service}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Hizmet Tarihi">
              <input
                type="date"
                value={serviceDate}
                onChange={(e) =>
                  setServiceDate(e.target.value)
                }
                style={inputStyle}
              />
            </Field>

            <Field label="Çekici / Servis">
              <input
                value={towTruck}
                onChange={(e) =>
                  setTowTruck(e.target.value)
                }
                placeholder="Örn: ABC Çekici"
                style={inputStyle}
              />
            </Field>

            {/* MALİYET */}
            <Field label="Maliyet (Sadece Admin)">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={cost}
                  onChange={(e) =>
                    setCost(e.target.value)
                  }
                  placeholder="Örn: 2500"
                  style={{
                    ...inputStyle,
                    border:
                      "2px solid #dc2626",
                    background: "#fffafa",
                  }}
                />

                <span
                  style={{
                    fontWeight: "700",
                    color: "#dc2626",
                  }}
                >
                  TL
                </span>
              </div>
            </Field>

            <Field label="Açıklama">
              <input
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Hizmet açıklaması"
                style={inputStyle}
              />
            </Field>
          </div>

          {selectedPolicyData && (
            <div
              style={{
                marginTop: "18px",
                background: "#f5f7fa",
                borderRadius: "10px",
                padding: "16px",
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "15px",
              }}
            >
              <Info
                title="Acente"
                value={
                  selectedPolicyData.agencyName || "-"
                }
              />

              <Info
                title="Müşteri"
                value={
                  selectedPolicyData.customerName || "-"
                }
              />

              <Info
                title="Telefon"
                value={
                  selectedPolicyData.customerPhone || "-"
                }
              />

              <Info
                title="Plaka"
                value={
                  selectedPolicyData.vehiclePlate || "-"
                }
              />

              <Info
                title="Araç"
                value={
                  [
                    selectedPolicyData.vehicleBrand,
                    selectedPolicyData.vehicleModel,
                  ]
                    .filter(Boolean)
                    .join(" ") || "-"
                }
              />
            </div>
          )}

          <div
            style={{
              marginTop: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                fontWeight: "700",
                color: "#334e68",
                fontSize: "13px",
                marginBottom: "8px",
              }}
            >
              📷 Araç / Hizmet Fotoğrafları
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border:
                  "1px dashed #9fb3c8",
                borderRadius: "9px",
                background: "#f8fafc",
              }}
            />

            {photos.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: "12px",
                  marginTop: "15px",
                }}
              >
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                    }}
                  >
                    <img
                      src={photo}
                      alt="Hizmet fotoğrafı"
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />

                    <button
                      onClick={() =>
                        removePhoto(index)
                      }
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        width: "28px",
                        height: "28px",
                        border: "none",
                        borderRadius: "50%",
                        background: "#dc2626",
                        color: "white",
                        fontWeight: "800",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {message && (
            <div
              style={{
                marginTop: "18px",
                padding: "12px 15px",
                borderRadius: "8px",
                background:
                  message.includes("✅")
                    ? "#ecfdf5"
                    : "#fef2f2",
                color:
                  message.includes("✅")
                    ? "#15803d"
                    : "#dc2626",
                fontWeight: "700",
                fontSize: "13px",
              }}
            >
              {message}
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <button
              onClick={saveMovement}
              style={{
                background: "#0b2d4d",
                color: "white",
                border: "none",
                borderRadius: "9px",
                padding: "13px 24px",
                fontWeight: "800",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              💾 Hareketi Kaydet
            </button>
          </div>
        </section>

        {/* ARAMA */}
        <section
          style={{
            ...cardStyle,
            padding: "18px",
          }}
        >
          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="🔎 Poliçe no, acente, müşteri, telefon, plaka, hizmet veya çekici ara..."
            style={inputStyle}
          />
        </section>

        {/* LİSTE */}
        <section
          style={{
            ...cardStyle,
            padding: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "22px",
              borderBottom:
                "1px solid #edf1f5",
            }}
          >
            <h2 style={sectionTitle}>
              📋 Poliçe Aktivite Listesi
            </h2>

            <div
              style={{
                color: "#718096",
                fontSize: "13px",
              }}
            >
              {filteredMovements.length} kayıt
            </div>
          </div>

          {filteredMovements.length === 0 ? (
            <div
              style={{
                padding: "60px",
                textAlign: "center",
                color: "#718096",
              }}
            >
              Henüz poliçe hareketi bulunmuyor.
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
                  borderCollapse: "collapse",
                  minWidth: "1500px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#f5f7fa",
                    }}
                  >
                    <th style={thStyle}>
                      Poliçe No
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
                      Verilen Hizmet
                    </th>

                    <th style={thStyle}>
                      Çekici / Servis
                    </th>

                    <th style={thStyle}>
                      Hizmet Tarihi
                    </th>

                    <th
                      style={{
                        ...thStyle,
                        color: "#dc2626",
                      }}
                    >
                      Maliyet
                    </th>

                    <th style={thStyle}>
                      Dosyalar
                    </th>

                    <th style={thStyle}>
                      Kayıt Tarihi
                    </th>

                    <th style={thStyle}>
                      İşlem
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {[...filteredMovements]
                    .reverse()
                    .map((movement) => (
                      <tr
                        key={movement.id}
                        style={{
                          borderBottom:
                            "1px solid #edf1f5",
                        }}
                      >
                        <td style={tdStyle}>
                          <strong>
                            {movement.policyNumber ||
                              "-"}
                          </strong>
                        </td>

                        <td style={tdStyle}>
                          {movement.agencyName ||
                            "-"}
                        </td>

                        <td style={tdStyle}>
                          {movement.customerName ||
                            "-"}
                        </td>

                        <td style={tdStyle}>
                          {movement.customerPhone ||
                            "-"}
                        </td>

                        <td style={tdStyle}>
                          <strong>
                            {movement.vehiclePlate ||
                              "-"}
                          </strong>
                        </td>

                        <td style={tdStyle}>
                          <span
                            style={{
                              background: "#eaf4ff",
                              color: "#0b2d4d",
                              padding:
                                "6px 10px",
                              borderRadius:
                                "20px",
                              fontWeight: "700",
                              fontSize: "12px",
                            }}
                          >
                            {movement.serviceType}
                          </span>
                        </td>

                        <td style={tdStyle}>
                          {movement.towTruck ||
                            "-"}
                        </td>

                        <td style={tdStyle}>
                          {formatDate(
                            movement.serviceDate
                          )}
                        </td>

                        <td
                          style={{
                            ...tdStyle,
                            color: "#dc2626",
                            fontWeight: "800",
                          }}
                        >
                          {money(
                            movement.cost
                          )}
                        </td>

                        <td style={tdStyle}>
                          {movement.files.length >
                          0 ? (
                            <div
                              style={{
                                display: "flex",
                                gap: "5px",
                              }}
                            >
                              {movement.files
                                .slice(0, 4)
                                .map(
                                  (
                                    file,
                                    index
                                  ) => (
                                    <a
                                      key={
                                        index
                                      }
                                      href={
                                        file
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <img
                                        src={
                                          file
                                        }
                                        alt="Dosya"
                                        style={{
                                          width:
                                            "45px",
                                          height:
                                            "45px",
                                          objectFit:
                                            "cover",
                                          borderRadius:
                                            "6px",
                                        }}
                                      />
                                    </a>
                                  )
                                )}
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td style={tdStyle}>
                          {formatDate(
                            movement.createdAt
                          )}
                        </td>

                        <td style={tdStyle}>
                          <button
                            onClick={() =>
                              deleteMovement(
                                movement.id
                              )
                            }
                            style={{
                              background:
                                "#dc2626",
                              color: "white",
                              border: "none",
                              borderRadius:
                                "7px",
                              padding:
                                "8px 11px",
                              cursor:
                                "pointer",
                              fontWeight:
                                "700",
                            }}
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "13px",
          fontWeight: "700",
          color: "#334e68",
          marginBottom: "7px",
        }}
      >
        {label}
      </label>

      {children}
    </div>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: "11px",
          color: "#718096",
          marginBottom: "4px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "13px",
          color: "#102a43",
          fontWeight: "700",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "white",
  borderRadius: "14px",
  padding: "25px",
  marginBottom: "20px",
  boxShadow:
    "0 4px 18px rgba(0,0,0,0.06)",
};

const sectionTitle: React.CSSProperties = {
  margin: "0 0 18px",
  color: "#102a43",
  fontSize: "20px",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "16px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 13px",
  border: "1px solid #d9e2ec",
  borderRadius: "8px",
  fontSize: "14px",
  outline: "none",
  background: "white",
};

const buttonSecondary: React.CSSProperties = {
  background: "white",
  color: "#0b2d4d",
  border: "none",
  borderRadius: "8px",
  padding: "10px 16px",
  fontWeight: "700",
  cursor: "pointer",
};

const thStyle: React.CSSProperties = {
  padding: "14px 12px",
  color: "#52606d",
  fontSize: "12px",
  fontWeight: "700",
  whiteSpace: "nowrap",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 12px",
  color: "#334e68",
  fontSize: "13px",
  whiteSpace: "nowrap",
};