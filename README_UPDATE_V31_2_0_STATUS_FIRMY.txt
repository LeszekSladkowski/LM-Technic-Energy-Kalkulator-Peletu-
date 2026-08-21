L&M TECHNIC ENERGY — EUROPEJSKI KALKULATOR PELETU 1.2 PREMIUM
AKTUALIZACJA V31.2.0 — STATUS FIRMY CRM MASTER
Data: 20.08.2026

WDROŻONE:
1. Duży, czytelny pasek STATUS FIRMY.
2. Statusy CRM: NOWY, AKTYWNY, DO KONTAKTU, KONTAKT NAWIĄZANY, KLIENT ZATWIERDZONY, DOSTAWCA ZATWIERDZONY, ARCHIWUM.
3. Powiększona tabela firm na pełną szerokość karty kraju.
4. Akcje w zatwierdzonej kolorystyce:
   - telefon: zielony laserowy,
   - mapa: niebieski laserowy,
   - szczegóły/lista: czerwony laserowy,
   - GENERUJ OFERTĘ: żółto-pomarańczowy.
5. Jasny kremowo-biały panel szczegółów firmy: adres, telefon, e-mail, WWW, źródło, notatka, daty i status.
6. Sekcja WIADOMOŚCI SPECJALNE — OD ASYSTENTA z pliku assistant-messages.json.
7. Trwały zapis statusów w localStorage telefonu.
8. KLIENT ZATWIERDZONY → automatyczna synchronizacja z tabelą KLIENCI.
9. DOSTAWCA ZATWIERDZONY → automatyczna synchronizacja z tabelą DOSTAWCY.
10. GENERUJ OFERTĘ → otwiera generator oferty i wybiera wskazaną firmę, jeśli jest już w bazie klientów/dostawców; język generatora dobierany jest do kraju.
11. Zachowane pozostałe moduły i grafiki aplikacji.
12. Service Worker podniesiony do V31.2.0, aby telefon pobrał aktualizację i nowe pliki.

PLIKI AKTUALIZACJI:
- index.html
- crm-status-v32.css
- crm-status-v32.js
- assistant-messages.json
- service-worker.js
- version.json
- status-firm-master.png (zatwierdzony wzorzec MASTER / referencja)

Po podmianie plików na GitHub Pages aplikacja powinna wykryć V31.2.0 w USTAWIENIACH → SPRAWDŹ AKTUALIZACJĘ / UAKTUALNIJ APLIKACJĘ.
