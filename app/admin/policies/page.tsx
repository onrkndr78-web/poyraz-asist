"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Policy = {
  id: string | number;

  policyNo: string;
  date: string;
  agency: string;
  customer: string;
  phone: string;
  plate: string;
  package: string;

  price: number;
  commission: number;
  poyraz: number;

  commissionRate: number;

  startDate: string;
  endDate: string;

  status: string;
};

export default function PoliciesPage() {
  const router = useRouter();

  const [policies, setPolicies] =
    useState<Policy[]>([]);

  const [search, setSearch] =
    useState("");

  const [packageFilter, setPackageFilter] =
    useState("Tümü");

  useEffect(() => {
    const savedUser =
      localStorage.getItem("poyraz_user");

    if (!savedUser) {
      router.push("/login");
      return;
    }

    loadPolicies();
  }, [router]);

  function loadPolicies() {
    const savedPolicies =
      localStorage.getItem(
        "poyraz_policies"
      );

    if (!savedPolicies) {
      setPolicies([]);
      return;
    }

    try {
      const parsed =
        JSON.parse(savedPolicies);

      if (!Array.isArray(parsed)) {
        setPolicies([]);
        return;
      }

      /*
       * ACENTE TARAFINDAKİ YENİ VERİYİ
       * ADMİN FORMATINA ÇEVİRİYORUZ.
       */

      const normalized: Policy[] =
        parsed.map(
          (policy: any, index: number) => {
            const price = Number(
              policy.premium ??
                policy.price ??
                policy.production ??
                0
            );

            const commissionRate =
              Number(
                policy.commissionRate ??
                  35
              );

            const commission =
              policy.commission !==
              undefined
                ? Number(
                    policy.commission
                  )
                : (price *
                    commissionRate) /
                  100;

            const poyraz =
              policy.poyraz !==
              undefined
                ? Number(
                    policy.poyraz
                  )
                : price -
                  commission;

            const policyNo =
              policy.policyNumber ??
              policy.policyNo ??
              `PYZ-${String(
                index + 1
              ).padStart(
                6,
                "0"
              )}`;

            const customer =
              policy.customerName ??
              policy.customer ??
              "-";

            const plate =
              policy.vehiclePlate ??
              policy.plate ??
              "-";

            const agency =
              policy.agencyName ??
              policy.agency ??
              "Bilinmeyen Acente";

            const phone =
              policy.customerPhone ??
              policy.phone ??
              "-";

            const startDate =
              policy.startDate ??
              "";

            const endDate =
              policy.endDate ??
              "";

            let date =
              policy.createdAt ??
              policy.date ??
              startDate ??
              "";

            /*
             * Tarihi okunabilir hale getir.
             */

            if (date) {
              try {
                date =
                  new Date(
                    date
                  ).toLocaleDateString(
                    "tr-TR"
                  );
              } catch {
                date = String(
                  date
                );
              }
            }

            return {
              id:
                policy.id ??
                `${Date.now()}-${index}`,

              policyNo:
                String(
                  policyNo
                ),

              date,

              agency:
                String(
                  agency
                ),

              customer:
                String(
                  customer
                ),

              phone:
                String(
                  phone
                ),

              plate:
                String(
                  plate
                ),

              package:
                String(
                  policy.package ??
                    "ASİST"
                ),

              price,

              commission,

              poyraz,

              commissionRate,

              startDate:
                String(
                  startDate
                ),

              endDate:
                String(
                  endDate
                ),

              status:
                String(
                  policy.status ??
                    "Aktif"
                ),
            };
          }
        );

      setPolicies(
        normalized
      );
    } catch (error) {
      console.error(
        "Poliçeler okunamadı:",
        error
      );

      setPolicies([]);
    }
  }

  function deletePolicy(
    id: string | number
  ) {
    const confirmed =
      window.confirm(
        "Bu poliçeyi silmek istediğinize emin misiniz?"
      );

    if (!confirmed) {
      return;
    }

    const updated =
      policies.filter(
        (policy) =>
          String(policy.id) !==
          String(id)
      );

    setPolicies(
      updated
    );

    /*
     * Admin formatını tekrar
     * localStorage'a yaz.
     */

    localStorage.setItem(
      "poyraz_policies",
      JSON.stringify(
        updated.map(
          (policy) => ({
            id: policy.id,

            policyNumber:
              policy.policyNo,

            createdAt:
              policy.date,

            agencyName:
              policy.agency,

            customerName:
              policy.customer,

            customerPhone:
              policy.phone,

            vehiclePlate:
              policy.plate,

            package:
              policy.package,

            premium:
              policy.price,

            commission:
              policy.commission,

            commissionRate:
              policy.commissionRate,

            poyraz:
              policy.poyraz,

            startDate:
              policy.startDate,

            endDate:
              policy.endDate,

            status:
              policy.status,
          })
        )
      )
    );
  }

  const filteredPolicies =
    policies.filter(
      (policy) => {
        const searchText =
          search
            .trim()
            .toLowerCase();

        const matchesSearch =
          String(
            policy.policyNo ??
              ""
          )
            .toLowerCase()
            .includes(
              searchText
            ) ||

          String(
            policy.customer ??
              ""
          )
            .toLowerCase()
            .includes(
              searchText
            ) ||

          String(
            policy.phone ??
              ""
          )
            .toLowerCase()
            .includes(
              searchText
            ) ||

          String(
            policy.plate ??
              ""
          )
            .toLowerCase()
            .includes(
              searchText
            ) ||

          String(
            policy.agency ??
              ""
          )
            .toLowerCase()
            .includes(
              searchText
            );

        const matchesPackage =
          packageFilter ===
            "Tümü" ||
          String(
            policy.package ??
              ""
          ).toUpperCase() ===
            packageFilter;

        return (
          matchesSearch &&
          matchesPackage
        );
      }
    );

  const totalProduction =
    policies.reduce(
      (sum, policy) =>
        sum +
        Number(
          policy.price || 0
        ),
      0
    );

  const totalCommission =
    policies.reduce(
      (sum, policy) =>
        sum +
        Number(
          policy.commission ||
            0
        ),
      0
    );

  const totalPoyraz =
    policies.reduce(
      (sum, policy) =>
        sum +
        Number(
          policy.poyraz || 0
        ),
      0
    );

  function money(
    value: number
  ) {
    return Number(
      value || 0
    ).toLocaleString(
      "tr-TR",
      {
        minimumFractionDigits:
          2,
        maximumFractionDigits:
          2,
      }
    );
  }

  return (
    <main
      style={{
        minHeight:
          "100vh",
        background:
          "#f5f7fb",
        padding:
          "30px",
        fontFamily:
          "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth:
            "1450px",
          margin:
            "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            background:
              "#0b1f3a",
            color:
              "white",
            padding:
              "25px",
            borderRadius:
              "15px",
            marginBottom:
              "25px",
            display:
              "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            gap:
              "20px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize:
                  "28px",
              }}
            >
              📋 Tüm Poliçeler
            </h1>

            <p
              style={{
                margin:
                  "8px 0 0",
                opacity:
                  0.8,
              }}
            >
              Poyraz Asist poliçe
              yönetim sistemi
            </p>
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
                "#0b1f3a",
              border:
                "none",
              padding:
                "12px 20px",
              borderRadius:
                "8px",
              cursor:
                "pointer",
              fontWeight:
                "bold",
            }}
          >
            ← Admin Paneli
          </button>
        </div>

        {/* ÖZET */}

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap:
              "15px",
            marginBottom:
              "25px",
          }}
        >
          <div
            style={
              cardStyle
            }
          >
            <div
              style={
                labelStyle
              }
            >
              📄 Toplam Poliçe
            </div>

            <div
              style={
                numberStyle
              }
            >
              {policies.length}
            </div>
          </div>

          <div
            style={
              cardStyle
            }
          >
            <div
              style={
                labelStyle
              }
            >
              💰 Toplam Üretim
            </div>

            <div
              style={
                numberStyle
              }
            >
              {money(
                totalProduction
              )}{" "}
              TL
            </div>
          </div>

          <div
            style={
              cardStyle
            }
          >
            <div
              style={
                labelStyle
              }
            >
              💵 Acente Komisyonu
            </div>

            <div
              style={
                numberStyle
              }
            >
              {money(
                totalCommission
              )}{" "}
              TL
            </div>
          </div>

          <div
            style={
              cardStyle
            }
          >
            <div
              style={
                labelStyle
              }
            >
              🏢 Poyraz Asist
            </div>

            <div
              style={{
                ...numberStyle,
                color:
                  "#15803d",
              }}
            >
              {money(
                totalPoyraz
              )}{" "}
              TL
            </div>
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
              "15px",
            marginBottom:
              "20px",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.06)",
            display:
              "flex",
            gap:
              "15px",
            flexWrap:
              "wrap",
          }}
        >
          <input
            type="text"
            placeholder="🔎 Poliçe no, müşteri, telefon, plaka veya acente ara..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            style={{
              flex: 1,
              minWidth:
                "280px",
              padding:
                "13px",
              border:
                "1px solid #ddd",
              borderRadius:
                "8px",
              fontSize:
                "14px",
              outline:
                "none",
            }}
          />

          <select
            value={
              packageFilter
            }
            onChange={(e) =>
              setPackageFilter(
                e.target.value
              )
            }
            style={{
              padding:
                "13px",
              border:
                "1px solid #ddd",
              borderRadius:
                "8px",
              fontSize:
                "14px",
              minWidth:
                "160px",
            }}
          >
            <option value="Tümü">
              Tüm Paketler
            </option>

            <option value="STAR">
              STAR
            </option>

            <option value="GOLD">
              GOLD
            </option>

            <option value="PLAT">
              PLAT
            </option>

            <option value="ASİST">
              ASİST
            </option>
          </select>
        </div>

        {/* TABLO */}

        <div
          style={{
            background:
              "white",
            borderRadius:
              "15px",
            overflow:
              "hidden",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              padding:
                "20px",
              display:
                "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                }}
              >
                Poliçe Listesi
              </h2>

              <p
                style={{
                  margin:
                    "5px 0 0",
                  color:
                    "#777",
                  fontSize:
                    "14px",
                }}
              >
                Gösterilen poliçe:{" "}
                {
                  filteredPolicies.length
                }
              </p>
            </div>
          </div>

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
                  "1350px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background:
                      "#f1f4f8",
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
                    Tarih
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
                    Paket
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
                    Komisyon
                  </th>

                  <th
                    style={
                      thStyle
                    }
                  >
                    Poyraz
                  </th>

                  <th
                    style={
                      thStyle
                    }
                  >
                    Durum
                  </th>

                  <th
                    style={
                      thStyle
                    }
                  >
                    İşlem
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredPolicies.map(
                  (policy) => {
                    return (
                      <tr
                        key={
                          policy.id
                        }
                      >
                        <td
                          style={
                            tdStyle
                          }
                        >
                          <strong>
                            {
                              policy.policyNo
                            }
                          </strong>
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            policy.date
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            policy.agency
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            policy.customer
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            policy.phone
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          <strong>
                            {
                              policy.plate
                            }
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
                                policy.package ===
                                "STAR"
                                  ? "#fff3cd"
                                  : policy.package ===
                                    "GOLD"
                                  ? "#fff8dc"
                                  : policy.package ===
                                    "PLAT"
                                  ? "#e9eef7"
                                  : "#e6f4ea",

                              padding:
                                "6px 10px",

                              borderRadius:
                                "20px",

                              fontWeight:
                                "bold",
                            }}
                          >
                            {
                              policy.package
                            }
                          </span>
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            money(
                              policy.price
                            )
                          }{" "}
                          TL
                        </td>

                        <td
                          style={{
                            ...tdStyle,
                            color:
                              "#16803c",
                            fontWeight:
                              "bold",
                          }}
                        >
                          {
                            money(
                              policy.commission
                            )
                          }{" "}
                          TL
                        </td>

                        <td
                          style={{
                            ...tdStyle,
                            fontWeight:
                              "bold",
                          }}
                        >
                          {
                            money(
                              policy.poyraz
                            )
                          }{" "}
                          TL
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          <span
                            style={{
                              color:
                                "#15803d",
                              fontWeight:
                                "bold",
                            }}
                          >
                            ●{" "}
                            {
                              policy.status
                            }
                          </span>
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          <button
                            onClick={() =>
                              deletePolicy(
                                policy.id
                              )
                            }
                            style={{
                              background:
                                "#dc2626",
                              color:
                                "white",
                              border:
                                "none",
                              padding:
                                "8px 12px",
                              borderRadius:
                                "7px",
                              cursor:
                                "pointer",
                              fontWeight:
                                "bold",
                            }}
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )}

                {filteredPolicies.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={
                        12
                      }
                      style={{
                        padding:
                          "50px",
                        textAlign:
                          "center",
                        color:
                          "#777",
                      }}
                    >
                      Poliçe
                      bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ALT BİLGİ */}

        <div
          style={{
            marginTop:
              "20px",
            background:
              "#eaf4ff",
            borderRadius:
              "12px",
            padding:
              "15px 20px",
            color:
              "#1e40af",
            fontSize:
              "14px",
          }}
        >
          <strong>
            ℹ️ Komisyon Sistemi:
          </strong>{" "}
          Poliçe satış bedelinin
          %35'i acenteye,
          %65'i Poyraz Asist'e
          aittir.
        </div>
      </div>
    </main>
  );
}

const cardStyle: React.CSSProperties =
  {
    background:
      "white",
    padding:
      "20px",
    borderRadius:
      "12px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.06)",
  };

const labelStyle: React.CSSProperties =
  {
    fontSize:
      "14px",
    color:
      "#777",
    marginBottom:
      "8px",
  };

const numberStyle: React.CSSProperties =
  {
    fontSize:
      "25px",
    fontWeight:
      "bold",
    color:
      "#0b1f3a",
  };

const thStyle: React.CSSProperties =
  {
    padding:
      "15px",
    textAlign:
      "left",
    fontSize:
      "13px",
    color:
      "#555",
    borderBottom:
      "1px solid #ddd",
    whiteSpace:
      "nowrap",
  };

const tdStyle: React.CSSProperties =
  {
    padding:
      "15px",
    borderBottom:
      "1px solid #eee",
    fontSize:
      "14px",
    whiteSpace:
      "nowrap",
  };