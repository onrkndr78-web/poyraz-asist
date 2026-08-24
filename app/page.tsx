"use client";

import { useEffect, useMemo, useState } from "react";

type Policy = {
  id: string;
  customer?: string;
  phone?: string;
  tc?: string;
  plate?: string;
  vehicle?: string;
  package?: string;
  price?: number;
  commission?: number;
  agency?: string;
  date?: string;
  status?: string;
};

type Agency = {
  id: string;
  name: string;
  username?: string;
  phone?: string;
  email?: string;
  commission?: number;
  active?: boolean;
};

const DEFAULT_COMMISSION = 450;

export default function AdminPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [activePage, setActivePage] = useState("dashboard");

  const [showAgency, setShowAgency] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    try {
      const p = localStorage.getItem("poyraz_policies");
      const a = localStorage.getItem("poyraz_agencies");

      const parsedPolicies = p ? JSON.parse(p) : [];
      const parsedAgencies = a ? JSON.parse(a) : [];

      setPolicies(
        Array.isArray(parsedPolicies)
          ? parsedPolicies
          : []
      );

      setAgencies(
        Array.isArray(parsedAgencies)
          ? parsedAgencies
          : []
      );
    } catch {
      setPolicies([]);
      setAgencies([]);
    }
  }

  const totalSales = useMemo(
    () =>
      policies.reduce(
        (t, p) => t + (p.price || 0),
        0
      ),
    [policies]
  );

  const totalCommission = useMemo(
    () =>
      policies.reduce(
        (t, p) =>
          t +
          (typeof p.commission === "number"
            ? p.commission
            : DEFAULT_COMMISSION),
        0
      ),
    [policies]
  );

  const poyrazRemaining =
    totalSales - totalCommission;

  const customers = useMemo(() => {
    return Array.from(
      new Map(
        policies.map(p => [
          p.tc || p.phone || p.customer,
          p
        ])
      ).values()
    );
  }, [policies]);

  function money(value: number) {
    return (
      value.toLocaleString("tr-TR") +
      " TL"
    );
  }

  function addAgency() {
    if (!name || !username || !password) {
      alert(
        "Acente adı, kullanıcı adı ve şifre zorunludur."
      );
      return;
    }

    const newAgency: Agency = {
      id:
        "AC" +
        Math.floor(
          100000 +
          Math.random() * 900000
        ),
      name,
      username,
      password,
      commission: DEFAULT_COMMISSION,
      active: true
    };

    const updated = [
      ...agencies,
      newAgency
    ];

    localStorage.setItem(
      "poyraz_agencies",
      JSON.stringify(updated)
    );

    setAgencies(updated);

    setName("");
    setUsername("");
    setPassword("");
    setShowAgency(false);
  }

  function toggleAgency(id: string) {
    const updated = agencies.map(a =>
      a.id === id
        ? {
            ...a,
            active: !a.active
          }
        : a
    );

    setAgencies(updated);

    localStorage.setItem(
      "poyraz_agencies",
      JSON.stringify(updated)
    );
  }

  return (
    <main className="app">

      <aside className="sidebar">

        <div className="logo">
          POYRAZ <span>ASİST</span>
        </div>

        <div className="adminBox">
          👑 YÖNETİCİ
          <small>MERKEZ PANELİ</small>
        </div>

        <nav>

          <button
            className={
              activePage === "dashboard"
                ? "menu active"
                : "menu"
            }
            onClick={() =>
              setActivePage("dashboard")
            }
          >
            📊 Dashboard
          </button>

          <button
            className={
              activePage === "agencies"
                ? "menu active"
                : "menu"
            }
            onClick={() =>
              setActivePage("agencies")
            }
          >
            🏢 Acenteler
          </button>

          <button
            className={
              activePage === "policies"
                ? "menu active"
                : "menu"
            }
            onClick={() =>
              setActivePage("policies")
            }
          >
            🧾 Tüm Poliçeler
          </button>

          <button
            className={
              activePage === "customers"
                ? "menu active"
                : "menu"
            }
            onClick={() =>
              setActivePage("customers")
            }
          >
            👥 Tüm Müşteriler
          </button>

          <button
            className={
              activePage === "finance"
                ? "menu active"
                : "menu"
            }
            onClick={() =>
              setActivePage("finance")
            }
          >
            💰 Finans
          </button>

          <button
            className={
              activePage === "reports"
                ? "menu active"
                : "menu"
            }
            onClick={() =>
              setActivePage("reports")
            }
          >
            📈 Raporlar
          </button>

        </nav>

      </aside>

      <section className="content">

        <header className="topbar">

          <div>
            <strong>
              Poyraz Asist Yönetim Paneli
            </strong>

            <small>
              Merkez Yönetim Sistemi
            </small>
          </div>

          <button
            className="refresh"
            onClick={loadData}
          >
            🔄 Yenile
          </button>

        </header>

        {activePage === "dashboard" && (

          <div className="page">

            <h1>📊 Dashboard</h1>

            <p className="subtitle">
              Poyraz Asist genel satış ve finans özeti.
            </p>

            <div className="cards">

              <Card
                icon="🧾"
                title="Toplam Poliçe"
                value={
                  policies.length.toString()
                }
              />

              <Card
                icon="💵"
                title="Toplam Satış"
                value={money(totalSales)}
              />

              <Card
                icon="🤝"
                title="Acente Komisyonu"
                value={money(totalCommission)}
              />

              <Card
                icon="🏢"
                title="Aktif Acente"
                value={
                  agencies.filter(
                    a => a.active !== false
                  ).length.toString()
                }
              />

            </div>

            <div className="profitBox">

              <div>
                <span>
                  Poyraz Asist'e Kalan
                </span>

                <strong>
                  {money(poyrazRemaining)}
                </strong>
              </div>

              <div className="profitIcon">
                💰
              </div>

            </div>

            <div className="panel">

              <h2>
                Son Poliçeler
              </h2>

              {policies.length === 0 ? (

                <div className="empty">
                  Henüz poliçe bulunmuyor.
                </div>

              ) : (

                <PolicyTable
                  policies={policies.slice(0, 10)}
                />

              )}

            </div>

          </div>

        )}

        {activePage === "agencies" && (

          <div className="page">

            <div className="pageHeader">

              <div>
                <h1>🏢 Acenteler</h1>

                <p className="subtitle">
                  Poyraz Asist acente yönetimi.
                </p>
              </div>

              <button
                className="primary"
                onClick={() =>
                  setShowAgency(true)
                }
              >
                + Acente Ekle
              </button>

            </div>

            <div className="panel">

              {agencies.length === 0 ? (

                <div className="empty">
                  Henüz acente eklenmemiş.
                </div>

              ) : (

                <table>

                  <thead>
                    <tr>
                      <th>Acente</th>
                      <th>Kod</th>
                      <th>Kullanıcı</th>
                      <th>Komisyon</th>
                      <th>Durum</th>
                    </tr>
                  </thead>

                  <tbody>

                    {agencies.map(a => (

                      <tr key={a.id}>

                        <td>
                          <b>{a.name}</b>
                        </td>

                        <td>
                          {a.id}
                        </td>

                        <td>
                          {a.username || "-"}
                        </td>

                        <td className="commission">
                          {money(
                            a.commission ||
                            DEFAULT_COMMISSION
                          )}
                        </td>

                        <td>

                          <button
                            className={
                              a.active === false
                                ? "status off"
                                : "status"
                            }
                            onClick={() =>
                              toggleAgency(a.id)
                            }
                          >
                            {a.active === false
                              ? "PASİF"
                              : "AKTİF"}
                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              )}

            </div>

          </div>

        )}

        {activePage === "policies" && (

          <div className="page">

            <h1>🧾 Tüm Poliçeler</h1>

            <p className="subtitle">
              Tüm acentelerin oluşturduğu poliçeler.
            </p>

            <div className="panel">

              {policies.length === 0 ? (

                <div className="empty">
                  Poliçe bulunmuyor.
                </div>

              ) : (

                <PolicyTable
                  policies={policies}
                  admin
                />

              )}

            </div>

          </div>

        )}

        {activePage === "customers" && (

          <div className="page">

            <h1>👥 Tüm Müşteriler</h1>

            <p className="subtitle">
              Sistemdeki tüm müşteriler.
            </p>

            <div className="panel">

              {customers.length === 0 ? (

                <div className="empty">
                  Müşteri bulunmuyor.
                </div>

              ) : (

                <table>

                  <thead>

                    <tr>
                      <th>Müşteri</th>
                      <th>Telefon</th>
                      <th>TC / VKN</th>
                      <th>Plaka</th>
                      <th>Acente</th>
                    </tr>

                  </thead>

                  <tbody>

                    {customers.map(
                      (p, index) => (

                        <tr key={index}>

                          <td>
                            <b>
                              {p.customer || "-"}
                            </b>
                          </td>

                          <td>
                            {p.phone || "-"}
                          </td>

                          <td>
                            {p.tc || "-"}
                          </td>

                          <td>
                            {p.plate || "-"}
                          </td>

                          <td>
                            {p.agency || "-"}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              )}

            </div>

          </div>

        )}

        {activePage === "finance" && (

          <div className="page">

            <h1>💰 Finans</h1>

            <p className="subtitle">
              Poyraz Asist satış ve gelir özeti.
            </p>

            <div className="cards">

              <Card
                icon="💵"
                title="Brüt Satış"
                value={money(totalSales)}
              />

              <Card
                icon="🤝"
                title="Acente Komisyonu"
                value={money(totalCommission)}
              />

              <Card
                icon="💰"
                title="Poyraz Asist"
                value={money(poyrazRemaining)}
              />

            </div>

            <div className="financeBox">

              <div>
                <span>
                  Satış başına örnek
                </span>

                <b>
                  1.250 TL
                </b>
              </div>

              <div>
                <span>
                  Acente komisyonu
                </span>

                <b>
                  450 TL
                </b>
              </div>

              <div>
                <span>
                  Poyraz Asist'e kalan
                </span>

                <b>
                  800 TL
                </b>
              </div>

            </div>

          </div>

        )}

        {activePage === "reports" && (

          <div className="page">

            <h1>📈 Raporlar</h1>

            <p className="subtitle">
              Genel sistem raporu.
            </p>

            <div className="panel">

              <div className="reportRow">
                <span>Toplam Poliçe</span>
                <b>{policies.length}</b>
              </div>

              <div className="reportRow">
                <span>Toplam Satış</span>
                <b>{money(totalSales)}</b>
              </div>

              <div className="reportRow">
                <span>Toplam Acente Komisyonu</span>
                <b>{money(totalCommission)}</b>
              </div>

              <div className="reportRow">
                <span>Poyraz Asist'e Kalan</span>
                <b>{money(poyrazRemaining)}</b>
              </div>

              <div className="reportRow">
                <span>Toplam Müşteri</span>
                <b>{customers.length}</b>
              </div>

            </div>

          </div>

        )}

      </section>

      {showAgency && (

        <div className="modal">

          <div className="modalBox">

            <h2>
              🏢 Yeni Acente
            </h2>

            <input
              placeholder="Acente adı"
              value={name}
              onChange={e =>
                setName(e.target.value)
              }
            />

            <input
              placeholder="Kullanıcı adı"
              value={username}
              onChange={e =>
                setUsername(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={e =>
                setPassword(e.target.value)
              }
            />

            <div className="modalButtons">

              <button
                className="cancel"
                onClick={() =>
                  setShowAgency(false)
                }
              >
                Vazgeç
              </button>

              <button
                className="primary"
                onClick={addAgency}
              >
                Acente Oluştur
              </button>

            </div>

          </div>

        </div>

      )}

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .app {
          min-height: 100vh;
          display: flex;
          background: #f4f7fb;
          color: #172b4d;
          font-family: Arial, sans-serif;
        }

        .sidebar {
          width: 255px;
          min-height: 100vh;
          background: #071a32;
          color: white;
          padding: 25px 15px;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
        }

        .logo {
          font-size: 23px;
          font-weight: 900;
          padding: 0 12px;
        }

        .logo span {
          color: #f5a900;
        }

        .adminBox {
          margin: 25px 5px;
          padding: 15px;
          background: #102b4a;
          border-radius: 10px;
          font-size: 13px;
          font-weight: bold;
        }

        .adminBox small {
          display: block;
          color: #8ea5bc;
          margin-top: 7px;
        }

        nav {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .menu {
          width: 100%;
          border: 0;
          background: transparent;
          color: #b7c5d5;
          padding: 13px;
          text-align: left;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
        }

        .menu:hover {
          background: #102b4a;
          color: white;
        }

        .menu.active {
          background: #0c416d;
          color: white;
        }

        .content {
          width: calc(100% - 255px);
          margin-left: 255px;
        }

        .topbar {
          height: 78px;
          background: white;
          border-bottom: 1px solid #e5eaf0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 35px;
        }

        .topbar strong {
          display: block;
        }

        .topbar small {
          display: block;
          color: #718096;
          margin-top: 5px;
        }

        .page {
          padding: 35px;
          max-width: 1450px;
          margin: auto;
        }

        h1 {
          margin: 0;
          font-size: 29px;
        }

        h2 {
          margin-top: 0;
        }

        .subtitle {
          color: #718096;
          margin: 8px 0 25px;
        }

        .pageHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 25px;
        }

        .card {
          background: white;
          border-radius: 14px;
          padding: 22px;
          box-shadow: 0 4px 20px rgba(0,0,0,.05);
        }

        .cardIcon {
          font-size: 27px;
        }

        .cardTitle {
          color: #718096;
          font-size: 13px;
          margin-top: 12px;
        }

        .cardValue {
          font-size: 23px;
          font-weight: 900;
          color: #0c416d;
          margin-top: 6px;
        }

        .profitBox {
          background: #0c416d;
          color: white;
          border-radius: 14px;
          padding: 25px;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .profitBox span {
          display: block;
          opacity: .8;
          font-size: 14px;
        }

        .profitBox strong {
          display: block;
          font-size: 30px;
          margin-top: 5px;
        }

        .profitIcon {
          font-size: 45px;
        }

        .panel {
          background: white;
          border-radius: 14px;
          padding: 25px;
          box-shadow: 0 4px 20px rgba(0,0,0,.05);
          overflow-x: auto;
        }

        .panel h2 {
          font-size: 19px;
          margin-bottom: 20px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 850px;
        }

        th {
          text-align: left;
          background: #f7f9fb;
          color: #718096;
          font-size: 12px;
          padding: 13px;
        }

        td {
          padding: 14px 13px;
          border-bottom: 1px solid #edf1f5;
          font-size: 13px;
        }

        .commission {
          color: #16833a;
          font-weight: 900;
        }

        .poyraz {
          color: #0c416d;
          font-weight: 900;
        }

        .status {
          border: 0;
          background: #e7f7ed;
          color: #16833a;
          padding: 6px 10px;
          border-radius: 20px;
          font-weight: bold;
          cursor: pointer;
        }

        .status.off {
          background: #ffecec;
          color: #c53030;
        }

        .primary {
          border: 0;
          background: #f5a900;
          color: #071a32;
          padding: 12px 18px;
          border-radius: 8px;
          font-weight: 900;
          cursor: pointer;
        }

        .refresh {
          border: 1px solid #d7e0e8;
          background: white;
          padding: 10px 15px;
          border-radius: 8px;
          cursor: pointer;
        }

        .empty {
          text-align: center;
          padding: 50px;
          color: #718096;
        }

        .financeBox {
          background: white;
          border-radius: 14px;
          padding: 25px;
          box-shadow: 0 4px 20px rgba(0,0,0,.05);
        }

        .financeBox div {
          display: flex;
          justify-content: space-between;
          padding: 17px 0;
          border-bottom: 1px solid #edf1f5;
        }

        .financeBox div:last-child {
          border-bottom: 0;
        }

        .reportRow {
          display: flex;
          justify-content: space-between;
          padding: 18px 0;
          border-bottom: 1px solid #edf1f5;
        }

        .reportRow:last-child {
          border-bottom: 0;
        }

        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.55);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .modalBox {
          width: 430px;
          background: white;
          padding: 30px;
          border-radius: 16px;
        }

        .modalBox h2 {
          margin-bottom: 25px;
        }

        .modalBox input {
          width: 100%;
          padding: 13px;
          margin-bottom: 13px;
          border: 1px solid #d8e0e8;
          border-radius: 8px;
          outline: none;
        }

        .modalButtons {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 10px;
        }

        .cancel {
          border: 1px solid #d8e0e8;
          background: white;
          padding: 12px 18px;
          border-radius: 8px;
          cursor: pointer;
        }

        @media(max-width:1000px) {
          .cards {
            grid-template-columns: repeat(2,1fr);
          }
        }

        @media(max-width:700px) {
          .sidebar {
            width: 210px;
          }

          .content {
            width: calc(100% - 210px);
            margin-left: 210px;
          }

          .page {
            padding: 20px;
          }

          .cards {
            grid-template-columns: 1fr;
          }
        }

      `}</style>

    </main>
  );
}

function Card({
  icon,
  title,
  value
}: {
  icon: string;
  title: string;
  value: string;
}) {
  return (
    <div className="card">
      <div className="cardIcon">{icon}</div>
      <div className="cardTitle">{title}</div>
      <div className="cardValue">{value}</div>
    </div>
  );
}

function PolicyTable({
  policies,
  admin = false
}: {
  policies: Policy[];
  admin?: boolean;
}) {
  return (
    <table>

      <thead>

        <tr>
          <th>Poliçe</th>
          <th>Müşteri</th>
          <th>Plaka</th>
          <th>Paket</th>
          <th>Satış</th>
          <th>Komisyon</th>

          {admin && (
            <th>Poyraz Asist</th>
          )}

          <th>Acente</th>
          <th>Durum</th>
        </tr>

      </thead>

      <tbody>

        {policies.map(p => {

          const price = p.price || 0;

          const commission =
            typeof p.commission === "number"
              ? p.commission
              : DEFAULT_COMMISSION;

          const remaining =
            price - commission;

          return (
            <tr key={p.id}>

              <td>
                <b>{p.id}</b>
              </td>

              <td>
                {p.customer || "-"}
              </td>

              <td>
                {p.plate || "-"}
              </td>

              <td>
                {p.package || "-"}
              </td>

              <td>
                {moneyStatic(price)}
              </td>

              <td className="commission">
                {moneyStatic(commission)}
              </td>

              {admin && (
                <td className="poyraz">
                  {moneyStatic(remaining)}
                </td>
              )}

              <td>
                {p.agency || "-"}
              </td>

              <td>
                {p.status || "AKTİF"}
              </td>

            </tr>
          );
        })}

      </tbody>

    </table>
  );
}

function moneyStatic(value: number) {
  return (
    value.toLocaleString("tr-TR") +
    " TL"
  );
}