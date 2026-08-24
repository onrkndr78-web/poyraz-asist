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
  id: string;
  policyNumber: string;
  customerName: string;
  customerPhone: string;
  customerIdentity: string;
  vehiclePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  startDate: string;
  endDate: string;
  premium: number;
  commission: number;
  commissionRate: number;
  agencyId: string;
  agencyName: string;
  createdAt: string;
};

export default function NewPolicyPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(
    null
  );

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerIdentity: "",
    vehiclePlate: "",
    vehicleBrand: "",
    vehicleModel: "",
    startDate: "",
    endDate: "",
    premium: "",
  });

  const [saving, setSaving] = useState(false);

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
    } catch {
      router.push("/login");
    }
  }, [router]);

  function handleChange(
    field: keyof typeof form,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function calculateCommission() {
    const premium =
      Number(form.premium) || 0;

    const rate =
      Number(
        user?.commissionRate
      ) || 35;

    return (premium * rate) / 100;
  }

  function calculatePoyrazIncome() {
    const premium =
      Number(form.premium) || 0;

    return (
      premium -
      calculateCommission()
    );
  }

  function generatePolicyNumber() {
    const now = new Date();

    const year =
      now.getFullYear();

    const random = Math.floor(
      100000 +
        Math.random() * 900000
    );

    return `PA-${year}-${random}`;
  }

  function savePolicy() {
    if (!user) {
      alert(
        "Kullanıcı bilgisi bulunamadı."
      );
      return;
    }

    if (
      !form.customerName.trim()
    ) {
      alert(
        "Müşteri adını giriniz."
      );
      return;
    }

    if (
      !form.customerPhone.trim()
    ) {
      alert(
        "Müşteri telefonunu giriniz."
      );
      return;
    }

    if (
      !form.vehiclePlate.trim()
    ) {
      alert(
        "Araç plakasını giriniz."
      );
      return;
    }

    if (!form.startDate) {
      alert(
        "Poliçe başlangıç tarihini seçiniz."
      );
      return;
    }

    if (!form.endDate) {
      alert(
        "Poliçe bitiş tarihini seçiniz."
      );
      return;
    }

    if (
      new Date(form.endDate) <=
      new Date(form.startDate)
    ) {
      alert(
        "Bitiş tarihi başlangıç tarihinden sonra olmalıdır."
      );
      return;
    }

    const premium =
      Number(form.premium);

    if (
      Number.isNaN(premium) ||
      premium <= 0
    ) {
      alert(
        "Geçerli bir satış bedeli giriniz."
      );
      return;
    }

    setSaving(true);

    const commissionRate =
      Number(
        user.commissionRate
      ) || 35;

    const commission =
      (premium *
        commissionRate) /
      100;

    const newPolicy: Policy = {
      id:
        Date.now().toString() +
        Math.random()
          .toString(36)
          .substring(2, 8),

      policyNumber:
        generatePolicyNumber(),

      customerName:
        form.customerName.trim(),

      customerPhone:
        form.customerPhone.trim(),

      customerIdentity:
        form.customerIdentity.trim(),

      vehiclePlate:
        form.vehiclePlate
          .trim()
          .toUpperCase(),

      vehicleBrand:
        form.vehicleBrand.trim(),

      vehicleModel:
        form.vehicleModel.trim(),

      startDate:
        form.startDate,

      endDate:
        form.endDate,

      premium,

      commission,

      commissionRate,

      agencyId:
        user.agencyId || "",

      agencyName:
        user.agencyName ||
        user.username ||
        "",

      createdAt:
        new Date().toISOString(),
    };

    try {
      const saved =
        localStorage.getItem(
          "poyraz_policies"
        );

      let policies: Policy[] = [];

      if (saved) {
        const parsed =
          JSON.parse(saved);

        if (Array.isArray(parsed)) {
          policies = parsed;
        }
      }

      policies.push(newPolicy);

      localStorage.setItem(
        "poyraz_policies",
        JSON.stringify(policies)
      );

      alert(
        `Poliçe başarıyla oluşturuldu.\n\nPoliçe No: ${newPolicy.policyNumber}`
      );

      router.push(
        "/acente/policies"
      );
    } catch {
      alert(
        "Poliçe kaydedilirken bir hata oluştu."
      );

      setSaving(false);
    }
  }

  if (!user) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          fontFamily:
            "Arial, sans-serif",
        }}
      >
        Yükleniyor...
      </main>
    );
  }

  const commission =
    calculateCommission();

  const poyrazIncome =
    calculatePoyrazIncome();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        fontFamily:
          "Arial, sans-serif",
      }}
    >
      {/* ÜST BAR */}
      <header
        style={{
          background:
            "#0b2d4d",
          color: "white",
          padding:
            "18px 30px",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          gap: "15px",
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
            Yeni Poliçe
          </div>
        </div>

        <button
          onClick={() =>
            router.push(
              "/acente"
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
              "10px 16px",
            fontWeight:
              "700",
            cursor:
              "pointer",
          }}
        >
          ← Acente Paneli
        </button>
      </header>

      <div
        style={{
          maxWidth:
            "1100px",
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
            📄 Yeni Poliçe
          </h1>

          <p
            style={{
              color:
                "#718096",
              marginTop:
                "8px",
            }}
          >
            Müşteri ve poliçe
            bilgilerini girerek
            yeni satış oluşturun.
          </p>
        </div>

        {/* MÜŞTERİ BİLGİLERİ */}
        <section
          style={
            sectionStyle
          }
        >
          <SectionTitle>
            👤 Müşteri Bilgileri
          </SectionTitle>

          <div
            style={gridStyle}
          >
            <Input
              label="Müşteri Ad Soyad *"
              value={
                form.customerName
              }
              onChange={(value) =>
                handleChange(
                  "customerName",
                  value
                )
              }
              placeholder="Ad Soyad"
            />

            <Input
              label="Telefon *"
              value={
                form.customerPhone
              }
              onChange={(value) =>
                handleChange(
                  "customerPhone",
                  value
                )
              }
              placeholder="05XX XXX XX XX"
            />

            <Input
              label="TC / Vergi No"
              value={
                form.customerIdentity
              }
              onChange={(value) =>
                handleChange(
                  "customerIdentity",
                  value
                )
              }
              placeholder="TC veya Vergi No"
            />
          </div>
        </section>

        {/* ARAÇ BİLGİLERİ */}
        <section
          style={
            sectionStyle
          }
        >
          <SectionTitle>
            🚗 Araç Bilgileri
          </SectionTitle>

          <div
            style={gridStyle}
          >
            <Input
              label="Plaka *"
              value={
                form.vehiclePlate
              }
              onChange={(value) =>
                handleChange(
                  "vehiclePlate",
                  value
                )
              }
              placeholder="81 ABC 123"
            />

            <Input
              label="Marka"
              value={
                form.vehicleBrand
              }
              onChange={(value) =>
                handleChange(
                  "vehicleBrand",
                  value
                )
              }
              placeholder="Örn: Volkswagen"
            />

            <Input
              label="Model"
              value={
                form.vehicleModel
              }
              onChange={(value) =>
                handleChange(
                  "vehicleModel",
                  value
                )
              }
              placeholder="Örn: Passat"
            />
          </div>
        </section>

        {/* POLİÇE BİLGİLERİ */}
        <section
          style={
            sectionStyle
          }
        >
          <SectionTitle>
            📅 Poliçe Bilgileri
          </SectionTitle>

          <div
            style={gridStyle}
          >
            <Input
              label="Başlangıç Tarihi *"
              type="date"
              value={
                form.startDate
              }
              onChange={(value) =>
                handleChange(
                  "startDate",
                  value
                )
              }
            />

            <Input
              label="Bitiş Tarihi *"
              type="date"
              value={
                form.endDate
              }
              onChange={(value) =>
                handleChange(
                  "endDate",
                  value
                )
              }
            />

            <Input
              label="Satış Bedeli / Prim *"
              type="number"
              value={
                form.premium
              }
              onChange={(value) =>
                handleChange(
                  "premium",
                  value
                )
              }
              placeholder="1250"
            />
          </div>
        </section>

        {/* FİNANSAL ÖZET */}
        <section
          style={{
            ...sectionStyle,
            background:
              "#f8fafc",
          }}
        >
          <SectionTitle>
            💰 Finansal Özet
          </SectionTitle>

          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap:
                "15px",
            }}
          >
            <MoneyBox
              title="Satış Bedeli"
              value={
                money(
                  Number(
                    form.premium
                  ) || 0
                )
              }
            />

            <MoneyBox
              title={`Acente Komisyonu (%${
                Number(
                  user.commissionRate
                ) || 35
              })`}
              value={money(
                commission
              )}
            />

            <MoneyBox
              title="Poyraz Asist'e Kalan"
              value={money(
                poyrazIncome
              )}
            />
          </div>
        </section>

        {/* KAYDET */}
        <div
          style={{
            display:
              "flex",
            justifyContent:
              "flex-end",
            gap: "10px",
            marginTop:
              "20px",
          }}
        >
          <button
            onClick={() =>
              router.push(
                "/acente"
              )
            }
            style={
              cancelButtonStyle
            }
          >
            Vazgeç
          </button>

          <button
            onClick={
              savePolicy
            }
            disabled={
              saving
            }
            style={{
              ...saveButtonStyle,
              opacity:
                saving
                  ? 0.7
                  : 1,
              cursor:
                saving
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {saving
              ? "⏳ Kaydediliyor..."
              : "💾 Poliçeyi Kaydet"}
          </button>
        </div>
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
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label
        style={{
          display:
            "block",
          marginBottom:
            "7px",
          color:
            "#334e68",
          fontSize:
            "13px",
          fontWeight:
            "700",
        }}
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        placeholder={
          placeholder
        }
        style={{
          width:
            "100%",
          boxSizing:
            "border-box",
          padding:
            "12px 13px",
          border:
            "1px solid #d9e2ec",
          borderRadius:
            "8px",
          fontSize:
            "14px",
          outline:
            "none",
          background:
            "white",
        }}
      />
    </div>
  );
}

function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h2
      style={{
        marginTop:
          0,
        marginBottom:
          "20px",
        color:
          "#102a43",
        fontSize:
          "19px",
      }}
    >
      {children}
    </h2>
  );
}

function MoneyBox({
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
        border:
          "1px solid #e1e7ee",
        borderRadius:
          "10px",
        padding:
          "18px",
      }}
    >
      <div
        style={{
          color:
            "#718096",
          fontSize:
            "12px",
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
            "21px",
          fontWeight:
            "800",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function money(
  value: number
) {
  return (
    value.toLocaleString(
      "tr-TR",
      {
        minimumFractionDigits:
          2,
        maximumFractionDigits:
          2,
      }
    ) + " TL"
  );
}

const sectionStyle: React.CSSProperties =
  {
    background:
      "white",
    borderRadius:
      "14px",
    padding:
      "25px",
    marginBottom:
      "20px",
    boxShadow:
      "0 4px 18px rgba(0,0,0,0.06)",
  };

const gridStyle: React.CSSProperties =
  {
    display:
      "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap:
      "18px",
  };

const cancelButtonStyle: React.CSSProperties =
  {
    background:
      "#edf2f7",
    color:
      "#334e68",
    border:
      "none",
    borderRadius:
      "8px",
    padding:
      "13px 20px",
    fontWeight:
      "700",
    cursor:
      "pointer",
  };

const saveButtonStyle: React.CSSProperties =
  {
    background:
      "#0b2d4d",
    color:
      "white",
    border:
      "none",
    borderRadius:
      "8px",
    padding:
      "13px 22px",
    fontWeight:
      "700",
    cursor:
      "pointer",
  };