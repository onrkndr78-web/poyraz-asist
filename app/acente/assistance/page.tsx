"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  role?: string;
  username?: string;
  agencyId?: string;
  agencyName?: string;
};

type Policy = {
  id?: string;
  policyNumber?: string;
  customerName?: string;
  customerPhone?: string;
  vehiclePlate?: string;
  premium?: number;
  price?: number;
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

  city?: string;
  district?: string;
  address?: string;

  description?: string;
  priority?: string;
  status?: string;

  cost?: number;
  damageCost?: number;

  createdAt?: string;
};

const SERVICE_OPTIONS = [
  "Arıza",
  "Lastik Değişimi",
  "Akü",
  "Çekici",
  "Yakıt",
  "Kaza",
  "Anahtar",
  "Diğer",
];

const STATUS_OPTIONS = [
  "Bekliyor",
  "Atandı",
  "Yolda",
  "Tamamlandı",
];

export default function AcenteAssistancePage() {
  const router = useRouter();

  const [user, setUser] =
    useState<User | null>(null);

  const [policies, setPolicies] =
    useState<Policy[]>([]);

  const [requests, setRequests] =
    useState<AssistanceRequest[]>([]);

  const [selectedPolicy, setSelectedPolicy] =
    useState<Policy | null>(null);

  const [showNewRequest, setShowNewRequest] =
    useState(false);

  const [assistanceType, setAssistanceType] =
    useState("Arıza");

  const [city, setCity] =
    useState("");

  const [district, setDistrict] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState("Normal");

  const [saving, setSaving] =
    useState(false);

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
      loadRequests(parsedUser);
    } catch {
      router.push("/login");
    }
  }, [router]);

  function safeText(value: unknown) {
    return String(value ?? "");
  }

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
                String(
                  policy.agencyId
                ) ===
                String(
                  currentUser.agencyId
                )
              );
            }

            if (
              currentUser.agencyName &&
              policy.agencyName
            ) {
              return (
                safeText(
                  policy.agencyName
                ).toLowerCase() ===
                safeText(
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

  function loadRequests(currentUser: User) {
    try {
      const saved =
        localStorage.getItem(
          "poyraz_assistance_requests"
        );

      if (!saved) {
        setRequests([]);
        return;
      }

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        setRequests([]);
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
                String(
                  request.agencyId
                ) ===
                String(
                  currentUser.agencyId
                )
              );
            }

            if (
              currentUser.agencyName &&
              request.agencyName
            ) {
              return (
                safeText(
                  request.agencyName
                ).toLowerCase() ===
                safeText(
                  currentUser.agencyName
                ).toLowerCase()
              );
            }

            return false;
          }
        );

      setRequests(agencyRequests);
    } catch {
      setRequests([]);
    }
  }

  function getPolicyRequests(
    policy: Policy
  ) {
    return requests.filter(
      (request) => {
        const samePolicyId =
          policy.id &&
          request.policyId &&
          String(policy.id) ===
            String(request.policyId);

        const samePolicyNumber =
          policy.policyNumber &&
          request.policyNumber &&
          String(
            policy.policyNumber
          ).toLowerCase() ===
            String(
              request.policyNumber
            ).toLowerCase();

        return (
          samePolicyId ||
          samePolicyNumber
        );
      }
    );
  }

  function selectPolicy(policy: Policy) {
    setSelectedPolicy(policy);
    setShowNewRequest(false);
  }

  function openNewRequest() {
    if (!selectedPolicy) {
      alert(
        "Lütfen önce bir poliçe seçin."
      );
      return;
    }

    setShowNewRequest(true);
  }

  function createRequest() {
    if (!user || !selectedPolicy) {
      return;
    }

    if (!city.trim()) {
      alert("Lütfen il bilgisini girin.");
      return;
    }

    if (!district.trim()) {
      alert(
        "Lütfen ilçe bilgisini girin."
      );
      return;
    }

    if (!address.trim()) {
      alert(
        "Lütfen olay/adres bilgisini girin."
      );
      return;
    }

    setSaving(true);

    try {
      const saved =
        localStorage.getItem(
          "poyraz_assistance_requests"
        );

      let allRequests: AssistanceRequest[] =
        [];

      if (saved) {
        try {
          const parsed = JSON.parse(saved);

          if (Array.isArray(parsed)) {
            allRequests = parsed;
          }
        } catch {
          allRequests = [];
        }
      }

      const newRequestNo =
        "AS-" +
        new Date()
          .getTime()
          .toString()
          .slice(-8);

      const newRequest: AssistanceRequest =
        {
          id:
            Date.now().toString(),

          requestNo:
            newRequestNo,

          policyId:
            selectedPolicy.id,

          policyNumber:
            selectedPolicy.policyNumber,

          agencyId:
            user.agencyId,

          agencyName:
            user.agencyName ||
            user.username,

          customerName:
            selectedPolicy.customerName,

          customerPhone:
            selectedPolicy.customerPhone,

          vehiclePlate:
            selectedPolicy.vehiclePlate,

          assistanceType:
            assistanceType,

          city:
            city.trim(),

          district:
            district.trim(),

          address:
            address.trim(),

          description:
            description.trim(),

          priority:
            priority,

          status:
            "Bekliyor",

          cost: 0,

          damageCost: 0,

          createdAt:
            new Date().toISOString(),
        };

      const updated = [
        ...allRequests,
        newRequest,
      ];

      localStorage.setItem(
        "poyraz_assistance_requests",
        JSON.stringify(updated)
      );

      setRequests(
        updated.filter(
          (request) => {
            if (
              user.agencyId &&
              request.agencyId
            ) {
              return (
                String(
                  request.agencyId
                ) ===
                String(
                  user.agencyId
                )
              );
            }

            return (
              safeText(
                request.agencyName
              ).toLowerCase() ===
              safeText(
                user.agencyName ||
                  user.username
              ).toLowerCase()
            );
          }
        )
      );

      setCity("");
      setDistrict("");
      setAddress("");
      setDescription("");
      setPriority("Normal");
      setAssistanceType("Arıza");
      setShowNewRequest(false);

      alert(
        "Asist talebi başarıyla oluşturuldu."
      );
    } catch {
      alert(
        "Talep oluşturulurken bir hata oluştu."
      );
    }

    setSaving(false);
  }

  function formatDate(value: unknown) {
    if (!value) return "-";

    const date = new Date(
      String(value)
    );

    if (isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleString(
      "tr-TR"
    );
  }

  function statusStyle(status: string) {
    if (status === "Atandı") {
      return {
        background: "#eff6ff",
        color: "#1d4ed8",
      };
    }

    if (status === "Yolda") {
      return {
        background: "#fefce8",
        color: "#a16207",
      };
    }

    if (status === "Tamamlandı") {
      return {
        background: "#ecfdf5",
        color: "#15803d",
      };
    }

    return {
      background: "#fff7ed",
      color: "#c2410c",
    };
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
        paddingBottom: "50px",
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
            Poliçe Hareketleri &
            Asist
          </div>
        </div>

        <button
          onClick={() =>
            router.push(
              "/acente"
            )
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
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "30px",
        }}
      >
        {/* BAŞLIK */}

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
            📋 Poliçe Hareketleri
          </h1>

          <p
            style={{
              color: "#718096",
              marginTop: "8px",
            }}
          >
            Poliçelerinize verilen
            asist hizmetlerini buradan
            takip edebilirsiniz.
          </p>
        </div>

        {/* POLİÇELER */}

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
              fontSize: "20px",
            }}
          >
            📄 Poliçelerim
          </h2>

          {policies.length === 0 ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                background: "#f7f9fc",
                borderRadius: "10px",
                color: "#718096",
              }}
            >
              Henüz poliçeniz
              bulunmuyor.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "15px",
              }}
            >
              {policies.map(
                (policy, index) => {
                  const movements =
                    getPolicyRequests(
                      policy
                    );

                  const selected =
                    selectedPolicy?.id &&
                    policy.id &&
                    String(
                      selectedPolicy.id
                    ) ===
                      String(policy.id);

                  return (
                    <button
                      key={
                        policy.id ||
                        index
                      }
                      onClick={() =>
                        selectPolicy(
                          policy
                        )
                      }
                      style={{
                        textAlign: "left",
                        background:
                          selected
                            ? "#eaf4ff"
                            : "white",
                        border:
                          selected
                            ? "2px solid #17699e"
                            : "1px solid #e1e7ee",
                        borderRadius:
                          "12px",
                        padding: "18px",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          fontSize:
                            "16px",
                          fontWeight:
                            "800",
                          color:
                            "#0b2d4d",
                          marginBottom:
                            "8px",
                        }}
                      >
                        {policy.policyNumber ||
                          "Poliçe No Yok"}
                      </div>

                      <div
                        style={{
                          color:
                            "#334e68",
                          fontWeight:
                            "700",
                        }}
                      >
                        {policy.customerName ||
                          "-"}
                      </div>

                      <div
                        style={{
                          color:
                            "#718096",
                          fontSize:
                            "13px",
                          marginTop:
                            "5px",
                        }}
                      >
                        🚗{" "}
                        {policy.vehiclePlate ||
                          "-"}
                      </div>

                      <div
                        style={{
                          marginTop:
                            "12px",
                          color:
                            "#17699e",
                          fontSize:
                            "13px",
                          fontWeight:
                            "700",
                        }}
                      >
                        {movements.length}{" "}
                        asist hareketi
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* SEÇİLEN POLİÇE */}

        {selectedPolicy && (
          <>
            <section
              style={{
                background:
                  "white",
                borderRadius:
                  "14px",
                padding:
                  "25px",
                marginBottom:
                  "25px",
                boxShadow:
                  "0 4px 18px rgba(0,0,0,0.06)",
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
                    "15px",
                  flexWrap:
                    "wrap",
                  marginBottom:
                    "20px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize:
                        "13px",
                      color:
                        "#718096",
                    }}
                  >
                    Seçilen Poliçe
                  </div>

                  <h2
                    style={{
                      margin:
                        "5px 0",
                      color:
                        "#102a43",
                    }}
                  >
                    {selectedPolicy.policyNumber ||
                      "-"}
                  </h2>

                  <div
                    style={{
                      color:
                        "#52606d",
                    }}
                  >
                    {
                      selectedPolicy.customerName
                    }{" "}
                    •{" "}
                    {
                      selectedPolicy.vehiclePlate
                    }
                  </div>
                </div>

                <button
                  onClick={
                    openNewRequest
                  }
                  style={{
                    background:
                      "#0b2d4d",
                    color:
                      "white",
                    border:
                      "none",
                    borderRadius:
                      "8px",
                    padding:
                      "12px 18px",
                    fontWeight:
                      "700",
                    cursor:
                      "pointer",
                  }}
                >
                  🚗 Yeni Asist Talebi
                </button>
              </div>

              {/* HAREKETLER */}

              <h3
                style={{
                  color:
                    "#102a43",
                  marginBottom:
                    "15px",
                }}
              >
                🔄 Poliçe Hareketleri
              </h3>

              {getPolicyRequests(
                selectedPolicy
              ).length === 0 ? (
                <div
                  style={{
                    padding:
                      "35px",
                    background:
                      "#f7f9fc",
                    borderRadius:
                      "10px",
                    textAlign:
                      "center",
                    color:
                      "#718096",
                  }}
                >
                  Bu poliçeye ait
                  henüz asist hizmeti
                  bulunmuyor.
                </div>
              ) : (
                <div
                  style={{
                    display:
                      "flex",
                    flexDirection:
                      "column",
                    gap:
                      "12px",
                  }}
                >
                  {getPolicyRequests(
                    selectedPolicy
                  )
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

                        const style =
                          statusStyle(
                            status
                          );

                        return (
                          <div
                            key={
                              request.id ||
                              index
                            }
                            style={{
                              border:
                                "1px solid #e1e7ee",
                              borderRadius:
                                "10px",
                              padding:
                                "18px",
                              background:
                                "white",
                            }}
                          >
                            <div
                              style={{
                                display:
                                  "grid",
                                gridTemplateColumns:
                                  "repeat(auto-fit, minmax(160px, 1fr))",
                                gap:
                                  "15px",
                                alignItems:
                                  "center",
                              }}
                            >
                              <div>
                                <div
                                  style={{
                                    fontSize:
                                      "11px",
                                    color:
                                      "#718096",
                                    marginBottom:
                                      "5px",
                                  }}
                                >
                                  Talep No
                                </div>

                                <strong
                                  style={{
                                    color:
                                      "#102a43",
                                  }}
                                >
                                  {request.requestNo ||
                                    "-"}
                                </strong>
                              </div>

                              <div>
                                <div
                                  style={{
                                    fontSize:
                                      "11px",
                                    color:
                                      "#718096",
                                    marginBottom:
                                      "5px",
                                  }}
                                >
                                  Hizmet
                                </div>

                                <strong
                                  style={{
                                    color:
                                      "#17699e",
                                  }}
                                >
                                  {request.assistanceType ||
                                    "Arıza"}
                                </strong>
                              </div>

                              <div>
                                <div
                                  style={{
                                    fontSize:
                                      "11px",
                                    color:
                                      "#718096",
                                    marginBottom:
                                      "5px",
                                  }}
                                >
                                  Tarih
                                </div>

                                <strong
                                  style={{
                                    color:
                                      "#334e68",
                                  }}
                                >
                                  {formatDate(
                                    request.createdAt
                                  )}
                                </strong>
                              </div>

                              <div>
                                <div
                                  style={{
                                    fontSize:
                                      "11px",
                                    color:
                                      "#718096",
                                    marginBottom:
                                      "5px",
                                  }}
                                >
                                  Durum
                                </div>

                                <span
                                  style={{
                                    display:
                                      "inline-block",
                                    background:
                                      style.background,
                                    color:
                                      style.color,
                                    padding:
                                      "6px 10px",
                                    borderRadius:
                                      "20px",
                                    fontSize:
                                      "12px",
                                    fontWeight:
                                      "700",
                                  }}
                                >
                                  {status}
                                </span>
                              </div>

                              <div>
                                <div
                                  style={{
                                    fontSize:
                                      "11px",
                                    color:
                                      "#718096",
                                    marginBottom:
                                      "5px",
                                  }}
                                >
                                  Konum
                                </div>

                                <strong
                                  style={{
                                    color:
                                      "#334e68",
                                  }}
                                >
                                  {request.city ||
                                    "-"}{" "}
                                  /{" "}
                                  {request.district ||
                                    "-"}
                                </strong>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                </div>
              )}
            </section>

            {/* YENİ TALEP */}

            {showNewRequest && (
              <section
                style={{
                  background:
                    "white",
                  borderRadius:
                    "14px",
                  padding:
                    "25px",
                  marginBottom:
                    "25px",
                  boxShadow:
                    "0 4px 18px rgba(0,0,0,0.06)",
                }}
              >
                <h2
                  style={{
                    marginTop:
                      0,
                    color:
                      "#102a43",
                  }}
                >
                  🚗 Yeni Asist Talebi
                </h2>

                <div
                  style={{
                    background:
                      "#f5f7fa",
                    borderRadius:
                      "10px",
                    padding:
                      "15px",
                    marginBottom:
                      "20px",
                  }}
                >
                  <strong>
                    Poliçe:
                  </strong>{" "}
                  {
                    selectedPolicy.policyNumber
                  }
                  {" • "}
                  {
                    selectedPolicy.customerName
                  }
                  {" • "}
                  {
                    selectedPolicy.vehiclePlate
                  }
                </div>

                <div
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(250px, 1fr))",
                    gap:
                      "15px",
                  }}
                >
                  <div>
                    <label
                      style={
                        labelStyle
                      }
                    >
                      Hizmet Türü
                    </label>

                    <select
                      value={
                        assistanceType
                      }
                      onChange={(e) =>
                        setAssistanceType(
                          e.target.value
                        )
                      }
                      style={
                        inputStyle
                      }
                    >
                      {SERVICE_OPTIONS.map(
                        (
                          service
                        ) => (
                          <option
                            key={
                              service
                            }
                            value={
                              service
                            }
                          >
                            {service}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label
                      style={
                        labelStyle
                      }
                    >
                      Öncelik
                    </label>

                    <select
                      value={
                        priority
                      }
                      onChange={(e) =>
                        setPriority(
                          e.target.value
                        )
                      }
                      style={
                        inputStyle
                      }
                    >
                      <option>
                        Normal
                      </option>
                      <option>
                        Yüksek
                      </option>
                      <option>
                        Acil
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      style={
                        labelStyle
                      }
                    >
                      İl
                    </label>

                    <input
                      value={city}
                      onChange={(e) =>
                        setCity(
                          e.target.value
                        )
                      }
                      placeholder="Örn: Düzce"
                      style={
                        inputStyle
                      }
                    />
                  </div>

                  <div>
                    <label
                      style={
                        labelStyle
                      }
                    >
                      İlçe
                    </label>

                    <input
                      value={
                        district
                      }
                      onChange={(e) =>
                        setDistrict(
                          e.target.value
                        )
                      }
                      placeholder="Örn: Akçakoca"
                      style={
                        inputStyle
                      }
                    />
                  </div>
                </div>

                <div
                  style={{
                    marginTop:
                      "15px",
                  }}
                >
                  <label
                    style={
                      labelStyle
                    }
                  >
                    Adres / Konum
                  </label>

                  <textarea
                    value={address}
                    onChange={(e) =>
                      setAddress(
                        e.target.value
                      )
                    }
                    placeholder="Aracın bulunduğu açık adres veya konum"
                    rows={3}
                    style={{
                      ...inputStyle,
                      resize:
                        "vertical",
                    }}
                  />
                </div>

                <div
                  style={{
                    marginTop:
                      "15px",
                  }}
                >
                  <label
                    style={
                      labelStyle
                    }
                  >
                    Açıklama
                  </label>

                  <textarea
                    value={
                      description
                    }
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                    placeholder="Arıza veya asist durumu hakkında bilgi"
                    rows={3}
                    style={{
                      ...inputStyle,
                      resize:
                        "vertical",
                    }}
                  />
                </div>

                <div
                  style={{
                    display:
                      "flex",
                    gap:
                      "10px",
                    marginTop:
                      "20px",
                  }}
                >
                  <button
                    onClick={
                      createRequest
                    }
                    disabled={
                      saving
                    }
                    style={{
                      background:
                        "#0b2d4d",
                      color:
                        "white",
                      border:
                        "none",
                      borderRadius:
                        "8px",
                      padding:
                        "12px 20px",
                      fontWeight:
                        "700",
                      cursor:
                        "pointer",
                    }}
                  >
                    {saving
                      ? "Oluşturuluyor..."
                      : "Talebi Oluştur"}
                  </button>

                  <button
                    onClick={() =>
                      setShowNewRequest(
                        false
                      )
                    }
                    style={{
                      background:
                        "#f1f5f9",
                      color:
                        "#334e68",
                      border:
                        "none",
                      borderRadius:
                        "8px",
                      padding:
                        "12px 20px",
                      fontWeight:
                        "700",
                      cursor:
                        "pointer",
                    }}
                  >
                    Vazgeç
                  </button>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

const inputStyle:
  React.CSSProperties = {
  width: "100%",
  boxSizing:
    "border-box",
  padding: "12px",
  border:
    "1px solid #d8dee6",
  borderRadius: "8px",
  fontSize: "14px",
  outline: "none",
  background: "white",
};

const labelStyle:
  React.CSSProperties = {
  display: "block",
  marginBottom: "7px",
  color: "#52606d",
  fontSize: "13px",
  fontWeight: "700",
};