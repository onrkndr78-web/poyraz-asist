"use client";

import { useEffect, useState } from "react";

type Policy = {
  id:string;
  customer?:string;
  package?:string;
  price?:number;
  commission?:number;
  agency?:string;
  date?:string;
};


type Agency = {
  id:string;
  name:string;
  username:string;
  password:string;
  active:boolean;
  commission:number;
};


export default function YoneticiPage(){

const [policies,setPolicies] =
useState<Policy[]>([]);

const [agencies,setAgencies] =
useState<Agency[]>([]);


const [name,setName] =
useState("");

const [username,setUsername] =
useState("");

const [password,setPassword] =
useState("");



useEffect(()=>{

const p =
localStorage.getItem(
"poyraz_policies"
);

const a =
localStorage.getItem(
"poyraz_agencies"
);


if(p){
setPolicies(JSON.parse(p));
}


if(a){
setAgencies(JSON.parse(a));
}


},[]);



function addAgency(){

if(
!name ||
!username ||
!password
){
alert("Bilgileri doldurun");
return;
}


const agency = {

id:
"AC"+
Math.floor(
100000+
Math.random()*900000
),

name,

username,

password,

active:true,

commission:450

};


const updated=[
...agencies,
agency
];


setAgencies(updated);


localStorage.setItem(
"poyraz_agencies",
JSON.stringify(updated)
);


setName("");
setUsername("");
setPassword("");


alert("Acente oluşturuldu");

}



function toggleAgency(id:string){


const updated =
agencies.map(a=>

a.id===id
?
{
...a,
active:!a.active
}
:
a

);


setAgencies(updated);


localStorage.setItem(
"poyraz_agencies",
JSON.stringify(updated)
);


}



const sales =
policies.reduce(
(t,p)=>
t+(p.price||0),
0
);


const commission =
policies.reduce(
(t,p)=>
t+(p.commission||450),
0
);



return (

<main className="page">

<h1>
POYRAZ ASİST
</h1>

<p>
Yönetici Paneli
</p>


<div className="cards">


<div className="card">
🏢
<small>
Acente
</small>
<strong>
{agencies.length}
</strong>
</div>


<div className="card">
🧾
<small>
Poliçe
</small>
<strong>
{policies.length}
</strong>
</div>


<div className="card">
💰
<small>
Satış
</small>
<strong>
{sales.toLocaleString("tr-TR")} TL
</strong>
</div>


<div className="card">
🤝
<small>
Komisyon
</small>
<strong>
{commission.toLocaleString("tr-TR")} TL
</strong>
</div>


</div>
<section className="panel">

<h2>
➕ Yeni Acente Ekle
</h2>


<input
placeholder="Acente adı"
value={name}
onChange={(e)=>
setName(e.target.value)
}
/>


<input
placeholder="Kullanıcı adı"
value={username}
onChange={(e)=>
setUsername(e.target.value)
}
/>


<input
placeholder="Şifre"
value={password}
onChange={(e)=>
setPassword(e.target.value)
}
/>


<button
onClick={addAgency}
>
ACENTE OLUŞTUR
</button>


</section>



<section className="panel">

<h2>
🏢 Acente Listesi
</h2>


<table>

<thead>

<tr>
<th>Acente</th>
<th>Kullanıcı</th>
<th>Durum</th>
<th>İşlem</th>
</tr>

</thead>


<tbody>

{agencies.map(a=>(

<tr key={a.id}>

<td>
{a.name}
</td>


<td>
{a.username}
</td>


<td>

{a.active
?
"AKTİF"
:
"PASİF"}

</td>


<td>

<button
onClick={()=>
toggleAgency(a.id)
}
>

Değiştir

</button>

</td>


</tr>

))}

</tbody>

</table>


</section>



<section className="panel">

<h2>
🧾 Poliçeler
</h2>


<table>

<thead>

<tr>

<th>No</th>
<th>Müşteri</th>
<th>Paket</th>
<th>Acente</th>
<th>Tutar</th>

</tr>

</thead>


<tbody>

{policies.map(p=>(

<tr key={p.id}>

<td>
{p.id}
</td>

<td>
{p.customer}
</td>

<td>
{p.package}
</td>

<td>
{p.agency}
</td>

<td>
{(p.price||0).toLocaleString("tr-TR")} TL
</td>

</tr>

))}

</tbody>


</table>


</section>



<style jsx>{`

.page{
min-height:100vh;
background:#f4f7fb;
padding:35px;
font-family:Arial;
color:#172b4d;
}


h1{
background:#071a32;
color:white;
padding:25px;
border-radius:15px;
}


.cards{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:20px;
margin:25px 0;
}


.card,
.panel{
background:white;
padding:25px;
border-radius:15px;
margin-bottom:25px;
box-shadow:0 5px 20px rgba(0,0,0,.08);
}


.card{
font-size:25px;
}


.card small{
display:block;
font-size:13px;
color:#718096;
margin-top:10px;
}


.card strong{
display:block;
font-size:25px;
color:#0c416d;
margin-top:8px;
}


input{
display:block;
width:100%;
max-width:400px;
padding:12px;
margin:10px 0;
border:1px solid #ddd;
border-radius:8px;
}


button{
background:#0c416d;
color:white;
border:0;
padding:10px 15px;
border-radius:8px;
cursor:pointer;
}


table{
width:100%;
border-collapse:collapse;
}


th{
background:#f4f7fb;
padding:12px;
text-align:left;
}


td{
padding:12px;
border-bottom:1px solid #eee;
}


@media(max-width:900px){

.cards{
grid-template-columns:1fr 1fr;
}

}

`}</style>


</main>

);

}