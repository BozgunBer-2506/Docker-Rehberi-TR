# Env Var ve Secrets

## Amaç

Bu bölümde container konfigürasyonunu koddan ayırmak için environment variable kullanımını ve hassas verilerin (secret) güvenli yönetimini öğreneceksin.

---

## Neden Env Var Kullanılır?

Uygulama ayarlarını (örn. DB host, port, mode) kod içine gömmek yerine dışarıdan vermek daha doğrudur.

Avantajlar:

- Aynı image ile dev/stage/prod çalıştırma
- Kod değişmeden ortam değiştirme
- Konfigürasyon yönetimini sadeleştirme

---

## Temel Env Var Kullanımı

```bash
docker run -d \
--name app \
-e APP_ENV=production \
-e PORT=8000 \
myapp:latest
```

Container içinde kontrol:

```bash
docker exec -it app sh
printenv | grep APP_ENV
```

---

## Compose ile Env Var

```yaml
services:
api:
image: myapp:latest
environment:
APP_ENV: production
PORT: "8000"
```

---

## `.env` Dosyası ile Kullanım

`compose.yml`:

```yaml
services:
api:
image: myapp:latest
environment:
APP_ENV: ${APP_ENV}
DB_HOST: ${DB_HOST}
DB_PORT: ${DB_PORT}
```

`.env`:

```env
APP_ENV=development
DB_HOST=db
DB_PORT=5432
```

---

## Önemli Güvenlik Notu

`.env` dosyasına gerçek secret yazıyorsan bu dosyayı Git’e push etme.

`.gitignore` içine ekle:

```gitignore
.env
.env.*
```

---

## Secret Nedir?

Secret; parola, API key, token, private key gibi hassas bilgilerdir.

Örnekler:

- `DB_PASSWORD`
- `JWT_SECRET`
- `AWS_SECRET_ACCESS_KEY`

---

## Neden Secret’ı Env Var’dan Ayırmak Gerekir?

Env var pratik olsa da bazı ortamlarda process dump/log üzerinden sızabilir.
Production’da daha güvenli secret yönetim mekanizmaları tercih edilir.

---

## Secret Yönetim Seçenekleri

- Docker Swarm Secrets
- Kubernetes Secrets
- Vault (HashiCorp Vault vb.)
- Cloud Secret Manager (AWS Secrets Manager, GCP Secret Manager, Azure Key Vault)

---

## Basit Dev Yaklaşımı (Pragmatik)

Geliştirme ortamında:

- `.env` kullan
- `.env` dosyasını repo dışında tut
- örnek dosya paylaş (`.env.example`)

`.env.example`:

```env
APP_ENV=development
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=change_me
```

---

## Compose + env_file Kullanımı

```yaml
services:
api:
image: myapp:latest
env_file:
  - .env
```

Bu yöntemle çok sayıda env değişkeni daha düzenli taşınır.

---

## Anti-Patterns (Kaçınılmalı)

- Secret’ı Dockerfile içine yazmak
- Secret’ı image içine `COPY` ile gömmek
- Secret’ı log’a basmak
- Gerçek `.env` dosyasını Git’e push etmek

---

## Pratik Senaryo

### 1) `.env` oluştur

```env
APP_ENV=production
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=supersecret
```

### 2) Compose ile kullan

```yaml
services:
api:
build: .
env_file:
  - .env
```

### 3) Çalıştır

```bash
docker compose up -d
docker compose logs -f api
```

---

## Debug Komutları

```bash
docker compose config
docker exec -it api sh
printenv | sort
```

`docker compose config`, env substitution sonrası final config’i görmek için çok faydalıdır.

---

## Özet

- Env var, konfigürasyonu koddan ayırmanın temel yoludur.
- Secret yönetimi production’da daha güçlü araçlarla yapılmalıdır.
- `.env` + `.env.example` yaklaşımı geliştirici deneyimini iyileştirir.
- Secret’ı asla image içine gömme ve log’lama.

## Mini Kontrol Listesi

- ✅ Env var ile uygulama ayarı verebiliyorum
- ✅ Compose içinde `environment` ve `env_file` kullanabiliyorum
- ✅ `.env` dosyasını Git’ten hariç tutuyorum
- ✅ Secret ve normal config farkını biliyorum
- ✅ Secret’ı image içine gömmenin riskini anladım
