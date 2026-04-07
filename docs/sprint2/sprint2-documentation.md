Çka Përfundova
Feature Kryesore: Dosage Calculator + Dosage History
Implementova modulin e plotë të kalkulimit të dozave pediatrike, i cili është feature kryesore dhe unike e aplikacionit. Ky modul kalon nëpër të gjitha shtresat e arkitekturës:
UI → Controller → Service → Repository → Database
Konkretisht:

Doktori hyn në dashboard dhe klikon "Open Calculator"
Shfaqet një grid me kategori ilaçesh (Antibiotics, Respiratory, Fever & Pain, etj.) — secila me ikonë të veçantë
Doktori zgjedh kategorinë, pastaj ilaçin nga lista
Sistemet shfaq informacion të ilaçit (dose per kg, max single dose)
Doktori fut peshën (kg) dhe moshën (muaj) të pacientit
Backend-i llogarit dozën duke përdorur formulën mg/kg, kontrollon kufirin maksimal dhe kthen rezultatin
Nëse doza tejkalon maksimumin, sistemi e kufizon automatikisht dhe shfaq warning
Nëse pacienti është nën moshën minimale të rekomanduar, shfaqet age warning
Contraindications shfaqen me severity levels (low/moderate/high) me ngjyra të ndryshme
Çdo kalkulim ruhet automatikisht në dosage_history

DosageCalculatorService përmban të gjithë logjikën e kalkulimit — formula mg/kg, capping i dozës, kontrolli i moshës. Service-i nuk di asgjë për UI ose databazën, merr një Drug object dhe kthen rezultatin e kalkuluar.
Kërkim dhe Filtrim — Përmbush Kërkesën e Parë të Detyrës
Implementova kërkim dhe filtrim në disa vende të aplikacionit:

Kërkim i ilaçeve sipas emrit — në faqen DosageDrugList doktori mund të kërkojë ilaçin me emër në kohë reale. Ndërsa shkruan, lista filtrohet automatikisht
Filtrim i kategorive — pacienti filtron doktorët sipas specializimit (Pediatric Cardiology, General Pediatrics, etj.)
Filtrim i historisë së dozave sipas emrit të ilaçit — doktori kërkon në historik për një ilaç specifik
Filtrim i appointmenteve sipas datës dhe emrit të pacientit — doktori filtron listën e appointmenteve
Filtrim i CSV appointments sipas statusit — endpoint GET /api/file-appointments?status=confirmed kthen vetëm appointmentet me status të kërkuar

Të gjitha këto kalojnë nëpër shtresat UI → Service → Repository siç kërkohet.
Sortim — Përmbush Kërkesën e Tretë të Detyrës

Dosage History — doktori zgjedh renditjen "Newest first" ose "Oldest first"
Doctor Dashboard — appointmentet mund të renditen sipas datës në mënyrë rritëse ose zbritëse

Statistika — Përmbush Kërkesën e Dytë të Detyrës

Doctor Dashboard — shfaq numrin total të appointmenteve, appointmentet e sotme dhe ato të ardhshme
Dosage History — shfaq total kalkulimeve, numrin e dozave të kufizuara (capped), dhe ilaçin më të përdorur

Eksport — Përmbush Kërkesën e Katërt të Detyrës
Implementova buton "Export CSV" në faqen Dosage History. Kur doktori klikon, sistemi gjeneron një file CSV me të gjitha kalkulimet e filtruara (drug name, weight, age, dose, capped, date) dhe e shkarkon automatikisht në kompjuter. File emërtohet automatikisht me datën aktuale, për shembull dosage-history-2026-04-05.csv.
Profile i Userit — Feature Shtesë Relevante
Krijova faqe profili për të dyja rolet:

Pacienti mund të ruajë moshën (në muaj), peshën (kg) dhe alergjitë e njohura. Këto të dhëna lidhen drejtpërdrejt me feature-n e dosage calculation — doktori i sheh këto të dhëna kur llogarit dozën për pacientin
Doktori mund të vendosë specializimin dhe bio-n profesionale. Pacienti i filtron doktorët sipas specializimit kur rezervon appointment

Error Handling — Përmbush Kërkesën e Dytë të Detyrës
Implementova error handling në të gjitha shtresat:
Frontend (UI):

Validim i plotë i inputeve para dërgimit — pesha duhet të jetë numër pozitiv, mosha duhet të jetë numër i plotë, fushat e detyrueshme nuk mund të jenë bosh
Mesazhe të qarta për çdo rast: "Weight must be greater than 0", "Age cannot exceed 216 months", etj.
Try/catch në çdo API call me mesazhe të kuptueshme për userin
Retry button kur API dështon
Empty states kur lista është bosh
Loading states gjatë fetch

Backend:

Validim me Laravel Validator në çdo endpoint
404 kur drug/appointment nuk ekziston
403 kur roli nuk ka akses
422 me mesazhe të strukturuara kur input është invalid

FileRepository:

Kontroll nëse file ekziston para leximit
Krijim automatik i file nëse mungon
Try/catch rreth operacioneve të leximit/shkrimit

Arkitektura UI → Service → Repository
Feature kryesore e dosage calculation demonstron plotësisht këtë arkitekturë:

UI (React) — merr peshën dhe moshën nga doktori, dërgon te API
Controller — merr request-in dhe e kalon te Service
DosageCalculatorService — përmban logjikën e kalkulimit (mg/kg formula, capping, age warnings). Nuk di asgjë për UI ose databazën
Repository (AppointmentRepository, FileRepository) — menaxhon leximin dhe shkruemin e të dhënave
Database/CSV — ruajtja finale

Për demonstrim të plotë të Repository Pattern, ekzistojnë dy implementime të IRepository interface:

AppointmentRepository — punon me MySQL
FileRepository — punon me CSV file, me metodat GetAll, GetById, Add, Save, Delete

AppointmentService merr Repository si parameter (dependency injection) dhe përmban logjikën: List me filtrim sipas statusit, Add me validim, FindById.

Çka Mbeti
Admin Panel — Hapur për Sprint-in e Ardhshëm
Hapa strukturën fillestare të Admin Panel si përgatitje për sprint-in e ardhshëm. Aktualisht ekziston vetëm struktura e file-ve dhe disa endpoint teste, por logjika e plotë nuk është implementuar. Në sprint-in e ardhshëm planifikohet implementimi i plotë i rolit Admin me mundësi menaxhimi të doktorëve, pacientëve dhe ilaçeve.
Unit Tests
Pasi qe Laravel ka PHPUnit të integruar nuk pata nevojë të instalojë asgjë.
Thjesht krijova nje file: DosageCalculatorTest --unit dhe në të bëra 6 testime.
Test 1 Kalkulim normal — formula mg/kg punon saktë
Test 2 Doza kufizohet kur tejkalon maksimumim
Test 3 Age warning kur pacienti është shumë i vogël
Test 4 Contraindications kthehen korrekt
Test 5 Rast kufitar me peshë shumë të vogël
Test 6 Ilaç me dozë fikse punon saktë
Në folderin sprint2 ndodhet screenshot që verifikon se të gjitha testet punojnë.

Çka Mësova
Gjatë këtij sprinti mësova si funksionon Repository Pattern në praktikë — si ndihmon në ndarjen e logjikës nga burimi i të dhënave dhe si e njëjta logjikë mund të punojë me MySQL ose CSV pa ndryshuar asgjë në Service. Gjithashtu kuptova si të ndërtoj një feature komplekse si dosage calculator duke e ndarë në shtresa të pavarura, ku çdo shtresë ka një përgjegjësi të vetme dhe të qartë.




