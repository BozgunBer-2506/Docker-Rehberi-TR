# Docker Desktop

## Amaç

Bu bölümde Docker Desktop’ın ne olduğunu, ne işe yaradığını, nasıl kurulduğunu ve günlük kullanımda nasıl verimli kullanılacağını öğreneceksin.

---

## Docker Desktop Nedir?

Docker Desktop, Docker Engine’i masaüstü ortamında kolay yönetmek için geliştirilmiş resmi uygulamadır.

CLI ile yaptığın işlemleri (container, image, volume, network, compose) GUI üzerinden de yönetmeni sağlar.

---

## Ne İşe Yarar?

Docker Desktop ile:

- Çalışan container’ları görürsün
- Logları GUI’den izlersin
- Container içine terminal açarsın
- Image/volume/network yönetimi yaparsın
- Compose stack’lerini başlatıp durdurursun
- Resource (CPU/RAM) ayarı yaparsın

---

## Docker Desktop vs CLI

| Konu             | Docker Desktop | CLI              |
| ---------------- | -------------- | ---------------- |
| Görsel yönetim   | Çok iyi        | Yok              |
| Hızlı debug      | Kolay          | Güçlü ama manuel |
| Otomasyon/script | Sınırlı        | Çok güçlü        |
| Öğrenme eğrisi   | Daha kolay     | Daha teknik      |

En iyi yaklaşım: GUI ile gözlem, CLI ile otomasyon.

---

## Gordon (Dahili AI Asistanı) Nedir?

Gordon, Docker Desktop içinde yer alan dahili AI destekli yardımcıdır.

### Gordon ne işe yarar?

- Komut önerir
- Hata mesajlarını sadeleştirir
- Sorun çözümünde adım adım yönlendirme yapar
- Compose ve container yönetiminde hızlı ipuçları verir

### Önemli not

Gordon çok faydalıdır ama kritik işlemlerde (silme, prod değişikliği, güvenlik kararı) son kontrolü yine sen yapmalısın.

---

## Kurulum (Windows + WSL2)

### 1) Ön gereksinimler

- WSL2 kurulu olmalı
- BIOS/UEFI virtualization açık olmalı

### 2) Kurulum adımları

1. Docker Desktop indir ve kur
2. Uygulamayı aç
3. Settings > Resources > WSL Integration
4. Kullandığın distro’yu aktif et

### 3) Doğrulama

WSL terminalinde:

```bash
docker --version
docker info
docker run --rm hello-world
```

---

## Kurulum (macOS)

1. Docker Desktop indir ve kur
2. Uygulamayı başlat
3. Terminalde doğrula:

```bash
docker --version
docker info
docker run --rm hello-world
```

---

## İlk Kullanım Senaryosu

### 1) Nginx container başlat

```bash
docker run -d --name web -p 8080:80 nginx:latest
```

### 2) Docker Desktop üzerinden kontrol et

- Containers sekmesinde `web` görünür
- Logs sekmesinden logları izlersin
- Stop/Restart/Delete işlemlerini GUI’den yaparsın

### 3) Tarayıcıdan test et

- http://localhost:8080

---

## Docker Desktop Ana Bölümleri

- **Containers:** Çalışan/duran container’lar
- **Images:** Local image listesi
- **Volumes:** Kalıcı veri alanları
- **Networks:** Ağ yapılandırmaları
- **Extensions:** Eklenti desteği
- **Settings:** Kaynak ve entegrasyon ayarları

---

## Resource Ayarları (Önemli)

Docker Desktop’ta CPU/RAM limitlerini doğru ayarlamak performans için kritiktir.

Pratik öneri (kişisel laptop):

- RAM: 4–8 GB
- CPU: 2–4 core

---

## WSL Entegrasyon Notları

WSL’de docker komutları çalışmıyorsa:

1. Docker Desktop açık mı?
2. WSL integration aktif mi?
3. Doğru distro seçili mi?
4. Terminal yeniden açıldı mı?

---

## Sık Karşılaşılan Sorunlar

### 1) Docker Desktop açık ama komut çalışmıyor

- WSL integration kapalı olabilir
- Distro seçimi yanlış olabilir

### 2) GUI’de container görünüyor, porttan erişim yok

- Port mapping yanlış olabilir (`-p host:container`)
- Uygulama container içinde `0.0.0.0` bind etmiyor olabilir

### 3) Sistem yavaşladı

- Resource limiti çok yüksek olabilir
- Kullanılmayan kaynaklar birikmiş olabilir

Temizlik:

```bash
docker system prune -f
```

---

## En İyi Pratikler

- GUI’de izleme yap, kritik işlemleri CLI ile scriptle
- Düzenli temizlik yap (`prune` dikkatli)
- Resource ayarlarını projeye göre optimize et
- Güncelleme sonrası WSL entegrasyonunu kontrol et
- Gordon’u hızlı yardım için kullan, kritik kararda manuel doğrula

---

## Özet

Docker Desktop, Docker deneyimini özellikle başlangıç ve orta seviyede ciddi kolaylaştırır.
CLI bilgisiyle birlikte kullanıldığında hem hız hem görünürlük sağlar.

## Mini Kontrol Listesi

- ✅ Docker Desktop’ın ne işe yaradığını açıklayabiliyorum
- ✅ WSL integration kurulumunu yapabiliyorum
- ✅ GUI’den container/image/log yönetebiliyorum
- ✅ Resource ayarlarını optimize edebiliyorum
- ✅ Gordon’un ne işe yaradığını ve sınırlarını biliyorum
