# Image ve Container Mantığı

## Amaç

Bu bölümde Docker’ın en kritik iki kavramı olan **image** ve **container** yapısını netleştireceksin.
Ayrıca image katmanları, tag kullanımı ve lifecycle yönetimini pratik komutlarla öğreneceksin.

---

## Image Nedir?

Image, uygulamanın çalışması için gereken her şeyi içeren **salt okunur (read-only) şablondur**.

Image içinde genelde:

- İşletim sistemi katmanı (ör. `alpine`, `debian`)
- Runtime (ör. Python, Node.js)
- Uygulama dosyaları
- Kurulu bağımlılıklar

Bir image tek başına çalışmaz; çalıştırıldığında container oluşur.

---

## Container Nedir?

Container, bir image’ın **çalışan instance’ıdır**.

Kısaca:

- Image = kalıp
- Container = kalıptan üretilmiş çalışan örnek

Aynı image’dan birden fazla container başlatabilirsin.

---

## Image Katmanları (Layers)

Docker image’ları katmanlı yapıdadır.

Örneğin bir Dockerfile’daki şu adımlar:

- `FROM`
- `RUN`
- `COPY`
- `RUN`

her biri yeni bir layer oluşturur.

### Neden önemli?

- Build cache hızlanır
- Tekrar eden katmanlar yeniden indirilmez
- Registry transfer maliyeti düşer

---

## Tag ve Version Mantığı

Image’lar çoğunlukla şu formatta gelir:

`repository:tag`

Örnek:

- `nginx:latest`
- `python:3.12-slim`
- `postgres:16`

### Not

`latest` kullanımı her zaman güvenli değildir.
Production’da mümkünse sürüm pinle:

- ✅ `python:3.12.7-slim`
- ⚠️ `python:latest`

---

## Temel Komutlar

## Local image listesini gör

```bash
docker images
```

## Container listesini gör (çalışan)

```bash
docker ps
```

## Container listesini gör (tümü)

```bash
docker ps -a
```

## Image detayını incele

```bash
docker inspect nginx:latest
```

## Image katman geçmişi

```bash
docker history nginx:latest
```

---

## Lifecycle Akışı

Tipik akış:

1. Image pull et
2. Container başlat
3. Log izle
4. Durdur
5. Sil

### 1) Pull

```bash
docker pull nginx:latest
```

### 2) Run

```bash
docker run -d --name web01 -p 8080:80 nginx:latest
```

### 3) Logs

```bash
docker logs -f web01
```

### 4) Stop

```bash
docker stop web01
```

### 5) Remove container

```bash
docker rm web01
```

### 6) Remove image (kullanılmıyorsa)

```bash
docker rmi nginx:latest
```

---

## `run` vs `start` farkı

- `docker run` = yeni container oluşturur + başlatır
- `docker start` = daha önce oluşturulmuş container’ı tekrar başlatır

Örnek:

```bash
docker run --name demo alpine echo "hello"
docker start demo
```

---

## Uygulamalı Mini Senaryo

### Senaryo

Nginx image’ından iki farklı container çalıştır:

```bash
docker run -d --name web-a -p 8081:80 nginx:latest
docker run -d --name web-b -p 8082:80 nginx:latest
```

Kontrol:

```bash
docker ps
```

Tarayıcı:

- http://localhost:8081
- http://localhost:8082

Temizlik:

```bash
docker stop web-a web-b
docker rm web-a web-b
```

---

## Sık Yapılan Hatalar

### 1) `Conflict. The container name is already in use`

Aynı isimde container zaten var.

Çözüm:

```bash
docker rm -f web01
```

veya farklı isim kullan.

### 2) `No such image`

Image localde yok ve pull başarısız olmuş olabilir.

Çözüm:

```bash
docker pull <image:tag>
```

### 3) `Cannot remove image ... is being used by running container`

Image’ı kullanan container önce silinmeli.

Çözüm:

```bash
docker ps -a
docker rm -f <container_name>
docker rmi <image:tag>
```

---

## Özet

- Image şablondur, container çalışan örnektir.
- Katmanlı yapı performans ve cache için kritiktir.
- `latest` yerine sabit tag kullanmak production için daha güvenlidir.
- Temel lifecycle komutlarını iyi öğrenmek sonraki tüm Docker konularının temelidir.

## Mini Kontrol Listesi

- ✅ `docker images` çıktısını okuyabiliyorum
- ✅ `docker ps` ve `docker ps -a` farkını biliyorum
- ✅ `docker run` ile `docker start` farkını anladım
- ✅ Bir container’ı güvenli şekilde stop/rm yapabiliyorum
- ✅ Image tag stratejisinin neden önemli olduğunu biliyorum
