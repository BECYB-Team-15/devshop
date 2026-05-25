# devshop
Podatna na ataki aplikacja e-commerce stworzona do testów cyberbezpieczeństwa. Zawiera celowe luki (SQLi, XSS, IDOR) ułatwiające naukę testów penetracyjnych oraz konfigurację skanerów DAST.

# [ DEV_SHOP ] - Vulnerable E-Commerce Platform 🛒💀

**DevShop** to w pełni sfabrykowany, celowo dziurawy sklep internetowy z gadżetami dla programistów, stworzony jako środowisko testowe na potrzeby projektu akademickiego z zakresu cyberbezpieczeństwa. 

Aplikacja symuluje klasyczną architekturę (Headless E-commerce) z wyraźnym podziałem na warstwę frontendową oraz backendową z dokumentacją OpenAPI. Głównym celem projektu jest demonstracja popularnych błędów programistycznych, przeprowadzanie ręcznych ataków oraz automatyzacja testów bezpieczeństwa (DAST) w potokach CI/CD.

### ⚠️ Disclaimer
> **UWAGA:** Ta aplikacja jest ekstremalnie niebezpieczna z założenia. Zawiera krytyczne luki w zabezpieczeniach. **Nigdy** nie wdrażaj tego kodu w środowisku produkcyjnym ani nie wystawiaj go publicznie w sieci bez odpowiedniej izolacji.

### 🐛 Zaimplementowane Podatności
Projekt stanowi idealne środowisko do nauki następujących ataków:
* **SQL Injection (SQLi):** Brak sanityzacji parametrów w wyszukiwarce katalogu.
* **Stored XSS:** Renderowanie surowego kodu HTML/JS w sekcji opinii o produkcie.
* **Insecure Direct Object Reference (IDOR):** Brak walidacji właściciela tokenu przy pobieraniu szczegółów zamówienia.
* **Hardcoded Secrets:** Klucze API procesora płatności zaszyte bezpośrednio w kodzie źródłowym.
* **Broken Authentication:** Brak mechanizmów *Rate Limitingu* (podatność na Brute-force) oraz luźne przechowywanie tokenów JWT w LocalStorage przeglądarki.

### 🛠️ Stos Technologiczny
* **Frontend:** React, TypeScript, Vite, Tailwind CSS (Custom "Boxy/Dark" UI).
* **Backend:** Node.js, Express, PostgreSQL.
* **API:** Dokumentacja w standardzie OpenAPI (OAS / Swagger) ułatwiająca mapowanie endpointów przez skanery DAST (np. OWASP ZAP).
* **Infrastruktura:** Docker & Docker Compose.
