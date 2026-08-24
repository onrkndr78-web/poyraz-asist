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

const COMMISSION = 450;

export default function AgencyPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    loadPolicies();
  }, []);

  function loadPolicies() {
    try {
      const data = localStorage.getItem("poyraz_policies");

      if (data) {
        const parsed = JSON.parse(data);

        if (Array.isArray(parsed)) {
          setPolicies(parsed);
          return;
        }
      }

      setPolicies([]);
    } catch {
      setPolicies([]);
    }
  }

  const myPolicies = useMemo(() => {
    return policies.filter(
      (p) =>
        !p.agency ||
        p.agency === "GKN Kibar Sigorta"
    );
  }, [policies]);

  const totalCommission = myPolicies.reduce(
    (total, p) =>
      total +
      (typeof p.commission === "number"
        ? p.commission
        : COMMISSION),
    0
  );

  const totalSales = myPolicies.reduce(
    (total, p) =>
      total +
      (typeof p.price === "number"
        ? p.price
        : 0),
    0
  );

  const customers = Array.from(
    new Map(
      myPolicies.map((p) => [
        p.tc || p.phone || p.customer,
        p,
      ])
    ).values()
  );

  function money(value: number) {
    return (
      value.toLocaleString("tr-TR") +
      " TL"
    );
  }

  function goPolice() {
    window.location.href =
      "/acente/police";
  }

  return (
    <main className="app">

      <aside className="sidebar">

        <div className="logo">
          POYRAZ <span>ASİST</span>
        </div>

        <div className="agencyBox">
          🏢 GKN KİBAR SİGORTA
          <small>GKN001</small>
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
            🏠 Dashboard
          </button>

          <button
            className="menu produce"
            onClick={goPolice}
          >
            🧾 Poliçe Üret
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
            📋 Poliçelerim
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
            👥 Müşterilerim
          </button>

          <button
            className={
              activePage === "commission"
                ? "menu active"
                : "menu"
            }
            onClick={() =>
              setActivePage("commission")
            }
          >
            💰 Komisyonlarım
          </button>

          <button
            className={
              activePage === "search"
                ? "menu active"
                : "menu"
            }
            onClick={() =>
              setActivePage("search")
            }
          >
            🔍 Poliçe Sorgula
          </button>

          <button
            className={
              activePage === "profile"
                ? "menu active"
                : "menu"
            }
            onClick={() =>
              setActivePage("profile")
            }
          >
            👤 Acente Bilgilerim
          </button>

        </nav>

        <div className="bottom">

          <button
            className="menu"
            onClick={() =>
              window.location.href =
                "/giris"
            }
          >
            🚪 Çıkış
          </button>

        </div>

      </aside>


      <section className="content">

        <header className="topbar">

          <div>
            <strong>
              GKN Kibar Sigorta
            </strong>

            <small>
              Poyraz Asist Acente Paneli
            </small>
          </div>

          <button
            className="topButton"
            onClick={goPolice}
          >
            🧾 Yeni Poliçe
          </button>

        </header>


        {activePage === "dashboard" && (

          <div className="page">

            <h1>
              Hoş Geldiniz 👋
            </h1>

            <p className="subtitle">
              Acente satış ve poliçe özetiniz.
            </p>

            <div className="cards">

              <Card
                icon="🧾"
                title="Poliçelerim"
                value={
                  myPolicies.length.toString()
                }
              />

              <Card
                icon="💵"
                title="Toplam Satış"
                value={money(totalSales)}
              />

              <Card
                icon="🤝"
                title="Toplam Komisyon"
                value={money(totalCommission)}
              />

              <Card
                icon="👥"
                title="Müşterilerim"
                value={
                  customers.length.toString()
                }
              />

            </div>

            <div className="panel">

              <div className="panelHeader">

                <div>
                  <h2>
                    Son Poliçelerim
                  </h2>

                  <p>
                    Son oluşturduğunuz
                    poliçeler.
                  </p>
                </div>

                <button
                  className="refresh"
                  onClick={loadPolicies}
                >
                  🔄 Yenile
                </button>

              </div>

              {myPolicies.length === 0 ? (

                <div className="empty">

                  Henüz poliçe üretmediniz.

                  <button
                    onClick={goPolice}
                  >
                    İlk Poliçeyi Üret
                  </button>

                </div>

              ) : (

                <PolicyTable
                  policies={
                    myPolicies.slice(0, 8)
                  }
                />

              )}

            </div>

          </div>

        )}


        {activePage === "policies" && (

          <div className="page">

            <h1>
              📋 Poliçelerim
            </h1>

            <p className="subtitle">
              Ürettiğiniz tüm poliçeler.
            </p>

            <div className="panel">

              {myPolicies.length === 0 ? (

                <div className="empty">
                  Henüz poliçeniz bulunmuyor.
                </div>

              ) : (

                <PolicyTable
                  policies={myPolicies}
                />

              )}

            </div>

          </div>

        )}


        {activePage === "customers" && (

          <div className="page">

            <h1>
              👥 Müşterilerim
            </h1>

            <p className="subtitle">
              Poliçe oluşturduğunuz müşteriler.
            </p>

            <div className="panel">

              {customers.length === 0 ? (

                <div className="empty">
                  Henüz müşteriniz bulunmuyor.
                </div>

              ) : (

                <table>

                  <thead>

                    <tr>
                      <th>Müşteri</th>
                      <th>Telefon</th>
                      <th>Plaka</th>
                      <th>Araç</th>
                      <th>Paket</th>
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
                            {p.plate || "-"}
                          </td>

                          <td>
                            {p.vehicle || "-"}
                          </td>

                          <td>
                            {p.package || "-"}
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
        {activePage === "commission" && (

          <div className="page">

            <h1>
              💰 Komisyonlarım
            </h1>

            <p className="subtitle">
              Ürettiğiniz poliçelerden kazandığınız
              komisyonlar.
            </p>

            <div className="cards">

              <Card
                icon="🤝"
                title="Toplam Komisyon"
                value={money(totalCommission)}
              />

              <Card
                icon="🧾"
                title="Poliçe Adedi"
                value={myPolicies.length.toString()}
              />

            </div>

            <div className="panel">

              <div className="panelHeader">

                <div>
                  <h2>
                    Komisyon Detayları
                  </h2>
                </div>

              </div>

              {myPolicies.length === 0 ? (

                <div className="empty">
                  Henüz komisyon kaydınız bulunmuyor.
                </div>

              ) : (

                <table>

                  <thead>

                    <tr>
                      <th>Poliçe No</th>
                      <th>Müşteri</th>
                      <th>Paket</th>
                      <th>Satış</th>
                      <th>Komisyon</th>
                      <th>Tarih</th>
                    </tr>

                  </thead>

                  <tbody>

                    {myPolicies.map((p) => (

                      <tr key={p.id}>

                        <td>
                          <b>{p.id}</b>
                        </td>

                        <td>
                          {p.customer || "-"}
                        </td>

                        <td>
                          {p.package || "-"}
                        </td>

                        <td>
                          {money(p.price || 0)}
                        </td>

                        <td className="commission">
                          {money(
                            typeof p.commission === "number"
                              ? p.commission
                              : COMMISSION
                          )}
                        </td>

                        <td>
                          {p.date || "-"}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              )}

            </div>

          </div>

        )}


        {activePage === "search" && (

          <SearchPage
            policies={myPolicies}
          />

        )}


        {activePage === "profile" && (

          <div className="page">

            <h1>
              👤 Acente Bilgilerim
            </h1>

            <p className="subtitle">
              Acente hesap bilgileriniz.
            </p>

            <div className="profile">

              <div className="profileIcon">
                🏢
              </div>

              <div>

                <h2>
                  GKN Kibar Sigorta
                </h2>

                <p>
                  Acente Kodu:
                  <b> GKN001</b>
                </p>

                <p>
                  Durum:
                  <span className="status">
                    AKTİF
                  </span>
                </p>

              </div>

            </div>

            <div className="infoBox">

              🔒 Acente hesabınız yalnızca
              kendi poliçe, müşteri ve
              komisyon bilgilerinize erişebilir.

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
          display: flex;
          flex-direction: column;
        }

        .logo {
          font-size: 23px;
          font-weight: 900;
          padding: 0 12px;
        }

        .logo span {
          color: #f5a900;
        }

        .agencyBox {
          margin: 25px 5px 20px;
          padding: 15px;
          background: #102b4a;
          border-radius: 10px;
          font-size: 13px;
          font-weight: bold;
        }

        .agencyBox small {
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
          padding: 13px 14px;
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

        .menu.produce {
          background: #f5a900;
          color: #071a32;
          margin-bottom: 8px;
        }

        .menu.produce:hover {
          background: #ffb91f;
        }

        .bottom {
          margin-top: auto;
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
          font-size: 15px;
        }

        .topbar small {
          display: block;
          color: #718096;
          margin-top: 4px;
        }

        .topButton {
          border: 0;
          background: #0c416d;
          color: white;
          padding: 11px 18px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
        }

        .page {
          padding: 35px;
          max-width: 1400px;
          margin: auto;
        }

        h1 {
          margin: 0;
          font-size: 29px;
        }

        .subtitle {
          color: #718096;
          margin-top: 8px;
          margin-bottom: 25px;
        }

        .cards {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 25px;
        }

        .card {
          background: white;
          border-radius: 14px;
          padding: 22px;
          box-shadow:
            0 4px 20px rgba(0,0,0,.05);
        }

        .cardIcon {
          font-size: 27px;
        }

        .cardTitle {
          color: #718096;
          font-size: 13px;
          margin-top: 14px;
        }

        .cardValue {
          font-size: 24px;
          font-weight: 900;
          margin-top: 5px;
          color: #0c416d;
        }

        .panel {
          background: white;
          border-radius: 14px;
          padding: 25px;
          box-shadow:
            0 4px 20px rgba(0,0,0,.05);
          overflow-x: auto;
        }

        .panelHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .panelHeader h2 {
          margin: 0;
          font-size: 19px;
        }

        .panelHeader p {
          color: #718096;
          margin: 5px 0 0;
          font-size: 13px;
        }

        .refresh {
          border: 1px solid #d7e0e8;
          background: white;
          padding: 9px 13px;
          border-radius: 7px;
          cursor: pointer;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 700px;
        }

        th {
          text-align: left;
          background: #f7f9fb;
          color: #718096;
          font-size: 12px;
          padding: 13px;
        }

        td {
          padding: 15px 13px;
          border-bottom: 1px solid #edf1f5;
          font-size: 13px;
        }

        .commission {
          color: #16833a;
          font-weight: 900;
        }

        .empty {
          text-align: center;
          padding: 50px 20px;
          color: #718096;
        }

        .empty button {
          display: block;
          margin: 15px auto 0;
          border: 0;
          background: #0c416d;
          color: white;
          padding: 11px 18px;
          border-radius: 8px;
          cursor: pointer;
        }

        .profile {
          background: white;
          padding: 30px;
          border-radius: 14px;
          display: flex;
          gap: 20px;
          align-items: center;
          box-shadow:
            0 4px 20px rgba(0,0,0,.05);
        }

        .profileIcon {
          width: 65px;
          height: 65px;
          border-radius: 15px;
          background: #edf3f8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
        }

        .profile h2 {
          margin: 0 0 10px;
        }

        .profile p {
          color: #718096;
        }

        .status {
          color: #16833a;
          font-weight: bold;
          margin-left: 5px;
        }

        .infoBox {
          margin-top: 20px;
          background: #edf6ff;
          color: #315574;
          padding: 16px;
          border-radius: 10px;
        }

        @media(max-width: 1000px) {

          .cards {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

        @media(max-width: 700px) {

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

          .topbar {
            padding: 0 20px;
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


function PolicyTable({
  policies,
}: {
  policies: Policy[];
}) {
  return (
    <table>

      <thead>

        <tr>
          <th>Poliçe No</th>
          <th>Müşteri</th>
          <th>Plaka</th>
          <th>Paket</th>
          <th>Satış</th>
          <th>Komisyon</th>
          <th>Durum</th>
        </tr>

      </thead>

      <tbody>

        {policies.map((p) => (

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
              {(
                p.price || 0
              ).toLocaleString("tr-TR")} TL
            </td>

            <td className="commission">
              {(
                typeof p.commission === "number"
                  ? p.commission
                  : COMMISSION
              ).toLocaleString("tr-TR")} TL
            </td>

            <td>
              <span className="status">
                {p.status || "AKTİF"}
              </span>
            </td>

          </tr>

        ))}

      </tbody>

    </table>
  );
}


function SearchPage({
  policies,
}: {
  policies: Policy[];
}) {

  const [query, setQuery] =
    useState("");

  const results = policies.filter(
    (p) => {

      const q =
        query.toLowerCase().trim();

      if (!q) return true;

      return (
        p.id?.toLowerCase().includes(q) ||
        p.customer?.toLowerCase().includes(q) ||
        p.plate?.toLowerCase().includes(q) ||
        p.phone?.toLowerCase().includes(q)
      );
    }
  );

  return (

    <div className="page">

      <h1>
        🔍 Poliçe Sorgula
      </h1>

      <p className="subtitle">
        Poliçe no, müşteri, telefon veya
        plaka ile arama yapabilirsiniz.
      </p>

      <div className="panel">

        <input
          className="searchInput"
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          placeholder="Poliçe no / müşteri / telefon / plaka"
        />

        {results.length === 0 ? (

          <div className="empty">
            Sonuç bulunamadı.
          </div>

        ) : (

          <PolicyTable
            policies={results}
          />

        )}

      </div>

      <style jsx>{`

        .searchInput {
          width: 100%;
          padding: 14px;
          border: 1px solid #d8e0e8;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          outline: none;
        }

        .searchInput:focus {
          border-color: #0c416d;
        }

      `}</style>

    </div>

  );
}
