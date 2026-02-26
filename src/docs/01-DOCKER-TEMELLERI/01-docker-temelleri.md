# Docker Temelleri

## Docker Nedir?

Docker, uygulamaları ve bağımlılıklarını birlikte paketleyip her ortamda aynı şekilde çalıştırmayı sağlayan bir container platformudur.

“Benim bilgisayarda çalışıyor” problemini büyük ölçüde ortadan kaldırır.

## Container vs VM

| Özellik          | Container           | Virtual Machine               |
| ---------------- | ------------------- | ----------------------------- |
| Başlangıç süresi | Çok hızlı (sn)      | Daha yavaş                    |
| Kaynak tüketimi  | Daha düşük          | Daha yüksek                   |
| İzolasyon        | OS seviyesinde      | Donanım seviyesine daha yakın |
| Kullanım         | Modern app dağıtımı | Tam sistem sanallaştırma      |

## Docker’ın Temel Bileşenleri

- **Image:** Uygulamanın şablonu (read-only)
- **Container:** Image’ın çalışan hali
- **Dockerfile:** Image üretim tarifi
- **Registry:** Image depolama (Docker Hub, GHCR vs.)
- **Volume:** Kalıcı veri saklama
- **Network:** Container’lar arası iletişim

## Neden Docker Kullanılır?

- Ortam tutarlılığı (dev/stage/prod)
- Hızlı deployment
- Kolay ölçekleme
- Bağımlılık yönetimini sadeleştirme
- CI/CD süreçlerini hızlandırma

## İlk Komutlar

```bash
docker --version
docker info
docker run hello-world
docker ps
docker ps -a
docker images
```

## İlk Pratik

### 1) Nginx container çalıştır

```bash
docker run -d --name web -p 8080:80 nginx:latest
```

### 2) Çalışan container’ı gör

```bash
docker ps
```

### 3) Tarayıcıdan test et

- http://localhost:8080

### 4) Container’ı durdur ve sil

```bash
docker stop web
docker rm web
```

## Sık Yapılan Hatalar

- Port çakışması (`port is already allocated`)
- Container adı çakışması (`container name is already in use`)
- Docker daemon kapalıyken komut çalıştırma

## Özet

- Docker, uygulamayı taşınabilir hale getirir.
- Image = şablon, Container = çalışan örnek.
- İlk aşamada `run`, `ps`, `stop`, `rm` komutlarını iyi oturtmak kritiktir.
