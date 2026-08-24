"use client";

import { useEffect, useState } from "react";

type Agency = {
  id: string;
  name: string;
  username: string;
  password: string;
  phone: string;
  email: string;
  commission: number;
  active: boolean;
};

type Policy = {
  id: string;
  customer?: string;
  plate?: string;
  package?: string;
  price?: number;
  commission?: number;
  netAmount?: number;
  agency?: string;
  date?: string;
};

const defaultAgency: Agency = {
  id: "GKN001",
  name: "GKN Kibar Sigorta",
  username: "gkn001",
  password: "123456",
  phone: "",
  email: "",
  commission: 450,
  active: true,
};

export default function AdminPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [page, setPage] = useState("dashboard");

  const [showAdd, setShowAdd] = useState(false);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadAgencies();
    loadPolicies();
  }, []);

  function loadAgencies() {
    const data = localStorage.getItem(
      "poyraz_agencies"
    );

    if (!data) {
      localStorage.setItem(
        "poyraz_agencies",
        JSON.stringify([defaultAgency])
      );

      setAgencies([defaultAgency]);
      return;
    }

    try {
      const list = JSON.parse(data);

      setAgencies(
        Array.isArray(list)
          ? list
          : [defaultAgency]
      );
    } catch {
      setAgencies([defaultAgency]);
    }
  }

  function loadPolicies() {
    const data = localStorage.getItem(
      "poyraz_policies"
    );

    if (!data) {
      setPolicies([]);
      return;
    }

    try {
      const list = JSON.parse(data);

      setPolicies(
        Array.isArray(list) ? list : []
      );
    } catch {
      setPolicies([]);
    }
  }

  function saveAgencies(list: Agency[]) {
    setAgencies(list);

    localStorage.setItem(
      "poyraz_agencies",
      JSON.stringify(list)
    );
  }

  function addAgency() {
    if (
      !name.trim() ||
      !username.trim() ||
      !password.trim()
    ) {
      alert(
        "Acente adı, kullanıcı adı ve şifre zorunludur."
      );
      return;
    }

    const exists = agencies.some(
      (a) =>
        a.username.toLowerCase() ===
        username.toLowerCase()
    );

    if (exists) {
      alert(
        "Bu kullanıcı adı zaten kullanılıyor."
      );
      return;
    }

    const agency: Agency = {
      id:
        "AC" +
        Date.now().toString().slice(-6),

      name: name.trim(),

      username: username.trim(),

      password: password.trim(),

      phone: phone.trim(),

      email: email.trim(),

      commission: 450,

      active: true,
    };

    saveAgencies([
      ...agencies,
      agency,
    ]);

    setName("");
    setUsername("");
    setPassword("");
    setPhone("");
    setEmail("");

    setShowAdd(false);

    alert("Acente başarıyla eklendi.");
  }

  function toggleAgency(id: string) {
    const list = agencies.map((a) =>
      a.id === id
        ? {
            ...a,
            active: !a.active,
          }
        : a
    );

    saveAgencies(list);
  }

  function deleteAgency(id: string) {
    if (id === "GKN001") {
      alert(
        "Ana acente silinemez."
      );
      return;
    }

    const ok = confirm(
      "Bu acenteyi silmek istediğinize emin misiniz?"
    );

    if (!ok) return;

    saveAgencies(
      agencies.filter(
        (a) => a.id !== id
      )
    );
  }

  const totalSales = policies.reduce(
    (s, p) => s + (p.price || 0),
    0
  );

  const totalCommission =
    policies.reduce(
      (s, p) =>
        s +
        (typeof p.commission === "number"
          ? p.commission
          : 450),
      0
    );

  const totalNet = policies.reduce(
    (s, p) =>
      s +
      (typeof p.netAmount === "number"
        ? p.netAmount
        : (p.price || 0) -
          (p.commission || 450)),
    0
  );

  function money(n: number) {
    return (
      n.toLocaleString("tr-TR") +
      " TL"
    );
  }

  return (
    <main className="app">

      <aside className="sidebar">

        <div className="logo">
          POYRAZ <span>ASİST</span>
        </div>

        <div className="admin">
          👑 YÖNETİCİ PANELİ
        </div>

        <button
          className={
            page === "dashboard"
              ? "menu active"
              : "menu"
          }
          onClick={() =>
            setPage("dashboard")
          }
        >
          🏠 Dashboard
        </button>

        <button
          className={
            page === "agencies"
              ? "menu active"
              : "menu"
          }
          onClick={() =>
            setPage("agencies")
          }
        >
          🏢 Acenteler
        </button>

        <button
          className={
            page === "policies"
              ? "menu active"
              : "menu"
          }
          onClick={() =>
            setPage("policies")
          }
        >
          🧾 Poliçeler
        </button>

        <button
          className={
            page === "finance"
              ? "menu active"
              : "menu"
          }
          onClick={() =>
            setPage("finance")
          }
        >
          💰 Finans
        </button>

      </aside>


      <section className="content">

        <header className="topbar">

          <div>
            <b>
              Poyraz Asist
            </b>

            <small>
              Yönetici Paneli
            </small>
          </div>

          <button
            className="refresh"
            onClick={() => {
              loadAgencies();
              loadPolicies();
            }}
          >
            🔄 Yenile
          </button>

        </header>


        {page === "dashboard" && (

          <div className="page">

            <h1>
              Dashboard
            </h1>

            <p className="sub">
              Genel sistem özeti.
            </p>

            <div className="cards">

              <Card
                icon="🏢"
                title="Acenteler"
                value={String(
                  agencies.length
                )}
              />

              <Card
                icon="🧾"
                title="Poliçeler"
                value={String(
                  policies.length
                )}
              />

              <Card
                icon="💰"
                title="Toplam Satış"
                value={money(
                  totalSales
                )}
              />

              <Card
                icon="💎"
                title="Poyraz Asist"
                value={money(
                  totalNet
                )}
              />

            </div>

          </div>

        )}


        {page === "agencies" && (

          <div className="page">

            <div className="titleRow">

              <div>
                <h1>
                  🏢 Acente Yönetimi
                </h1>

                <p className="sub">
                  Acentelerinizi buradan
                  yönetin.
                </p>
              </div>

              <button
                className="addButton"
                onClick={() =>
                  setShowAdd(true)
                }
              >
                + Acente Ekle
              </button>

            </div>


            {showAdd && (

              <div className="form">

                <h2>
                  Yeni Acente Ekle
                </h2>

                <div className="grid">

                  <input
                    placeholder="Acente Adı *"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="Kullanıcı Adı *"
                    value={username}
                    onChange={(e) =>
                      setUsername(
                        e.target.value
                      )
                    }
                  />

                  <input
                    type="password"
                    placeholder="Şifre *"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="Telefon"
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="E-posta"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="actions">

                  <button
                    className="cancel"
                    onClick={() =>
                      setShowAdd(false)
                    }
                  >
                    Vazgeç
                  </button>

                  <button
                    className="save"
                    onClick={addAgency}
                  >
                    ✓ Acente Kaydet
                  </button>

                </div>

              </div>

            )}


            <div className="agencyList">

              {agencies.map((agency) => (

                <div
                  className="agency"
                  key={agency.id}
                >

                  <div className="agencyIcon">
                    🏢
                  </div>

                  <div className="agencyInfo">

                    <h2>
                      {agency.name}
                    </h2>

                    <p>
                      Kod: {agency.id}
                    </p>

                    <p>
                      Kullanıcı:
                      {" "}
                      {agency.username}
                    </p>

                    {agency.phone && (
                      <p>
                        📞 {agency.phone}
                      </p>
                    )}

                  </div>

                  <div className="agencyRight">

                    <span
                      className={
                        agency.active
                          ? "active"
                          : "passive"
                      }
                    >
                      {agency.active
                        ? "AKTİF"
                        : "PASİF"}
                    </span>

                    <button
                      onClick={() =>
                        toggleAgency(
                          agency.id
                        )
                      }
                    >
                      {agency.active
                        ? "Pasifleştir"
                        : "Aktifleştir"}
                    </button>

                    <button
                      className="delete"
                      onClick={() =>
                        deleteAgency(
                          agency.id
                        )
                      }
                    >
                      Sil
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>

        )}


        {page === "policies" && (

          <div className="page">

            <h1>
              🧾 Poliçeler
            </h1>

            <p className="sub">
              Tüm acentelerin ürettiği
              poliçeler.
            </p>

            <div className="panel">

              <table>

                <thead>

                  <tr>
                    <th>Poliçe</th>
                    <th>Acente</th>
                    <th>Müşteri</th>
                    <th>Paket</th>
                    <th>Satış</th>
                    <th>Komisyon</th>
                    <th>Poyraz Asist</th>
                  </tr>

                </thead>

                <tbody>

                  {policies.map((p) => {

                    const price =
                      p.price || 0;

                    const commission =
                      typeof p.commission ===
                      "number"
                        ? p.commission
                        : 450;

                    const net =
                      typeof p.netAmount ===
                      "number"
                        ? p.netAmount
                        : price -
                          commission;

                    return (

                      <tr key={p.id}>

                        <td>
                          <b>
                            {p.id}
                          </b>
                        </td>

                        <td>
                          {p.agency ||
                            "GKN Kibar Sigorta"}
                        </td>

                        <td>
                          {p.customer ||
                            "-"}
                        </td>

                        <td>
                          {p.package ||
                            "-"}
                        </td>

                        <td>
                          {money(price)}
                        </td>

                        <td className="green">
                          {money(
                            commission
                          )}
                        </td>

                        <td className="blue">
                          {money(net)}
                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

              {policies.length === 0 && (
                <div className="empty">
                  Henüz poliçe bulunmuyor.
                </div>
              )}

            </div>

          </div>

        )}


        {page === "finance" && (

          <div className="page">

            <h1>
              💰 Finans
            </h1>

            <p className="sub">
              Sistem finansal özeti.
            </p>

            <div className="finance">

              <div>
                <span>
                  Toplam Satış
                </span>

                <b>
                  {money(totalSales)}
                </b>
              </div>

              <div>
                <span>
                  Acente Komisyonu
                </span>

                <b className="green">
                  {money(
                    totalCommission
                  )}
                </b>
              </div>

              <div>
                <span>
                  Poyraz Asist'e Kalan
                </span>

                <b className="blue">
                  {money(totalNet)}
                </b>
              </div>

            </div>

          </div>

        )}

      </section>


      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .app {
          min-height: 100vh;
          display: flex;
          background: #f4f7fb;
          color: #172b4d;
          font-family: Arial,sans-serif;
        }

        .sidebar {
          width: 250px;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          background: #071a32;
          color: white;
          padding: 28px 15px;
        }

        .logo {
          font-size: 24px;
          font-weight: 900;
          padding: 0 12px;
        }

        .logo span {
          color: #f5a900;
        }

        .admin {
          background: #102b4a;
          padding: 15px;
          margin: 25px 5px;
          border-radius: 9px;
          font-size: 12px;
          font-weight: bold;
        }

        .menu {
          display: block;
          width: 100%;
          border: 0;
          background: transparent;
          color: #b8c6d5;
          padding: 13px;
          margin: 4px 0;
          border-radius: 8px;
          text-align: left;
          cursor: pointer;
          font-weight: bold;
        }

        .menu:hover,
        .menu.active {
          background: #0c416d;
          color: white;
        }

        .content {
          width: calc(100% - 250px);
          margin-left: 250px;
        }

        .topbar {
          height: 78px;
          background: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 35px;
          border-bottom: 1px solid #e5eaf0;
        }

        .topbar b,
        .topbar small {
          display: block;
        }

        .topbar small {
          color: #718096;
          margin-top: 4px;
        }

        .refresh {
          border: 1px solid #d8e0e8;
          background: white;
          padding: 10px 15px;
          border-radius: 8px;
          cursor: pointer;
        }

        .page {
          padding: 35px;
        }

        h1 {
          margin: 0;
          font-size: 30px;
        }

        .sub {
          color: #718096;
          margin-bottom: 25px;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 18px;
        }

        .card {
          background: white;
          padding: 22px;
          border-radius: 14px;
          box-shadow: 0 4px 20px rgba(0,0,0,.05);
        }

        .cardIcon {
          font-size: 27px;
        }

        .cardTitle {
          color: #718096;
          margin-top: 12px;
          font-size: 13px;
        }

        .cardValue {
          color: #0c416d;
          font-size: 23px;
          font-weight: 900;
          margin-top: 5px;
        }

        .titleRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .addButton,
        .save {
          background: #f5a900;
          color: #071a32;
          border: 0;
          padding: 13px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 900;
        }

        .form {
          background: white;
          padding: 25px;
          border-radius: 14px;
          margin: 25px 0;
          box-shadow: 0 4px 20px rgba(0,0,0,.05);
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        input {
          padding: 13px;
          border: 1px solid #d8e0e8;
          border-radius: 8px;
          outline: none;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .cancel {
          border: 1px solid #d8e0e8;
          background: white;
          padding: 12px 18px;
          border-radius: 8px;
          cursor: pointer;
        }

        .agencyList {
          display: grid;
          gap: 15px;
        }

        .agency {
          background: white;
          padding: 22px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 18px;
          box-shadow: 0 4px 20px rgba(0,0,0,.05);
        }

        .agencyIcon {
          width: 58px;
          height: 58px;
          background: #edf3f8;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }

        .agencyInfo {
          flex: 1;
        }

        .agencyInfo h2 {
          margin: 0 0 7px;
          font-size: 18px;
        }

        .agencyInfo p {
          margin: 3px 0;
          color: #718096;
          font-size: 13px;
        }

        .agencyRight {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .agencyRight button {
          border: 1px solid #d8e0e8;
          background: white;
          padding: 8px 11px;
          border-radius: 7px;
          cursor: pointer;
        }

        .agencyRight .delete {
          color: #c53030;
        }

        .active {
          color: #16833a;
          font-weight: 900;
        }

        .passive {
          color: #c53030;
          font-weight: 900;
        }

        .panel {
          background: white;
          padding: 25px;
          border-radius: 14px;
          box-shadow: 0 4px 20px rgba(0,0,0,.05);
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        th {
          background: #f7f9fb;
          color: #718096;
          padding: 13px;
          text-align: left;
          font-size: 12px;
        }

        td {
          padding: 14px 13px;
          border-bottom: 1px solid #edf1f5;
          font-size: 13px;
        }

        .green {
          color: #16833a !important;
          font-weight: 900;
        }

        .blue {
          color: #0c416d !important;
          font-weight: 900;
        }

        .empty {
          text-align: center;
          padding: 45px;
          color: #718096;
        }

        .finance {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 18px;
        }

        .finance div {
          background: white;
          padding: 25px;
          border-radius: 14px;
          box-shadow: 0 4px 20px rgba(0,0,0,.05);
        }

        .finance span,
        .finance b {
          display: block;
        }

        .finance span {
          color: #718096;
        }

        .finance b {
          margin-top: 10px;
          font-size: 25px;
        }

        @media(max-width:900px) {

          .cards {
            grid-template-columns: 1fr 1fr;
          }

          .finance {
            grid-template-columns: 1fr;
          }

          .agency {
            align-items: flex-start;
            flex-wrap: wrap;
          }

        }

      `}</style>

    </main>
  );
}

function Card({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) {
  return (
    <div className="card">

      <div className="cardIcon">
        {icon}
      </div>

      <div className="cardTitle">
        {title}
      </div>

      <div className="cardValue">
        {value}
      </div>

    </div>
  );
}