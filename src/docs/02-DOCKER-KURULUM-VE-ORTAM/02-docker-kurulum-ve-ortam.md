# Docker Kurulum ve Ortam

## Amaç

Bu bölümde Docker kurulumunu farklı işletim sistemlerinde doğru şekilde yapmayı, kurulumu doğrulamayı ve en sık görülen başlangıç hatalarını çözmeyi öğreneceksin.

## Gereksinimler

- 64-bit işletim sistemi
- Sanallaştırma desteği (BIOS/UEFI’de aktif)
- En az 4 GB RAM (öneri: 8+ GB)
- İnternet bağlantısı

---

## Windows (WSL2 + Docker Desktop)

### 1) WSL2 kur ve varsayılan yap

```powershell
wsl --install
wsl --set-default-version 2
```

### 2) Docker Desktop kur

- Docker Desktop’ı indir ve kur
- Settings > Resources > **WSL Integration** bölümünden distro’nu aktif et

### 3) Doğrulama

WSL terminalinde:

```bash
docker --version
docker info
docker run --rm hello-world
```

---

## Ubuntu / Debian (Docker Engine)

### 1) Eski paketleri temizle (varsa)

```bash
sudo apt remove -y docker docker-engine docker.io containerd runc
```

### 2) Gerekli paketleri yükle

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
```

### 3) Resmi Docker repository ekle

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### 4) Docker Engine kur

```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 5) Servisi başlat

```bash
sudo systemctl enable docker
sudo systemctl start docker
sudo systemctl status docker
```

### 6) Sudo olmadan kullanım

```bash
sudo usermod -aG docker $USER
newgrp docker
docker run --rm hello-world
```

---

## macOS (Docker Desktop)

1. Docker Desktop indir ve kur
2. Uygulamayı başlat
3. Terminalde doğrula:

```bash
docker --version
docker info
docker run --rm hello-world
```

---

## Kurulum Sonrası Hızlı Test

### Nginx test container

```bash
docker run -d --name test-nginx -p 8080:80 nginx:latest
docker ps
```

Tarayıcıdan aç:

- http://localhost:8080

Temizlik:

```bash
docker stop test-nginx
docker rm test-nginx
```

---

## Sık Karşılaşılan Hatalar

### 1) `permission denied while trying to connect to the Docker daemon socket`

**Sebep:** Kullanıcı `docker` grubunda değil.
**Çözüm:**

```bash
sudo usermod -aG docker $USER
newgrp docker
```

### 2) `Cannot connect to the Docker daemon`

**Sebep:** Docker servisi çalışmıyor.
**Çözüm:**

```bash
sudo systemctl start docker
sudo systemctl status docker
```

### 3) Port çakışması (`port is already allocated`)

**Sebep:** Aynı port başka bir süreç/container tarafından kullanılıyor.
**Çözüm:** Farklı port map et:

```bash
docker run -d --name test-nginx -p 8081:80 nginx:latest
```

---

## Özet

- Kurulumdan sonra mutlaka `hello-world` ve basit bir web container testi yap.
- Linux’ta `docker` grup ayarı yetki sorunlarını büyük ölçüde çözer.
- WSL2 senaryosunda Docker Desktop entegrasyonunu açmak kritik adımdır.

## Mini Kontrol Listesi

- ✅ `docker --version` çalışıyor
- ✅ `docker info` hata vermiyor
- ✅ `docker run --rm hello-world` başarılı
- ✅ `docker compose version` mevcut
- ✅ Basit nginx testi başarılı
