# Orkestrasyona Geçiş

## Amaç

Bu bölümde tek host Docker kullanımından orkestrasyon dünyasına geçişi anlayacak, Docker Compose ile Kubernetes yaklaşımı arasındaki zihinsel haritayı kuracaksın.

---

## Neden Orkestrasyon Gerekir?

Tek makinede birkaç container çalıştırmak kolaydır.
Ama production’da ihtiyaçlar büyür:

- Yük arttığında otomatik ölçekleme
- Servis self-healing
- Rolling update / rollback
- Çok node üzerinde dağıtım
- Merkezi gözlemlenebilirlik

Bu noktada orkestrasyon devreye girer.

---

## Docker Compose vs Orchestration

Compose güçlü bir local/dev aracıdır, ancak cluster ölçeğinde sınırlıdır.

| Özellik           | Docker Compose        | Kubernetes          |
| ----------------- | --------------------- | ------------------- |
| Hedef             | Local/dev, basit prod | Büyük ölçek/cluster |
| Ölçekleme         | Sınırlı               | Güçlü, otomasyonlu  |
| Self-healing      | Kısıtlı               | Native              |
| Rolling update    | Sınırlı               | Native              |
| Service discovery | Temel                 | Gelişmiş            |
| Ekosistem         | Basit                 | Çok geniş           |

---

## Temel Kubernetes Kavramları (Giriş)

- **Pod:** En küçük deploy birimi (1+ container)
- **Deployment:** Pod yaşam döngüsü ve update yönetimi
- **Service:** Pod’lara sabit erişim katmanı
- **ConfigMap / Secret:** Konfigürasyon ve hassas veri yönetimi
- **Ingress:** Dış dünyadan HTTP erişim yönlendirme

---

## Zihinsel Eşleşme (Compose → Kubernetes)

| Compose        | Kubernetes karşılığı                  |
| -------------- | ------------------------------------- |
| `services.api` | `Deployment + Service`                |
| `environment`  | `ConfigMap/Secret`                    |
| `depends_on`   | Readiness/Liveness + startup strategy |
| `volumes`      | `PVC/PV`                              |
| `ports`        | `Service` / `Ingress`                 |
| `scale`        | `replicas`                            |

---

## Compose Örneği

```yaml
services:
api:
image: myapp:1.0.0
ports:
- "8000:8000"
environment:
DB_HOST: db
db:
image: postgres:16
```

---

## Benzer Kubernetes Yaklaşımı (Basitleştirilmiş)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
name: api
spec:
replicas: 2
selector:
matchLabels:
app: api
template:
metadata:
labels:
app: api
spec:
containers:
- name: api
image: myapp:1.0.0
env:
- name: DB_HOST
value: db
ports:
- containerPort: 8000
---
apiVersion: v1
kind: Service
metadata:
name: api
spec:
selector:
app: api
ports:
- port: 80
targetPort: 8000
```

---

## Geçiş Stratejisi (Pratik)

1. Dockerfile kalitesini artır (non-root, healthcheck, küçük image)
2. Compose yapısını netleştir (env, volume, network)
3. Uygulamanı stateless/stateful olarak ayır
4. Health/readiness endpoint ekle
5. Sonra Kubernetes’e geç

---

## Geçişten Önce Hazırlık Checklist

- Uygulama config’i env üzerinden yönetiliyor mu?
- Image deterministic ve pinlenmiş mi?
- Health endpoint var mı?
- Loglar merkezi toplamaya uygun mu?
- Stateful servisler için persistence planı hazır mı?

---

## Sık Yanlışlar

### 1) Compose dosyasını birebir K8s’e çevirmeye çalışmak

Kavramlar benzer ama birebir eşdeğer değil.

### 2) `depends_on` mantığını K8s’te aramak

K8s’te readiness/liveness yaklaşımı kullanılır.

### 3) Uygulama state yönetimini planlamadan geçiş

Stateful workload’lar için storage tasarımı kritik.

---

## Küçük Başlangıç Planı

- Local: Docker Compose
- Staging: k3s/minikube ile test
- Prod: Managed Kubernetes (EKS/GKE/AKS) veya güçlü Docker stack

---

## Özet

- Orkestrasyon, ölçek ve operasyon karmaşıklığı arttığında gereklidir.
- Compose’tan K8s’e geçiş bir dosya dönüşümü değil, operasyonel model geçişidir.
- Sağlam Docker temeli, geçiş süresini ciddi kısaltır.

## Mini Kontrol Listesi

- ✅ Compose ile orkestrasyon farkını açıklayabiliyorum
- ✅ Pod/Deployment/Service temelini anladım
- ✅ Compose → Kubernetes zihinsel eşleşmesini kurabiliyorum
- ✅ Geçiş öncesi teknik gereksinimleri listeleyebiliyorum
- ✅ Orkestrasyona adım adım geçiş planı çıkarabiliyorum
