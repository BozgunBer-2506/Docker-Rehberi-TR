# Volume ve Kalıcı Veri

## Amaç

Bu bölümde Docker’da kalıcı veri yönetimini öğreneceksin.
Container silinse bile verinin kaybolmaması için volume/bind mount kullanımını netleştireceğiz.

---

## Neden Kalıcı Veri Gerekli?

Container’lar geçicidir (ephemeral).
Container içindeki dosyalar, container silinince kaybolur.

Kalıcı veri gereken tipik alanlar:

- Veritabanı dosyaları
- Yüklenen medya dosyaları
- Log ve export çıktıları

---

## Temel Kavramlar

### 1) Named Volume

Docker tarafından yönetilen kalıcı depolama alanı.

- Daha taşınabilir
- Production için daha güvenli/temiz yaklaşım

### 2) Bind Mount

Host’taki klasörü doğrudan container içine bağlar.

- Geliştirme için çok kullanışlı
- Host dizin yapısına bağımlıdır

---

## Named Volume Kullanımı

## Volume oluştur

```bash
docker volume create pgdata
```

## Volume listele

```bash
docker volume ls
```

## Volume detay

```bash
docker volume inspect pgdata
```

---

## PostgreSQL + Named Volume Örneği

```bash
docker run -d \
--name postgres-db \
-e POSTGRES_PASSWORD=secret123 \
-e POSTGRES_DB=myapp \
-p 5432:5432 \
-v pgdata:/var/lib/postgresql/data \
postgres:16
```

Bu kurulumda:

- Container silinse bile `pgdata` volume’da veri kalır
- Yeni container ile aynı volume tekrar bağlanabilir

---

## Bind Mount Örneği

```bash
docker run -d \
--name nginx-bind \
-p 8080:80 \
-v $(pwd)/site:/usr/share/nginx/html:ro \
nginx:latest
```

Açıklama:

- Host’taki `./site` klasörü container içinde yayınlanır
- `:ro` sayesinde salt okunur bağlanır (güvenli)

---

## Volume vs Bind Mount

| Özellik              | Named Volume     | Bind Mount            |
| -------------------- | ---------------- | --------------------- |
| Yönetim              | Docker yönetir   | Host dosya sistemi    |
| Taşınabilirlik       | Daha iyi         | Daha düşük            |
| Dev senaryosu        | Orta             | Çok iyi               |
| Prod senaryosu       | Çok iyi          | Dikkatli kullanılmalı |
| Performans (WSL/Win) | Genelde daha iyi | Bazen daha yavaş      |

---

## Volume ile Veriyi Geri Kullanma

### Container’ı sil

```bash
docker rm -f postgres-db
```

### Aynı volume ile tekrar başlat

```bash
docker run -d \
--name postgres-db-new \
-e POSTGRES_PASSWORD=secret123 \
-e POSTGRES_DB=myapp \
-p 5432:5432 \
-v pgdata:/var/lib/postgresql/data \
postgres:16
```

Veri korunmuş olur.

---

## Backup / Restore Basit Yaklaşım

### Backup (tar)

```bash
docker run --rm \
-v pgdata:/source \
-v $(pwd):/backup \
alpine \
tar czf /backup/pgdata-backup.tar.gz -C /source .
```

### Restore

```bash
docker run --rm \
-v pgdata:/target \
-v $(pwd):/backup \
alpine \
sh -c "tar xzf /backup/pgdata-backup.tar.gz -C /target"
```

---

## Compose Örneği

```yaml
services:
db:
image: postgres:16
environment:
POSTGRES_PASSWORD: secret123
POSTGRES_DB: myapp
volumes:
- pgdata:/var/lib/postgresql/data
ports:
- "5432:5432"

volumes:
pgdata:
```

---

## Sık Hatalar

### 1) Container silince veri kaybı

Sebep: Volume bağlanmamış.
Çözüm: DB path’ini named volume’a bağla.

### 2) Permission hatası

Sebep: Host klasör izinleri container user ile uyumsuz.
Çözüm: klasör owner/permission düzenle veya named volume kullan.

### 3) Yanlış mount path

Sebep: Uygulamanın gerçek data path’i yerine farklı dizine mount yapılmış.
Çözüm: image dokümantasyonundaki data path’i kontrol et.

---

## Özet

- Kalıcı veri için named volume temel çözümdür.
- Bind mount geliştirme sürecinde hızlıdır, production’da dikkat ister.
- Veritabanlarında volume kullanmadan deploy yapmak ciddi risk oluşturur.

## Mini Kontrol Listesi

- ✅ Named volume oluşturup bağlayabiliyorum
- ✅ Bind mount ile local dosya paylaşabiliyorum
- ✅ Container silinse de veriyi koruyabiliyorum
- ✅ Volume backup/restore temel akışını anladım
- ✅ Compose içinde volume tanımlayabiliyorum
