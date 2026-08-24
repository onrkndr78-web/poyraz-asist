"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  role?: string;
  username?: string;
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
  serviceType?: string;
  towTruck?: string;
  serviceDate?: string;
  description?: string;
  files?: string[];
  createdAt?: string;
};

export default function AgencyPolicyMovementsPage() {
  const router = useRouter();

  const [user, setUser] =
    useState<User | null>(null);

  const [movements, setMovements] =
    useState<Movement[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [selectedMovement, setSelectedMovement] =
    useState<Movement | null>(null);

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

      if (
        parsedUser.role !== "acente"
      ) {
        router.push("/login");
        return;
      }

      setUser(parsedUser);

      loadMovements(parsedUser);
    } catch {
      router.push("/login");
    }
  }, [router]);

  function loadMovements(
    currentUser: User
  ) {
    try {
      const saved =
        localStorage.getItem(
          "poyraz_policy_movements"
        );

      if (!saved) {
        setMovements([]);
        setLoading(false);
        return;
      }

      const parsed =
        JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        setMovements([]);
        setLoading(false);
        return;
      }

      const agencyMovements =
        parsed.filter(
          (movement: Movement) => {
            if (
              currentUser.agencyId &&
              movement.agencyId
            ) {
              return (
                String(
                  currentUser.agencyId
                ) ===
                String(
                  movement.agencyId
                )
              );
            }

            if (
              currentUser.agencyName &&
              movement.agencyName
            ) {
              return (
                String(
                  currentUser.agencyName
                )
                  .toLowerCase()
                  .trim() ===
                String(
                  movement.agencyName
                )
                  .toLowerCase()
                  .trim()
              );
            }

            return false;
          }
        );

      setMovements(
        agencyMovements
      );
    } catch {
      setMovements([]);
    }

    setLoading(false);
  }

  function formatDate(
    value?: string
  ) {
    if (!value) return "-";

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleDateString(
      "tr-TR"
    );
  }

  const filteredMovements =
    movements.filter(
      (movement) => {
        const text =
          search
            .trim()
            .toLowerCase();

        if (!text) return true;

        return (
          String(
            movement.policyNumber ||
              ""
          )
            .toLowerCase()
            .includes(text) ||
          String(
            movement.customerName ||
              ""
          )
            .toLowerCase()
            .includes(text) ||
          String(
            movement.customerPhone ||
              ""
          )
            .toLowerCase()
            .includes(text) ||
          String(
            movement.vehiclePlate ||
              ""
          )
            .toLowerCase()
            .includes(text) ||
          String(
            movement.serviceType ||
              ""
          )
            .toLowerCase()
            .includes(text) ||
          String(
            movement.towTruck ||
              ""
          )
            .toLowerCase()
            .includes(text)
        );
      }
    );

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
        paddingBottom: "60px",
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
            Poliçe Hareketleri
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
            📋 Poliçe Aktivite Listesi
          </h1>

          <p
            style={{
              color: "#718096",
              marginTop: "8px",
            }}
          >
            {user.agencyName ||
              user.username}{" "}
            acentesine ait hizmet hareketleri
          </p>
        </div>

        {/* ARAMA */}
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
              setSearch(
                e.target.value
              )
            }
            placeholder="🔎 Poliçe no, müşteri, telefon, plaka, hizmet veya çekici ara..."
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
        </section>

        {/* TABLO */}
        <section
          style={{
            background: "white",
            borderRadius: "14px",
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
              Poliçe Aktivite Listesi
            </h2>

            <p
              style={{
                margin:
                  "6px 0 0",
                color: "#718096",
                fontSize: "13px",
              }}
            >
              {filteredMovements.length} hizmet
              kaydı
            </p>
          </div>

          {loading ? (
            <div
              style={{
                padding: "50px",
                textAlign:
                  "center",
                color: "#718096",
              }}
            >
              Hareketler yükleniyor...
            </div>
          ) : filteredMovements.length ===
            0 ? (
            <div
              style={{
                padding: "60px 20px",
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
                📋
              </div>

              <h3
                style={{
                  margin:
                    "0 0 8px",
                  color:
                    "#334e68",
                }}
              >
                Henüz hizmet hareketi yok
              </h3>

              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                }}
              >
                Bu acenteye ait poliçelerde
                henüz hizmet kaydı
                oluşturulmamış.
              </p>
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
                  width: "100%",
                  borderCollapse:
                    "collapse",
                  minWidth:
                    "1450px",
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
                      style={
                        thStyle
                      }
                    >
                      Detay
                    </th>

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
                      Telefon
                    </th>

                    <th
                      style={
                        thStyle
                      }
                    >
                      Plaka
                    </th>

                    <th
                      style={
                        thStyle
                      }
                    >
                      Verilen Hizmet
                    </th>

                    <th
                      style={
                        thStyle
                      }
                    >
                      Çekici / Servis
                    </th>

                    <th
                      style={
                        thStyle
                      }
                    >
                      Hizmet Tarihi
                    </th>

                    <th
                      style={
                        thStyle
                      }
                    >
                      Dosyalar
                    </th>

                    <th
                      style={
                        thStyle
                      }
                    >
                      Kayıt Tarihi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    ...filteredMovements,
                  ]
                    .reverse()
                    .map(
                      (
                        movement
                      ) => (
                        <tr
                          key={
                            movement.id
                          }
                          style={{
                            borderBottom:
                              "1px solid #edf1f5",
                          }}
                        >
                          {/* DETAY */}
                          <td
                            style={
                              tdStyle
                            }
                          >
                            <button
                              onClick={() =>
                                setSelectedMovement(
                                  movement
                                )
                              }
                              style={{
                                background:
                                  "#0b2d4d",
                                color:
                                  "white",
                                border:
                                  "none",
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
                              Detay Gör
                            </button>
                          </td>

                          <td
                            style={
                              tdStyle
                            }
                          >
                            <strong>
                              {movement.policyNumber ||
                                "-"}
                            </strong>
                          </td>

                          <td
                            style={
                              tdStyle
                            }
                          >
                            {movement.agencyName ||
                              "-"}
                          </td>

                          <td
                            style={
                              tdStyle
                            }
                          >
                            {movement.customerName ||
                              "-"}
                          </td>

                          <td
                            style={
                              tdStyle
                            }
                          >
                            {movement.customerPhone ||
                              "-"}
                          </td>

                          <td
                            style={
                              tdStyle
                            }
                          >
                            <strong>
                              {movement.vehiclePlate ||
                                "-"}
                            </strong>
                          </td>

                          <td
                            style={
                              tdStyle
                            }
                          >
                            <span
                              style={{
                                background:
                                  "#eaf4ff",
                                color:
                                  "#0b2d4d",
                                padding:
                                  "6px 10px",
                                borderRadius:
                                  "20px",
                                fontWeight:
                                  "700",
                                fontSize:
                                  "12px",
                              }}
                            >
                              {movement.serviceType ||
                                "-"}
                            </span>
                          </td>

                          <td
                            style={
                              tdStyle
                            }
                          >
                            {movement.towTruck ||
                              "-"}
                          </td>

                          <td
                            style={
                              tdStyle
                            }
                          >
                            {formatDate(
                              movement.serviceDate
                            )}
                          </td>

                          {/* FOTOĞRAFLAR */}
                          <td
                            style={
                              tdStyle
                            }
                          >
                            {movement.files &&
                            movement.files.length >
                              0 ? (
                              <div
                                style={{
                                  display:
                                    "flex",
                                  gap:
                                    "5px",
                                }}
                              >
                                {movement.files
                                  .slice(
                                    0,
                                    3
                                  )
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
                                          alt="Araç fotoğrafı"
                                          style={{
                                            width:
                                              "45px",
                                            height:
                                              "45px",
                                            objectFit:
                                              "cover",
                                            borderRadius:
                                              "6px",
                                            border:
                                              "1px solid #d9e2ec",
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

                          <td
                            style={
                              tdStyle
                            }
                          >
                            {formatDate(
                              movement.createdAt
                            )}
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* DETAY MODAL */}
      {selectedMovement && (
        <div
          onClick={() =>
            setSelectedMovement(
              null
            )
          }
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              background:
                "white",
              width: "100%",
              maxWidth:
                "850px",
              maxHeight:
                "90vh",
              overflowY:
                "auto",
              borderRadius:
                "15px",
              padding:
                "25px",
              boxSizing:
                "border-box",
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
                marginBottom:
                  "20px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color:
                    "#102a43",
                }}
              >
                📋 Hizmet Detayı
              </h2>

              <button
                onClick={() =>
                  setSelectedMovement(
                    null
                  )
                }
                style={{
                  background:
                    "#f1f5f9",
                  border:
                    "none",
                  borderRadius:
                    "50%",
                  width: "35px",
                  height: "35px",
                  cursor:
                    "pointer",
                  fontSize:
                    "20px",
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "15px",
              }}
            >
              <Detail
                title="Poliçe No"
                value={
                  selectedMovement.policyNumber ||
                  "-"
                }
              />

              <Detail
                title="Acente"
                value={
                  selectedMovement.agencyName ||
                  "-"
                }
              />

              <Detail
                title="Müşteri"
                value={
                  selectedMovement.customerName ||
                  "-"
                }
              />

              <Detail
                title="Telefon"
                value={
                  selectedMovement.customerPhone ||
                  "-"
                }
              />

              <Detail
                title="Plaka"
                value={
                  selectedMovement.vehiclePlate ||
                  "-"
                }
              />

              <Detail
                title="Araç"
                value={
                  [
                    selectedMovement.vehicleBrand,
                    selectedMovement.vehicleModel,
                  ]
                    .filter(Boolean)
                    .join(" ") ||
                  "-"
                }
              />

              <Detail
                title="Verilen Hizmet"
                value={
                  selectedMovement.serviceType ||
                  "-"
                }
              />

              <Detail
                title="Çekici / Servis"
                value={
                  selectedMovement.towTruck ||
                  "-"
                }
              />

              <Detail
                title="Hizmet Tarihi"
                value={formatDate(
                  selectedMovement.serviceDate
                )}
              />

              <Detail
                title="Kayıt Tarihi"
                value={formatDate(
                  selectedMovement.createdAt
                )}
              />
            </div>

            {selectedMovement.description && (
              <div
                style={{
                  marginTop:
                    "20px",
                  background:
                    "#f5f7fa",
                  borderRadius:
                    "9px",
                  padding:
                    "15px",
                }}
              >
                <div
                  style={{
                    color:
                      "#718096",
                    fontSize:
                      "12px",
                    marginBottom:
                      "5px",
                  }}
                >
                  Açıklama
                </div>

                <div
                  style={{
                    color:
                      "#334e68",
                    fontSize:
                      "14px",
                  }}
                >
                  {
                    selectedMovement.description
                  }
                </div>
              </div>
            )}

            {/* FOTOĞRAFLAR */}
            <div
              style={{
                marginTop:
                  "22px",
              }}
            >
              <h3
                style={{
                  margin:
                    "0 0 12px",
                  color:
                    "#102a43",
                  fontSize:
                    "17px",
                }}
              >
                📷 Dosyalar / Fotoğraflar
              </h3>

              {selectedMovement.files &&
              selectedMovement.files.length >
                0 ? (
                <div
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(180px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {selectedMovement.files.map(
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
                          alt="Hizmet fotoğrafı"
                          style={{
                            width:
                              "100%",
                            height:
                              "160px",
                            objectFit:
                              "cover",
                            borderRadius:
                              "9px",
                            border:
                              "1px solid #d9e2ec",
                          }}
                        />
                      </a>
                    )
                  )}
                </div>
              ) : (
                <div
                  style={{
                    color:
                      "#718096",
                    background:
                      "#f5f7fa",
                    padding:
                      "20px",
                    borderRadius:
                      "8px",
                    textAlign:
                      "center",
                  }}
                >
                  Fotoğraf bulunmuyor.
                </div>
              )}
            </div>

            {/* MALİYET BİLİNÇLİ OLARAK YOK */}
            <div
              style={{
                marginTop:
                  "20px",
                padding:
                  "12px 15px",
                background:
                  "#ecfdf5",
                color:
                  "#15803d",
                borderRadius:
                  "8px",
                fontSize:
                  "12px",
                fontWeight:
                  "700",
              }}
            >
              ✓ Bu ekranda operasyon maliyeti
              gösterilmez.
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Detail({
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
          "#f8fafc",
        borderRadius:
          "9px",
        padding:
          "13px",
      }}
    >
      <div
        style={{
          color:
            "#718096",
          fontSize:
            "11px",
          marginBottom:
            "5px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          color:
            "#102a43",
          fontSize:
            "14px",
          fontWeight:
            "700",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding:
    "14px 12px",
  color:
    "#52606d",
  fontSize:
    "12px",
  fontWeight:
    "700",
  whiteSpace:
    "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding:
    "14px 12px",
  color:
    "#334e68",
  fontSize:
    "13px",
  whiteSpace:
    "nowrap",
};