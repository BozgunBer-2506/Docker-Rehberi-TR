# Performans ve Optimizasyon

## Amaç

Bu bölümde Docker image build süresini, container çalışma verimliliğini ve deployment performansını artırma yöntemlerini öğreneceksin.

---

## Performans Nerede Kaybedilir?

En sık kayıp noktaları:

- Büyük image boyutu
- Yanlış layer sırası
- Gereksiz bağımlılıklar
- Verimsiz volume/mount kullanımı
- Limitsiz kaynak tüketimi

---

## 1) Build Cache Mantığını Doğru Kullan

Docker layer cache’i build hızının anahtarıdır.

### Kötü örnek

```dockerfile
COPY . .
RUN npm install
```

### İyi örnek

```dockerfile
COPY package*.json ./
RUN npm ci
COPY . .
```

Bu sıralama sayesinde kod değiştiğinde dependency layer yeniden build edilmez.

---

## 2) Multi-Stage Build ile Final Image Küçült

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

Avantaj:

- Daha küçük image
- Daha hızlı pull/push
- Daha hızlı cold start

---

## 3) Doğru Base Image Seç

- `slim` veya `alpine` çoğu senaryoda daha verimli
- Ama bazı native dependency senaryolarında `alpine` ekstra uğraştırabilir

Pratik yaklaşım:

- Önce `slim` ile stabil çalıştır
- Sonra gerekiyorsa optimize et

---

## 4) `.dockerignore` ile Context Küçült

Build context büyükse build süresi artar.

Örnek:

```gitignore
node_modules
.git
dist
build
.env
*.log
```

---

## 5) Runtime Resource Limit

Limitsiz container host kaynaklarını tüketebilir.

```bash
docker run --cpus=1.0 --memory=512m myapp:latest
```

Bu sınırlar performans stabilitesini artırır (özellikle multi-service ortamlarda).

---

## 6) Log Yönetimi

Aşırı log I/O darboğaz yaratabilir.

- Gereksiz debug logları kapat
- JSON/structured log kullan
- Log rotation uygula

Docker daemon tarafında log driver/rotation ayarı önemli olabilir.

---

## 7) Healthcheck Maliyetini Dengele

Healthcheck çok sık çalışırsa ekstra yük oluşturur.

Kötü denge:

- 1 saniyede bir probe

Daha dengeli örnek:

```yaml
healthcheck:
test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
interval: 15s
timeout: 3s
retries: 3
```

---

## 8) Network ve IO Performansı

- Sadece gerekli portları publish et
- Gereksiz cross-container trafik oluşturma
- WSL/Windows’ta bind mount performansı bazen düşük olabilir, kritik yerlerde named volume düşün

---

## 9) Dependency Optimizasyonu

### Node.js

- `npm ci` kullan
- production’da dev dependency alma:
- `npm ci --omit=dev`

### Python

- Pinlenmiş `requirements.txt`
- `--no-cache-dir` ile pip cache azaltma

```dockerfile
RUN pip install --no-cache-dir -r requirements.txt
```

---

## 10) Startup Süresini Kısalt

- Gereksiz init scriptleri kaldır
- Boot sırasında ağır migration işlerini kontrol et
- Lazy init yapılabilecek parçaları ayır

---

## 11) Benchmark ve Ölçüm

Optimizasyon ölçmeden yapılmaz.

Faydalı metrikler:

- image size
- build süresi
- container startup süresi
- CPU/memory kullanımı
- response time (p95/p99)

---

## Pratik Komutlar

```bash
docker images
docker history myapp:latest
docker stats
time docker build -t myapp:test .
```

---

## Sık Hatalar

### 1) “Optimize ettim” ama ölçüm yok

Yapılan değişikliğin etkisi doğrulanmıyor.

### 2) Aşırı küçük image uğruna stabiliteyi bozmak

Her optimize adımı operasyonel maliyeti de düşünmeli.

### 3) Debug tool’ları production image’da bırakmak

Image büyür, güvenlik yüzeyi artar.

---

## Özet

- Performans optimizasyonu build + runtime birlikte ele alınmalı.
- Layer cache, multi-stage ve küçük context en yüksek etkiyi verir.
- Ölçüm odaklı ilerlemek, rastgele tweak’lerden daha değerlidir.

## Mini Kontrol Listesi

- ✅ Dockerfile’da cache dostu layer sırası kurabiliyorum
- ✅ Multi-stage build ile image boyutunu düşürebiliyorum
- ✅ `.dockerignore` ile build context’i optimize edebiliyorum
- ✅ Runtime CPU/memory limit uygulayabiliyorum
- ✅ Optimizasyon etkisini metriklerle doğrulayabiliyorum
