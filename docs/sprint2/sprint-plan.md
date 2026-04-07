# Sprint 2 Plan — Erza Osmani
Data: 1 Prill 2026

## Gjendja Aktuale

### Çka funksionon tani
- Struktura full-stack e projektit:
  - Backend (Laravel REST API)
  - Frontend (React + Vite + Tailwind)
- Autentifikimi me Laravel Sanctum (token-based)
- Regjistrimi dhe login për pacient dhe doktor
- Menaxhimi i përdoruesve me role (patient / doctor)
- CRUD për appointments:
  - Krijimi i termineve
  - Shikimi i termineve (patient & doctor)
- Lidhja frontend-backend përmes Axios
- Routing në frontend (React Router)
- Strukturë e databazës:
  - users
  - appointments
  - drugs
  - dosage_history

### Çka nuk funksionon / është në zhvillim
- Moduli i dosage calculator nuk është plotësisht i implementuar
- Nuk ka validim të plotë për input-et (peshë, moshë, zgjedhje ilaçi)
- Nuk ka implementim të plotë të contraindications
- Error handling është i kufizuar
- UI nuk jep feedback të mjaftueshëm për gabime
- Ruajtja dhe shfaqja e dosage_history nuk është e kompletuar

### A kompajlohet dhe ekzekutohet programi?
Po — aplikacioni ekzekutohet dhe funksionon në mënyrë bazike.

---

## Plani i Sprintit

### Feature e Re

**1. Home Page**
Faqja kryesore e aplikacionit që shfaqet para login-it.
- Prezanton MediCore dhe qëllimin e sistemit
- Shfaq informacion të shkurtër për shërbimet e klinikës
- Buton për Register dhe Login
- E aksesueshme nga të gjithë pa autentifikim

**2. Implementimi i Dosage Calculator për pediatri (core feature)**
Ky feature do të mundësojë:
- Doktori të:
  - fusë peshën (kg) dhe moshën e pacientit
  - zgjedhë një ilaç nga lista
- Sistemi të:
  - llogarisë dozën bazuar në rregullat mg/kg
  - kontrollojë kufirin maksimal të dozës
  - shfaqë rezultatin final
  - shfaqë paralajmërime për contraindications

**Si përdoret nga user:**
- Doktori hyn në dashboard
- Plotëson formularin për llogaritje
- Klikon "Calculate"
- Sistemi kthen dozën dhe warnings

**Feature shtesë:**
- Ruajtja e kalkulimeve në `dosage_history`
- Shfaqja e historisë së kalkulimeve

---

### Future Enhancement (jo pjesë e këtij sprinti)
**Shtimi i rolit Admin**
Në të ardhmen planifikohet implementimi i një roli të ri:
- **Admin** do të ketë mundësi:
  - Menaxhimi i përdoruesve (create/update/delete)
  - Menaxhimi i doktorëve dhe role-ve
  - Menaxhimi i ilaçeve dhe kategorive (drug_categories, drugs)
  - Monitorimi i aktivitetit në sistem

Ky rol nuk do të implementohet në këtë sprint për të ruajtur fokusin në
feature kryesore (dosage calculator dhe home page), por është pjesë e
planit të zgjerimit të sistemit.

---

### Error Handling
Rastet kryesore që do të trajtohen:

1. **Input invalid (peshë ose moshë jo valide)**
   - Validim në frontend dhe backend
   - Refuzim me mesazh të qartë

2. **Doza tejkalon maksimumin e lejuar**
   - Sistemi kufizon dozën dhe shfaq warning

3. **Drug nuk ekziston ose mungojnë të dhënat**
   - Kontroll në backend dhe kthim i error-it të strukturuar

---

### Teste
Metodat që do të testohen:
- Logjika e dosage calculation
- Ruajtja në `dosage_history`
- CRUD për appointments
- Endpoint-et e autentifikimit

Raste kufitare:
- Peshë = 0 ose negative
- Mosha jashtë intervalit
- Doza mbi limit
- Input bosh
- Request pa token
- Ilaç jo ekzistues

---

## Afati
- Deadline: Martë, 8 Prill 2026, ora 08:30