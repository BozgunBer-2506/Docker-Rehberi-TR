# Final Test - Docker Rehberi (30 Soru)

## Soru 1: Docker’da image neyi ifade eder?

- A) Çalışan süreç
- B) Kalıcı disk alanı
- C) Çalıştırılabilir şablon
- D) Ağ köprüsü

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **C**

</details>

---

## Soru 2: `docker run` komutu ne yapar?

- A) Yeni container oluşturur ve başlatır
- B) Sadece mevcut container’ı başlatır
- C) Sadece image indirir
- D) Sadece log gösterir

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **A**

</details>

---

## Soru 3: Production için hangi tag yaklaşımı daha doğrudur?

- A) Her zaman `latest`
- B) Tag kullanmamak
- C) Sürüm pinli tag
- D) Rastgele tag

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **C**

</details>

---

## Soru 4: `.dockerignore` dosyasının temel amacı nedir?

- A) Log yönetmek
- B) Build context’i küçültmek
- C) Container silmek
- D) Port maplemek

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **B**

</details>

---

## Soru 5: Kalıcı veriyi korumak için en doğru çözüm hangisidir?

- A) Named volume kullanmak
- B) Container içine yazmak
- C) Image’a gömmek
- D) Sadece RAM kullanmak

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **A**

</details>

---

## Soru 6: Bind mount için en doğru ifade hangisidir?

- A) Docker’ın tamamen yönettiği alandır
- B) Host klasörünü doğrudan bağlar
- C) Network ayarıdır
- D) Sadece Windows’ta çalışır

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **B**

</details>

---

## Soru 7: Aynı Docker networkündeki servisler birbirine nasıl erişir?

- A) Container/service adı ile
- B) Sadece public IP ile
- C) Sadece localhost ile
- D) Sadece MAC adresi ile

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **A**

</details>

---

## Soru 8: `depends_on` neyi garanti eder?

- A) Servis hazır olma durumunu
- B) Healthcheck sonucunu
- C) Sadece başlatma sırasını
- D) Port çakışmasını engellemeyi

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **C**

</details>

---

## Soru 9: Compose’da çoklu env yönetimi için en yaygın dosya hangisidir?

- A) `README.md`
- B) `.env`
- C) `.dockerignore`
- D) `Dockerfile`

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **B**

</details>

---

## Soru 10: Secret’ı Dockerfile içine yazmak neden risklidir?

- A) Image layer’larına gömülür
- B) Build hızını artırır
- C) Portları kapatır
- D) Container sayısını artırır

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **A**

</details>

---

## Soru 11: İlk debug adımında en kritik komutlar hangileridir?

- A) `docker login` + `docker push`
- B) `docker tag` + `docker pull`
- C) `docker ps -a` + `docker logs`
- D) `docker volume ls` + `docker network rm`

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **C**

</details>

---

## Soru 12: `Exited (137)` en çok neyi işaret eder?

- A) Başarılı kapanış
- B) DNS çözümleme başarısı
- C) Port eşleşmesi
- D) OOM kill / zorla sonlandırma

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **D**

</details>

---

## Soru 13: Hardening açısından non-root çalıştırmanın faydası nedir?

- A) Saldırı etkisini azaltır
- B) Port sayısını artırır
- C) Build’i hızlandırır
- D) Compose’u kaldırır

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **A**

</details>

---

## Soru 14: `--cap-drop=ALL` hangi ilkeye uygundur?

- A) Maximum privileges
- B) Least privilege
- C) Stateless runtime
- D) Mutable infrastructure

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **B**

</details>

---

## Soru 15: Build performansı için doğru Dockerfile sırası hangisi?

- A) Önce tüm source, sonra dependency
- B) Önce dependency dosyaları, sonra source
- C) Önce CMD, sonra FROM
- D) Sadece tek satır COPY

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **B**

</details>

---

## Soru 16: CI/CD’de `sha-*` tag ne sağlar?

- A) Görsel düzen
- B) Port güvenliği
- C) Immutable izlenebilirlik
- D) Daha az RAM kullanımı

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **C**

</details>

---

## Soru 17: Compose’dan Kubernetes’e geçişte doğru yaklaşım hangisidir?

- A) Compose’u birebir kopyalamak
- B) Readiness/liveness modeline geçmek
- C) Sadece image adını değiştirmek
- D) Tüm servisleri tek pod’a almak

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **B**

</details>

---

## Soru 18: Reverse proxy (Nginx) fullstack yapıda neden kullanılır?

- A) Sadece CSS için
- B) Volume temizlemek için
- C) Image küçültmek için
- D) Tek giriş noktası ve `/api` yönlendirmesi için

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **D**

</details>

---

## Soru 19: Docker Desktop + WSL’de komutlar çalışmıyorsa ilk ne kontrol edilir?

- A) WSL integration ayarı
- B) Tarayıcı cache
- C) Markdown formatı
- D) Git branch adı

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **A**

</details>

---

## Soru 20: Gordon en çok hangi konuda faydalıdır?

- A) BIOS ayarı
- B) Komut/hata açıklama desteği
- C) GPU overclock
- D) DNS hosting

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **B**

</details>

---

## Soru 21: API container çalışıyor ama erişilemiyor. İlk kontrol nedir?

- A) Volume boyutu
- B) Port publish + app bind (`0.0.0.0`)
- C) README uzunluğu
- D) Image rengi

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **B**

</details>

---

## Soru 22: `depends_on` var ama DB hazır değil. En doğru çözüm?

- A) Servis adını kısaltmak
- B) Healthcheck + retry/wait eklemek
- C) Portu gizlemek
- D) Dockerfile silmek

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **B**

</details>

---

## Soru 23: Her kod değişiminde dependency yeniden kuruluyor. Olası sebep?

- A) Cache dostu layer yok
- B) CPU hızlı
- C) Nginx eksik
- D) Network fazla

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **A**

</details>

---

## Soru 24: Security review root user bulgusu verdi. Minimum doğru aksiyon?

- A) Portu değiştir
- B) Container adını değiştir
- C) Dockerfile’da non-root user ve `USER` kullan
- D) Compose kaldır

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **C**

</details>

---

## Soru 25: Disk çok doldu. En pratik ilk temizlik adımı hangisi?

- A) `docker system prune -f`
- B) Sistemi formatla
- C) Sadece `docker ps`
- D) `.env` sil

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **A**

</details>

---

## Soru 26: Rollback için en doğru deploy alışkanlığı hangisi?

- A) Sadece `latest` kullan
- B) Versioned/immutable tag kullan
- C) Tag kullanma
- D) Her deploy aynı image adıyla ama tagsiz

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **B**

</details>

---

## Soru 27: `name or service not known` hatasında ilk şüphe ne olmalı?

- A) RAM düşüklüğü
- B) Disk boyutu
- C) CPU fan devri
- D) Yanlış servis adı veya network ayrılığı

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **D**

</details>

---

## Soru 28: Frontend-API CORS sorununu mimari olarak en temiz nasıl çözersin?

- A) CORS’u tamamen kapat
- B) API’yi sil
- C) Nginx reverse proxy ile tek origin kullan
- D) Sadece port değiştir

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **C**

</details>

---

## Soru 29: Secret image içinde bulundu. En olası sebep nedir?

- A) Dockerfile/COPY ile secret gömülmesi
- B) Runtime env kullanımı
- C) Healthcheck eksikliği
- D) `docker ps` fazla çalıştırma

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **A**

</details>

---

## Soru 30: Docker Desktop açık, komut yok. İlk teknik aksiyon?

- A) Repo sil
- B) Portu 1 yap
- C) Tailwind kaldır
- D) WSL integration + distro seçimi kontrol et

<details>
<summary>Cevabı göster</summary>

✅ Doğru cevap: **D**

</details>

---
