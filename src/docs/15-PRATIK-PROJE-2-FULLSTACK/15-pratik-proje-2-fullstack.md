# Pratik Proje 2 - Fullstack (React + API + Nginx)

## Amaç

Bu bölümde tam bir fullstack stack’i Docker ile çalıştıracaksın:

- Frontend: React (Vite build)
- Backend: API (FastAPI örneği)
- Reverse Proxy: Nginx
- Orkestrasyon: Docker Compose

---

## Mimari

```text
Browser
↓
Nginx (80)
├─ / → Frontend static files
└─ /api/* → Backend API (api:8000)
```

---

## Proje Yapısı

```text
fullstack/
├─ frontend/
│ ├─ src/
│ ├─ package.json
│ ├─ Dockerfile
│ └─ nginx.conf
├─ backend/
│ ├─ app/
│ ├─ requirements.txt
│ └─ Dockerfile
└─ compose.yml
```

---

## 1) Frontend Dockerfile (Multi-stage)

`frontend/Dockerfile`

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runtime stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 2) Frontend Nginx Config

`frontend/nginx.conf`

```nginx
server {
listen 80;
server_name _;

root /usr/share/nginx/html;
index index.html;

# React SPA fallback
location / {
try_files $uri /index.html;
}

# API reverse proxy
location /api/ {
proxy_pass http://api:8000/;
proxy_http_version 1.1;
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
}
}
```

---

## 3) Backend Dockerfile

`backend/Dockerfile`

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 4) Compose Dosyası

`compose.yml`

```yaml
services:
api:
build: ./backend
container_name: fs-api
environment:
APP_ENV: production
expose:
- "8000"

web:
build: ./frontend
container_name: fs-web
ports:
- "8080:80"
depends_on:
- api
```

---

## 5) Çalıştırma

```bash
docker compose up -d --build
docker compose ps
```

Tarayıcı:

- http://localhost:8080

---

## 6) API Test

Frontend üzerinden `/api/...` çağrısı Nginx üzerinden backend’e gider.

Direkt test:

```bash
curl http://localhost:8080/api/health
```

---

## 7) Frontend API Base URL Notu

Frontend içinde hardcode `http://localhost:8000` kullanma.
Nginx proxy varsa `"/api"` prefix’i kullanmak daha temizdir.

Örnek:

```js
fetch("/api/health");
```

---

## 8) Dev ve Prod Ayrımı

- Dev’de hot reload için ayrı compose override kullan
- Prod’da build edilmiş static frontend + optimized backend image kullan

Örnek:

- `compose.yml` → prod-like
- `compose.override.yml` → dev mount/hot reload

---

## 9) Sık Hatalar

### 1) `404` SPA route hatası

Sebep: Nginx `try_files` eksik.
Çözüm: `try_files $uri /index.html;` ekle.

### 2) API çağrısı CORS hatası

Sebep: Frontend direkt farklı origin’e çağırıyor.
Çözüm: Nginx reverse proxy ile tek origin kullan.

### 3) `/api` path bozulması

Sebep: `proxy_pass` path slash kullanımı yanlış.
Çözüm: config’i test edip endpoint mapping’i doğrula.

---

## 10) Debug Komutları

```bash
docker compose logs -f web
docker compose logs -f api
docker exec -it fs-web sh
docker exec -it fs-api sh
```

Nginx config kontrol:

```bash
docker exec -it fs-web nginx -T
```

---

## Özet

Bu projeyle:

- Frontend ve backend’i containerize ettin
- Nginx reverse proxy ile tek entrypoint kurdun
- SPA routing + API forwarding kombinasyonunu çalıştırdın
- Prod’a yakın fullstack dağıtım modelini uyguladın

## Mini Kontrol Listesi

- ✅ Frontend için multi-stage Dockerfile yazabiliyorum
- ✅ Nginx ile SPA fallback ve API proxy kurabiliyorum
- ✅ Compose ile web + api servislerini birlikte çalıştırabiliyorum
- ✅ `/api` üzerinden backend erişimini doğrulayabiliyorum
- ✅ Fullstack dağıtımda dev/prod ayrımını planlayabiliyorum
