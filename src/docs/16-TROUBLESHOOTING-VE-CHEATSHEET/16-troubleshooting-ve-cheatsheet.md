# Troubleshooting ve Cheatsheet

## Amaç

Bu bölümde Docker’da en sık görülen hataları hızlıca teşhis etmeyi ve standart bir debug akışıyla çözmeyi öğreneceksin.

---

## Hızlı Teşhis Akışı

Sorun olduğunda şu sırayı izle:

1. `docker ps -a`
2. `docker logs <container>`
3. `docker inspect <container>`
4. `docker network ls` + `docker network inspect <network>`
5. `docker compose logs -f`

---

## Sık Hatalar ve Hızlı Çözümler

### 1) Port Çakışması

Hata:
`port is already allocated`

Çözüm:

```bash
lsof -i :8080
docker ps
docker stop <container>
# veya farklı port:
docker run -p 8081:80 nginx
```

---

### 2) Container Name Çakışması

Hata:
`Conflict. The container name is already in use`

Çözüm:

```bash
docker rm -f <container_name>
```

---

### 3) Docker Daemon Bağlantı Hatası

Hata:
`Cannot connect to the Docker daemon`

Çözüm (Linux):

```bash
sudo systemctl start docker
sudo systemctl status docker
```

WSL/Windows kontrolü:

- Docker Desktop açık mı?
- WSL integration aktif mi?

---

### 4) `docker.sock` Permission Hatası

Hata:
`permission denied while trying to connect to the Docker daemon socket`

Çözüm:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

---

### 5) API DB’ye Bağlanamıyor

Belirti:

- `connection refused`
- `name or service not known`

Kontrol:

- `DB_HOST=db` mi?
- Aynı networkteler mi?
- DB hazır mı?

Komutlar:

```bash
docker compose ps
docker compose logs -f db
docker compose exec api sh
```

---

### 6) Container Sürekli Restart

Kontrol:

```bash
docker ps -a
docker logs --tail 200 <container>
```

Muhtemel nedenler:

- Eksik env
- Yanlış command/entrypoint
- Startup crash
- OOM (`Exited 137`)

---

### 7) Image Silinemiyor

Hata:
`image is being used by running container`

Çözüm:

```bash
docker ps -a
docker rm -f <container_using_image>
docker rmi <image:tag>
```

---

### 8) Build Çok Yavaş

Kontrol et:

- `.dockerignore` var mı?
- Layer sırası cache dostu mu?
- Dependency adımı gereksiz yere invalidate oluyor mu?

---

### 9) Disk Doluyor

Temizlik:

```bash
docker system df
docker image prune -f
docker container prune -f
docker volume prune -f
docker system prune -f
```

> Not: `prune` komutları kullanılmayan kaynakları siler.

---

### 10) Compose Değişiklikleri Uygulanmıyor

```bash
docker compose down
docker compose up -d --build
```

Config doğrulama:

```bash
docker compose config
```

---

## Cheatsheet

### Container

```bash
docker ps
docker ps -a
docker logs -f <container>
docker exec -it <container> sh
docker inspect <container>
docker stats
```

### Image

```bash
docker images
docker history <image>
docker rmi <image>
```

### Network

```bash
docker network ls
docker network inspect <network>
docker network connect <network> <container>
```

### Volume

```bash
docker volume ls
docker volume inspect <volume>
docker volume prune -f
```

### Compose

```bash
docker compose up -d
docker compose down
docker compose logs -f
docker compose ps
docker compose exec <service> sh
docker compose config
```

---

## Günlük Operasyon Kısa Akış

### Güncelle + ayağa kaldır

```bash
git pull
docker compose up -d --build
docker compose logs -f
```

### Tam reset (dev)

```bash
docker compose down -v
docker compose up -d --build
```

---

## Kısa Incident Not Şablonu

- Belirti:
- İlk hata mesajı:
- Etkilenen servis:
- Denenen komutlar:
- Kök neden:
- Kalıcı çözüm:

---

## Özet

- `logs + inspect + compose config` en çok sorun çözen üçlüdür.
- Sorunları standart akışla çözmek hız kazandırır.
- Temizlik komutlarını dikkatli kullanmak gerekir.

## Mini Kontrol Listesi

- ✅ En sık Docker hatalarını tanıyabiliyorum
- ✅ `logs/inspect/exec` ile kök neden analizi yapabiliyorum
- ✅ Compose sorunlarında doğru debug akışını uygulayabiliyorum
- ✅ Disk/volume/image temizliğini güvenli şekilde yapabiliyorum
- ✅ Tekrarlayan sorunlar için incident notu tutabiliyorum
