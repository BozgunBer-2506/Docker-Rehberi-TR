# Güvenlik Hardening

## Amaç

Bu bölümde Docker ortamında temel güvenlik sertleştirme adımlarını öğreneceksin: daha az yetki, daha küçük attack surface ve daha güvenli runtime.

---

## Güvenlikte Temel Prensip

**Least Privilege**: Container sadece ihtiyacı kadar yetki almalı.

---

## 1) Root Olarak Çalıştırma

Root user ile çalışan container, olası exploit durumunda daha yüksek risk taşır.

### Kötü örnek

```dockerfile
FROM node:20
WORKDIR /app
COPY . .
CMD ["node", "server.js"]
```

### İyi örnek (non-root)

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

## 2) Image Boyutunu Küçült

Büyük image = daha büyük attack surface.

Yöntemler:

- `slim/alpine` base image
- Multi-stage build
- Gereksiz paketleri kaldırma
- `.dockerignore` kullanma

---

## 3) Read-Only Filesystem

Mümkünse container root filesystem’i read-only çalıştır.

```bash
docker run --read-only myapp:latest
```

Gereken yazılabilir alanlar için volume/tmpfs tanımla.

---

## 4) Capabilities Kısıtlama

Linux capabilities’leri düşürmek saldırı yüzeyini azaltır.

```bash
docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE myapp:latest
```

---

## 5) Privileged Moddan Kaçın

`--privileged` çok geniş yetki verir, production’da büyük risk oluşturur.

- Gerekmiyorsa asla kullanma.
- Spesifik capability ile ilerle.

---

## 6) Secret’ı Image’a Gömme

Aşağıdakilerden kaçın:

- Dockerfile içinde secret yazmak
- `.env` dosyasını image’a `COPY` etmek
- Token/parola’yı loglamak

Doğru yaklaşım:

- runtime env
- secret manager
- dış konfigürasyon kaynakları

---

## 7) Base Image Güncelliği

Eski image’larda bilinen CVE’ler olabilir.

Rutin:

- düzenli pull/rebuild
- release not kontrolü
- dependency update

---

## 8) Image Vulnerability Scan

Trivy ile tarama örneği:

```bash
trivy image myapp:latest
```

CI pipeline’a eklemek en iyi pratiktir.

---

## 9) Resource Limit Koy

Sınırsız container kaynak tüketimi DoS riskini artırabilir.

```bash
docker run --memory=512m --cpus=1.0 myapp:latest
```

Compose örneği (deploy context’inde):

```yaml
services:
api:
deploy:
resources:
limits:
cpus: "1.0"
memory: 512M
```

---

## 10) Network Yüzeyini Daralt

- Sadece dış erişmesi gereken servise port publish yap
- DB gibi servisleri internal networkte tut
- Gereksiz açık port bırakma

---

## 11) Rootfs + Tmpfs Kombosu (İleri Seviye)

```bash
docker run \
--read-only \
--tmpfs /tmp \
--tmpfs /run \
myapp:latest
```

Bu model immutable runtime yaklaşımını güçlendirir.

---

## 12) Logging ve Audit

- Hassas veriyi loglama
- Structured log kullan
- Güvenlik olaylarını merkezi topla (ELK, Loki, Cloud logs)

---

## Pratik Hardening Checklist (Çalıştırma Tarzı)

```bash
docker run -d \
--name api-secure \
--read-only \
--cap-drop=ALL \
--security-opt=no-new-privileges:true \
--memory=512m \
--cpus=1.0 \
-p 8000:8000 \
myapp:latest
```

---

## Sık Hatalar

### 1) “Works on my machine” için root kullanmak

Kısa vadede kolay, uzun vadede güvenlik borcu.

### 2) `.env` dosyasını repo’ya push etmek

Secret sızıntısının en yaygın kaynaklarından biri.

### 3) `latest` tag ile production deploy

Beklenmeyen sürüm değişimi ve güvenlik riski.

---

## Özet

- Non-root + minimum capability + read-only yaklaşımı temel hardening üçlüsüdür.
- Secret yönetimi image dışı yapılmalı.
- Scan, update ve limit politikaları sürdürülebilir güvenliğin parçasıdır.

## Mini Kontrol Listesi

- ✅ Container’ı non-root user ile çalıştırabiliyorum
- ✅ Gereksiz privilege/capability vermiyorum
- ✅ Secret’ı image içine gömmenin riskini biliyorum
- ✅ Image güvenlik taramasını (Trivy vb.) uygulayabiliyorum
- ✅ Runtime resource limit ve network sınırlandırması yapabiliyorum
