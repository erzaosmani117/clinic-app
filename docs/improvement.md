# Improvement Report

## Improvement 1 — Reusable Navbar

**Problemi**  
Kodi i navbar-it ishte i duplikuar në disa faqe React (DosageHome, DosageDrugList, DosageCalculator, DosageHistory, PatientDashboard, DoctorDashboard).  
Çdo ndryshim kërkonte modifikime në shumë vende dhe rritej rreziku për inconsistencies.

**Ndryshimi**  
U krijua një komponent i vetëm `Navbar.jsx` në `components/`, i cili përdoret në të gjitha faqet.  
Komponenti pranon props për rolin e përdoruesit dhe linket aktive.

**Pse është më mirë**  
- Eliminon duplikimin e kodit  
- Thjeshton mirëmbajtjen  
- Siguron UI konsistente në gjithë aplikacionin  

---

## Improvement 2 — Confirm Password Validation

**Problemi**  
Forma e regjistrimit nuk përfshinte konfirmimin e password-it.  
Përdoruesi mund të regjistrohej me një password të shkruar gabim pa e kuptuar.

**Ndryshimi**  
U shtua fusha “Confirm Password” në `Register.jsx` dhe validim që siguron përputhjen e dy fushave para submit-it.

**Pse është më mirë**  
- Redukton gabimet gjatë regjistrimit  
- Përmirëson UX  
- Është praktikë standarde në sistemet e autentifikimit  

---

## Improvement 3 — Clarification of “Pending” Status

**Problemi**  
Statusi “pending” në appointments nuk ishte i qartë për përdoruesin.  
Nuk kishte asnjë shpjegim për kuptimin e tij.

**Ndryshimi**  
U shtua një tooltip/mesazh informues me tekstin:  
“Waiting for doctor confirmation”.

**Pse është më mirë**  
- Redukton konfuzionin  
- E bën sistemin më transparent për përdoruesin  
- Përmirëson UX  

---

## Improvement 4 — Backend Validation & Authorization for Appointment Booking

**Problemi**  
Backend validonte `doctor_id` vetëm me `exists:users,id`,  
duke lejuar që pacienti të rezervojë takim me çdo përdorues (edhe pacient apo admin).

**Ndryshimi**  
Validimi u përmirësua duke përdorur:  
`Rule::exists(...)->where(role='doctor')`  
kështu që pranohen vetëm ID të përdoruesve me rol doktor.

Gjithashtu u shtua një feature test `AppointmentBookingAuthorizationTest` që verifikon:
- sukses për doktor valid (201)  
- dështim për pacient (422)  
- dështim për admin (422)  

**Pse është më mirë**  
- Garantohen kufizimet e rolit në nivel backend  
- Ruhet integriteti i të dhënave  
- Rritet besueshmëria përmes testimit automatik  

---

## Improvement 5 — Manual Refresh for Appointments

**Problemi**  
Lista e appointments nuk përditësohej gjithmonë automatikisht dhe nuk kishte feedback për përdoruesin.

**Ndryshimi**  
U shtua një buton për rifreskim manual në dashboard-in e pacientit që ri-ngarkon të dhënat.

**Pse është më mirë**  
- Jep kontroll më të madh përdoruesit  
- Shmang perceptimin e sistemit si “i bllokuar”  
- Përmirëson reliability nga perspektiva e UX  

---

## What Remains Weak

- Mungon pagination për lista të mëdha të dhënash  
- Token-et e autentifikimit nuk kanë expiry  
- Test coverage është i kufizuar  
- Validimi në frontend nuk është gjithmonë i plotë  