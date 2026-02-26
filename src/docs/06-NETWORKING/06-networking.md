# Networking

## Amaç

Bu bölümde Docker ağ yapısını, container’ların birbiriyle nasıl konuştuğunu ve doğru port yayınlama mantığını öğreneceksin.

---

## Docker Network Temelleri

Docker, container iletişimini network sürücüleri üzerinden yönetir.

En yaygın sürücüler:

- `bridge` (default)
- `host`
- `none`

---

## `bridge` Network (Varsayılan)

Container’lar izole bir ağda çalışır.
Aynı bridge ağına bağlı container’lar birbirine erişebilir.

### Mevcut networkleri listele

```bash
docker network ls
```

### Default bridge detay

```bash
docker network inspect bridge
```

---

## Port Publishing (`-p`)

Container içindeki portu host’a açmak için kullanılır.

```bash
docker run -d --name web -p 8080:80 nginx:latest
```

Anlamı:

- Host: `8080`
- Container: `80`

Tarayıcı:

- http://localhost:8080

---

## Custom Bridge Network (Önerilen)

Aynı projedeki servisleri izole ve isim çözümlemeli şekilde bağlamak için custom network kullan.

### Network oluştur

```bash
docker network create app-net
```

### Container’ları aynı networkte başlat

```bash
docker run -d --name db --network app-net postgres:16
docker run -d --name api --network app-net nginx:latest
```

Bu durumda `api`, `db` container’ına hostname olarak `db` ile erişebilir.

---

## DNS / Name Resolution

Docker aynı networkteki container isimlerini otomatik DNS olarak çözer.

Örnek:

- `api` container’ı içinde `db:5432` adresi kullanılabilir.

Bu yüzden IP hardcode etmek yerine container/service adı kullan.

---

## `host` Network

Container doğrudan host network stack’ini kullanır.

- Linux’ta mevcut
- İzolasyon azalır
- Performans avantajı olabilir ama dikkatli kullanılmalı

Örnek:

```bash
docker run --network host nginx:latest
```

---

## `none` Network

Container’a network verilmez.

```bash
docker run --network none alpine sleep 300
```

Yüksek izolasyon gereken özel senaryolarda kullanılabilir.

---

## Container’ı Sonradan Ağa Bağlama

```bash
docker network connect app-net my-container
docker network disconnect app-net my-container
```

---

## Pratik Senaryo: API + DB

### 1) Network oluştur

```bash
docker network create backend-net
```

### 2) DB başlat

```bash
docker run -d \
--name pg \
--network backend-net \
-e POSTGRES_PASSWORD=secret \
-e POSTGRES_DB=appdb \
postgres:16
```

### 3) API başlat (örnek)

```bash
docker run -d \
--name api \
--network backend-net \
-p 8000:8000 \
your-api-image:latest
```

Bağlantı string örneği:

- `postgresql://postgres:secret@pg:5432/appdb`

---

## Compose ile Network Yönetimi

Docker Compose varsayılan olarak proje için bir network oluşturur.
Servisler birbirine servis adıyla erişir.

```yaml
services:
api:
build: .
depends_on:
  - db
db:
image: postgres:16
```

`api` içinden `db` hostname’i kullanılabilir.

---

## Sık Hatalar

### 1) `connection refused`

Sebep:

- Yanlış port
- Servis henüz hazır değil
- Yanlış host adı

### 2) `name or service not known`

Sebep:

- Container’lar aynı networkte değil
- Yanlış service/container adı

### 3) Port çakışması

Sebep:

- Aynı host portu birden fazla container kullanıyor

Çözüm:

```bash
docker run -p 8081:80 nginx
```

---

## Debug Komutları

```bash
docker network ls
docker network inspect app-net
docker ps
docker logs <container>
docker exec -it <container> sh
```

Container içinden DNS testi (alpine’da):

```bash
apk add --no-cache bind-tools
nslookup db
```

---

## Özet

- Production benzeri yapı için custom bridge network iyi pratiktir.
- Servis iletişiminde IP yerine container/service adı kullan.
- Port publish yalnızca dış erişim gereken servislerde yapılmalı.
- Compose kullanırken network yönetimi büyük ölçüde otomatikleşir.

## Mini Kontrol Listesi

- ✅ `docker network ls` ve `inspect` kullanabiliyorum
- ✅ Custom network oluşturup container bağlayabiliyorum
- ✅ Servis adlarıyla container-to-container iletişimi kurabiliyorum
- ✅ Port publish mantığını doğru uygulayabiliyorum
- ✅ Networking kaynaklı temel hataları debug edebiliyorum
