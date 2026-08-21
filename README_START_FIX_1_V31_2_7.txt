L&M TECHNIC ENERGY — EUROPEJSKI KALKULATOR PELETU 1.2 PREMIUM
POPRAWKA BŁĘDU NR 1 — START APLIKACJI / PWA
WERSJA: V31.2.7 START FIX 1
DATA: 21.08.2026

NAPRAWIONY OBJAW:
Po naciśnięciu ikony aplikacji Android przez zbyt długi czas pokazywał czarny ekran startowy
z małą ikoną L&M zamiast szybko przejść do interfejsu kalkulatora.

CO ZMIENIONO:
1. index.html zmniejszony z ok. 20 MB do ok. 100 KB bez zmiany grafiki i funkcji.
2. 41 osadzonych grafik wyciągnięto 1:1 do katalogu assets/ — bez rekompresji i bez zmiany wyglądu.
3. Główny kod aplikacji przeniesiono do app-main.js (defer), dzięki czemu HTML może zostać
   wyświetlony natychmiast.
4. Dodano szybki pełnoekranowy ekran przejściowy wykorzystujący oryginalny Pulpit MASTER,
   zamiast pozostawiania pustego czarnego ekranu.
5. Start interfejsu nie czeka już na window.load; uruchamia się na DOMContentLoaded.
6. Service Worker podniesiony do V31.2.7-START-FIX-1 i uwzględnia nowe pliki.
7. Kolor tła startowego manifestu dopasowano do tła aplikacji (#020806).

WAŻNE:
Android może przez bardzo krótki moment wyświetlić systemowy splash z ikoną aplikacji.
Jest to zachowanie systemu Android i nie można go całkowicie wyłączyć w PWA.
Po tej poprawce ekran ten nie powinien już pozostawać na ekranie podczas ładowania dużego index.html.

NIE ZMIENIONO:
- grafiki Pulpitu MASTER,
- modułów i danych,
- zatwierdzonych kart,
- układu funkcjonalnego kalkulatora,
- danych CRM, RYNKI EU i faktur.
