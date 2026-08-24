"use client";

import { useState } from "react";


export default function PolicePage() {


const [customer,setCustomer] = useState("");
const [phone,setPhone] = useState("");
const [tc,setTc] = useState("");
const [plate,setPlate] = useState("");
const [vehicle,setVehicle] = useState("");

const [startDate,setStartDate] = useState("");
const [endDate,setEndDate] = useState("");

const [pack,setPack] = useState("GOLD");

const [message,setMessage] = useState("");
const [lastPolicy,setLastPolicy] = useState<any>(null);
const box = {
width:"100%",
padding:"12px",
margin:"8px 0",
borderRadius:"10px",
border:"1px solid #ddd"
};


const packBox = {
padding:"20px",
borderRadius:"15px",
border:"1px solid #ccc",
background:"white",
cursor:"pointer",
fontSize:"16px"
};


const selectBox = {
...packBox,
border:"3px solid #0c416d",
background:"#eaf3ff"
};



function savePolicy(){


const policy = {

id:
"POYRAZ-" + Date.now(),

customer,

phone,

tc,

plate,

vehicle,

package:pack,

price:
pack === "STAR"
?
1500
:
pack === "GOLD"
?
1250
:
1000,

startDate,

endDate,

date:
new Date()
.toLocaleDateString("tr-TR")

};



const old =
localStorage.getItem(
"poyraz_policies"
);


const list =
old
?
JSON.parse(old)
:
[];


list.push(policy);


localStorage.setItem(
"poyraz_policies",
JSON.stringify(list)
);
setLastPolicy(policy);



setMessage(
"✅ Poliçe oluşturuldu"
);


}



return (

<div
style={{
padding:"40px",
maxWidth:"900px",
margin:"auto",
fontFamily:"Arial",
background:"#f5f7fb",
minHeight:"100vh"
}}
>


<h1
style={{
color:"#0c416d",
textAlign:"center"
}}
>
🧾 Poyraz Asist Poliçe Üret
</h1>



<div
style={{
background:"white",
padding:"30px",
borderRadius:"20px",
boxShadow:"0 5px 20px #ddd"
}}
>


<h2>
👤 Müşteri Bilgileri
</h2>


<input
style={box}
placeholder="Ad Soyad"
value={customer}
onChange={e=>setCustomer(e.target.value)}
/>


<input
style={box}
placeholder="Telefon"
value={phone}
onChange={e=>setPhone(e.target.value)}
/>


<input
style={box}
placeholder="TC / VKN"
value={tc}
onChange={e=>setTc(e.target.value)}
/>


<h2>
🚗 Araç Bilgileri
</h2>


<input
style={box}
placeholder="Plaka"
value={plate}
onChange={e=>setPlate(e.target.value)}
/>


<input
style={box}
placeholder="Araç Marka Model"
value={vehicle}
onChange={e=>setVehicle(e.target.value)}
/>



<h2>
📅 Poliçe Tarihleri
</h2>


<div
style={{
display:"flex",
gap:"20px"
}}
>


<input
style={box}
type="date"
value={startDate}
onChange={e=>setStartDate(e.target.value)}
/>


<input
style={box}
type="date"
value={endDate}
onChange={e=>setEndDate(e.target.value)}
/>


</div>



<h2>
📦 Paket Seçimi
</h2>



<div
style={{
display:"flex",
gap:"15px"
}}
>


<button
style={pack==="STAR"?selectBox:packBox}
onClick={()=>setPack("STAR")}
>
⭐
<br/>
<b>STAR</b>
<br/>
1500 TL
</button>



<button
style={pack==="GOLD"?selectBox:packBox}
onClick={()=>setPack("GOLD")}
>
🥇
<br/>
<b>GOLD</b>
<br/>
1250 TL
</button>



<button
style={pack==="PLAT"?selectBox:packBox}
onClick={()=>setPack("PLAT")}
>
💎
<br/>
<b>PLAT</b>
<br/>
1000 TL
</button>


</div>



<p>
Seçilen Paket:
<b>{pack}</b>
</p>



<button
style={{
width:"100%",
padding:"16px",
background:"#0c416d",
color:"white",
border:"0",
borderRadius:"12px",
fontSize:"18px",
cursor:"pointer"
}}
onClick={savePolicy}
>

🧾 POLİÇE OLUŞTUR

</button>


<h3>
{message}
</h3>
{
lastPolicy && (

<div
style={{
marginTop:"25px",
padding:"25px",
background:"white",
borderRadius:"15px",
boxShadow:"0 4px 15px #ddd"
}}
>

<h2>
✅ Poliçe Oluşturuldu
</h2>


<p>
<b>Poliçe No:</b>
{lastPolicy.id}
</p>


<p>
<b>Müşteri:</b>
{lastPolicy.customer}
</p>


<p>
<b>TC/VKN:</b>
{lastPolicy.tc}
</p>


<p>
<b>Plaka:</b>
{lastPolicy.plate}
</p>


<p>
<b>Araç:</b>
{lastPolicy.vehicle}
</p>


<p>
<b>Paket:</b>
{lastPolicy.package}
</p>


<p>
<b>Fiyat:</b>
{lastPolicy.price} TL
</p>


<p>
<b>Tarih:</b>
{lastPolicy.startDate}
-
{lastPolicy.endDate}
</p>


</div>

)
}


</div>


</div>

);


}