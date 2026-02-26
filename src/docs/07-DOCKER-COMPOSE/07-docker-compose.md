# Docker Compose

## Amaç

Bu bölümde çoklu servisleri tek komutla ayağa kaldırmak için Docker Compose kullanımını öğreneceksin.

---

## Docker Compose Nedir?

Docker Compose, birden fazla container servisinin:

- image/build
- network
- volume
- environment
- startup sırası

gibi ayarlarını tek bir `compose.yml` dosyasında tanımlamanı sağlar.

---

## Neden Compose Kullanılır?

- Tek komutla tüm stack’i başlatma
- Servis bağımlılıklarını merkezi yönetme
- Development ortamını hızlı tekrar üretme
- Proje bazlı network/volume otomasyonu

---

## Temel `compose.yml` Yapısı

```yaml
services:
api:
build: .
ports:
- "8000:8000"

db:
image: postgres:16
environment:
POSTGRES_PASSWORD: secret
POSTGRES_DB: appdb
ports:
- "5432:5432"
```

---

## Sık Kullanılan Alanlar

- `image`
- `build`
- `container_name`
- `ports`
- `environment`
- `env_file`
- `volumes`
- `depends_on`
- `networks`
- `restart`

---

## Komutlar

## Servisleri başlat

```bash
docker compose up -d
```

## Log izle

```bash
docker compose logs -f
```

## Servisleri durdur

```bash
docker compose stop
```

## Servisleri kapat ve sil

```bash
docker compose down
```

## Volume dahil temiz kapat

```bash
docker compose down -v
```

---

## Pratik Örnek: FastAPI + Postgres

```yaml
services:
api:
build: .
container_name: api
ports:
- "8000:8000"
environment:
DATABASE_URL: postgresql://postgres:secret@db:5432/appdb
depends_on:
- db

db:
image: postgres:16
container_name: db
environment:
POSTGRES_PASSWORD: secret
POSTGRES_DB: appdb
volumes:
- pgdata:/var/lib/postgresql/data
ports:
- "5432:5432"

volumes:
pgdata:
```

Başlat:

```bash
docker compose up -d
```

---

## `depends_on` Hakkında Önemli Not

`depends_on`, yalnızca **başlatma sırasını** garanti eder.
DB gerçekten hazır olmadan API başlama riski vardır.

Gerçek readiness için:

- healthcheck
- retry mekanizması
- wait-for-it script

kullan.

---

## Healthcheck Örneği

```yaml
services:
db:
image: postgres:16
environment:
POSTGRES_PASSWORD: secret
healthcheck:
test: ["CMD-SHELL", "pg_isready -U postgres"]
interval: 5s
timeout: 3s
retries: 10
```

---

## Environment Yönetimi (`.env`)

`compose.yml` içinde:

```yaml
environment:
APP_ENV: ${APP_ENV}
DB_HOST: ${DB_HOST}
```

`.env` dosyası:

```env
APP_ENV=development
DB_HOST=db
```

Not: gizli değerleri repo’ya push etme.

---

## Override Yapısı (Dev/Prod)

- `compose.yml` → ortak ayarlar
- `compose.override.yml` → local geliştirme ayarları
- `compose.prod.yml` → production varyantı

Örnek:

```bash
docker compose -f compose.yml -f compose.prod.yml up -d
```

---

## Sık Hatalar

### 1) `service ... depends on undefined service`

Sebep: yanlış servis adı.
Çözüm: `depends_on` altındaki isimler birebir eşleşmeli.

### 2) `port is already allocated`

Sebep: host port kullanımda.
Çözüm: farklı port ver (`8001:8000` gibi).

### 3) Environment variable boş geliyor

Sebep: `.env` okunmamış veya değişken adı yanlış.
Çözüm: değişken isimlerini kontrol et, compose komutunu proje kökünde çalıştır.

---

## Debug Komutları

```bash
docker compose ps
docker compose logs -f api
docker compose exec api sh
docker compose config
```

`docker compose config` final birleşik konfigi görmek için çok faydalıdır.

---

## Özet

- Compose, çok servisli uygulamalarda standart yaklaşımdır.
- `depends_on` tek başına readiness çözmez.
- Volume + network + env yönetimi Compose ile çok daha düzenli hale gelir.

## Mini Kontrol Listesi

- ✅ Basit bir `compose.yml` yazabiliyorum
- ✅ `up`, `logs`, `down` komutlarını doğru kullanabiliyorum
- ✅ API-DB bağlantısını servis adıyla kurabiliyorum
- ✅ `depends_on` ve healthcheck farkını anladım
- ✅ `.env` ile konfigürasyon yönetebiliyorum
