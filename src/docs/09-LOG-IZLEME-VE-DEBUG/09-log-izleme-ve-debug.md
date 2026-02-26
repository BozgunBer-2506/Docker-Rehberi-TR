# Log İzleme ve Debug

## Amaç

Bu bölümde container log’larını doğru okumayı, servis hatalarını hızlı tespit etmeyi ve runtime debug adımlarını öğreneceksin.

---

## Neden Log ve Debug Önemli?

Container “çalışıyor” görünebilir ama uygulama aslında hatada olabilir.
Doğru debug akışı olmadan sorun çözme süresi uzar.

---

## Temel Debug Akışı

1. Container durumu kontrol et
2. Logları incele
3. Container içine gir
4. Network/port/env doğrula
5. Healthcheck ve dependency durumunu kontrol et

---

## 1) Container Durumu

```bash
docker ps
docker ps -a
```

Bakılacak noktalar:

- `STATUS` (Up mı, Exited mı?)
- Port mapping doğru mu?
- Container restart loop’a girmiş mi?

---

## 2) Log İzleme

### Son logları gör

```bash
docker logs api
```

### Canlı takip

```bash
docker logs -f api
```

### Son 100 satır

```bash
docker logs --tail 100 api
```

### Timestamp ile

```bash
docker logs -t api
```

---

## 3) Compose Logları

```bash
docker compose logs -f
docker compose logs -f api
docker compose logs --tail 200 db
```

---

## 4) Container İçine Girip Kontrol

```bash
docker exec -it api sh
```

Container içinde hızlı kontroller:

```bash
printenv | sort
ls -la
cat /etc/hosts
```

---

## 5) Uygulama Portu Dinliyor mu?

Container içinde:

```bash
ss -tulnp
```

Host tarafında mapping kontrol:

```bash
docker port api
```

---

## 6) Kaynak Tüketimi İzleme

```bash
docker stats
```

Bakılacak metrikler:

- CPU %
- Memory usage / limit
- Network I/O

Memory limit aşımı OOM kill’e neden olabilir.

---

## 7) Inspect ile Derin İnceleme

```bash
docker inspect api
```

Kontrol et:

- Env değişkenleri
- Mount path’leri
- Network bilgisi
- Restart policy
- Entrypoint/Cmd

---

## 8) Exit Code Okuma

Container anında kapanıyorsa:

```bash
docker ps -a
```

`Exited (1)` gibi kodlar görürsün.

Yorum:

- `0` = normal çıkış
- `1` = genel runtime hata
- `137` = OOM kill / zorla stop
- `143` = SIGTERM ile sonlandırma

---

## Sık Problem Senaryoları

### Senaryo 1: Container sürekli restart

Nedenler:

- Uygulama boot sırasında crash
- Eksik env var
- DB bağlantısı yok
- Yanlış command/entrypoint

Kontrol:

```bash
docker logs --tail 200 api
docker inspect api
```

---

### Senaryo 2: API ayakta ama erişilemiyor

Kontrol listesi:

- Port publish var mı?
- App `0.0.0.0` üzerinde mi dinliyor?
- Firewall / security layer engeli var mı?

Test:

```bash
curl -I http://localhost:8000
```

---

### Senaryo 3: DB bağlantı hatası

Hata örneği:

- `connection refused`
- `name or service not known`

Kontrol:

- `DB_HOST` doğru mu (`db` gibi servis adı)
- Aynı networkteler mi
- DB gerçekten hazır mı (healthcheck/retry)

---

## Compose Debug Komutları

```bash
docker compose ps
docker compose logs -f
docker compose exec api sh
docker compose config
```

`docker compose config` ile final birleşik config’i görerek env/override hatalarını yakalarsın.

---

## Healthcheck Örneği

```yaml
services:
api:
healthcheck:
test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
interval: 10s
timeout: 3s
retries: 5
```

Durum görüntüleme:

```bash
docker inspect --format='{{json .State.Health}}' api | jq
```

---

## Özet

- İlk adım her zaman `ps` + `logs`.
- Sonra `exec`, `inspect`, `stats` ile kök nedeni bul.
- Compose projelerinde `docker compose logs/config/exec` üçlüsü en kritik araçtır.
- Debug sürecini standartlaştırmak çözüm hızını ciddi artırır.

## Mini Kontrol Listesi

- ✅ `docker logs` ve `docker compose logs` kullanabiliyorum
- ✅ Container içine girip temel kontrolleri yapabiliyorum
- ✅ Port ve network kaynaklı sorunları ayırt edebiliyorum
- ✅ `docker inspect` ile konfigürasyon doğrulayabiliyorum
- ✅ Exit code ve restart davranışını yorumlayabiliyorum
