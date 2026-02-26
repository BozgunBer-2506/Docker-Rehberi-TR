# Dockerfile En İyi Practices

## Amaç

Bu bölümde sürdürülebilir, hızlı ve güvenli Docker image üretmek için Dockerfile yazım kurallarını öğreneceksin.

---

## Dockerfile Nedir?

Dockerfile, bir image’ın nasıl üretileceğini tarif eden deklaratif bir dosyadır.

Sık kullanılan direktifler:

- `FROM`
- `WORKDIR`
- `COPY`
- `RUN`
- `ENV`
- `EXPOSE`
- `CMD`
- `ENTRYPOINT`

---

## Temel Örnek

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["python", "main.py"]
```

---

## Best Practice 1: Küçük Base Image Seç

- Mümkünse `slim` veya `alpine` varyantları kullan
- Gereksiz paketli büyük image’lardan kaçın

Örnek:

- ✅ `python:3.12-slim`
- ⚠️ `python:3.12` (daha büyük)

---

## Best Practice 2: Layer Cache’i Doğru Kullan

Docker layer cache mantığı için dosya kopyalama sırası önemli.

Yanlış sıra:

```dockerfile
COPY . .
RUN npm install
```

Doğru sıra:

```dockerfile
COPY package*.json ./
RUN npm ci
COPY . .
```

Bu sayede yalnızca kod değişimlerinde hızlı rebuild alırsın.

---

## Best Practice 3: `.dockerignore` Kullan

Build context’i küçültmek için şarttır.

Örnek `.dockerignore`:

```gitignore
node_modules
.git
.env
dist
build
__pycache__
*.log
```

---

## Best Practice 4: Multi-Stage Build

Tek image içinde build tool bırakmak yerine çok aşamalı build kullan.

### Node örneği

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Avantajlar:

- Daha küçük final image
- Daha az attack surface
- Daha hızlı deploy

---

## Best Practice 5: Tek Sorumluluk

Bir container = tek ana process yaklaşımı daha yönetilebilirdir.

- API container
- DB container
- Queue worker container

Hepsini tek container’a doldurma.

---

## Best Practice 6: Non-Root User

Güvenlik için root yerine düşük yetkili user ile çalıştır.

```dockerfile
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

RUN addgroup -S app && adduser -S app -G app
USER app

CMD ["node", "server.js"]
```

---

## Best Practice 7: Deterministic Build

Sürüm pinleme ile tutarlı build al:

- Base image tag pinle
- Paket sürümlerini kilitle (`package-lock.json`, `poetry.lock`, `requirements.txt`)

---

## CMD vs ENTRYPOINT

### CMD

Varsayılan komut verir, runtime’da override edilebilir.

### ENTRYPOINT

Container’ın ana davranışını sabitler.

Kombinasyon:

```dockerfile
ENTRYPOINT ["python", "main.py"]
CMD ["--port", "8000"]
```

---

## Build ve Çalıştırma

```bash
docker build -t myapp:1.0.0 .
docker run --rm -p 8000:8000 myapp:1.0.0
```

---

## Sık Hatalar

### 1) Büyük image boyutu

Sebep:

- Gereksiz tool’lar final image’da kalıyor
- `.dockerignore` yok

### 2) Yavaş build

Sebep:

- Cache dostu layer sırası yok
- Her değişimde bağımlılıklar yeniden kuruluyor

### 3) Güvenlik riski

Sebep:

- Root user ile çalışma
- Eski base image kullanımı

---

## Özet

- Küçük base image + doğru cache sırası + `.dockerignore` = hızlı ve temiz build
- Multi-stage build production’da ciddi avantaj sağlar
- Non-root user kullanımı temel güvenlik adımıdır

## Mini Kontrol Listesi

- ✅ Dockerfile’da cache sırasını doğru kurabiliyorum
- ✅ `.dockerignore` dosyasını etkin kullanıyorum
- ✅ Multi-stage build mantığını anladım
- ✅ `CMD` ve `ENTRYPOINT` farkını biliyorum
- ✅ Non-root user ile container çalıştırabiliyorum
