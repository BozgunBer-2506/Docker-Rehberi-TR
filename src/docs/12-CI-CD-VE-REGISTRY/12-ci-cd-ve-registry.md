# CI/CD ve Registry

## Amaç

Bu bölümde Docker image’larını otomatik build/push etmeyi, sürümlemeyi ve CI/CD pipeline içinde güvenli dağıtım akışını öğreneceksin.

---

## CI/CD’de Docker Neden Önemli?

CI/CD sürecinde Docker sayesinde:

- Build ortamı standardize olur
- Test/deploy adımları tekrarlanabilir hale gelir
- Artifact olarak image kullanılabildiği için teslimat netleşir

---

## Registry Nedir?

Registry, Docker image’larının depolandığı yerdir.

Yaygın örnekler:

- Docker Hub
- GitHub Container Registry (GHCR)
- GitLab Container Registry
- AWS ECR

---

## Tag Stratejisi

İyi bir tag politikası kritik.

Önerilen kombinasyon:

- `latest` (opsiyonel)
- `v1.4.0` (release)
- `sha-<short-commit>` (immutable izlenebilirlik)

Örnek:

- `myapp:1.0.0`
- `myapp:sha-a1b2c3d`
- `myapp:latest`

---

## Local Build ve Push Örneği

```bash
docker build -t youruser/myapp:1.0.0 .
docker push youruser/myapp:1.0.0
```

---

## GitHub Actions ile Otomatik Build/Push

`.github/workflows/docker.yml`:

```yaml
name: Docker CI

on:
push:
branches: [ "main" ]
tags: [ "v*" ]

jobs:
build-and-push:
runs-on: ubuntu-latest
permissions:
contents: read
packages: write

steps:
- name: Checkout
uses: actions/checkout@v4

- name: Set up QEMU
uses: docker/setup-qemu-action@v3

- name: Set up Docker Buildx
uses: docker/setup-buildx-action@v3

- name: Login to GHCR
uses: docker/login-action@v3
with:
registry: ghcr.io
username: ${{ github.actor }}
password: ${{ secrets.GITHUB_TOKEN }}

- name: Extract metadata
id: meta
uses: docker/metadata-action@v5
with:
images: ghcr.io/${{ github.repository }}

- name: Build and push
uses: docker/build-push-action@v6
with:
context: .
push: true
tags: ${{ steps.meta.outputs.tags }}
labels: ${{ steps.meta.outputs.labels }}
```

---

## Secrets Yönetimi (CI Tarafı)

CI içinde credential’ları plaintext tutma.

Kullan:

- GitHub Secrets / Variables
- Registry token
- Cloud provider scoped credential

---

## Deployment Akışı (Örnek)

1. `main` branch push
2. CI image build eder
3. Registry’ye push eder
4. Deploy job yeni image tag’i çekip servisi restart eder

---

## Rollback Stratejisi

Her deploy bir tag ile izlenmeli.

Rollback için:

```bash
docker pull youruser/myapp:1.0.0
docker run -d --name myapp-old youruser/myapp:1.0.0
```

İlke: “latest” yerine sürüm pinli deploy yap.

---

## İleri Seviye: Image Signing / Supply Chain

Daha güvenli pipeline için:

- Image signing (cosign)
- SBOM üretimi
- Policy enforcement

Bu adımlar özellikle enterprise ortamda önemlidir.

---

## Registry Temizliği

Zamanla eski image’lar büyür.

Politika belirle:

- Son N release kalsın
- Eski snapshot tag’ler otomatik silinsin
- Storage lifecycle kuralı uygulansın

---

## Sık Hatalar

### 1) Her deploy `latest` tag ile

Geri dönüş ve izlenebilirlik zorlaşır.

### 2) CI’da cache kullanılmaması

Build süreleri gereksiz uzar.

### 3) Registry login hataları

Token scope veya permission eksikliği.

---

## Özet

- Registry + doğru tag stratejisi CI/CD’nin omurgasıdır.
- Immutable tag yaklaşımı güvenilir deploy sağlar.
- Secret yönetimi ve pipeline güvenliği production kalitesinin parçasıdır.

## Mini Kontrol Listesi

- ✅ Image build/push akışını kurabiliyorum
- ✅ Tag stratejisini (release + sha) uygulayabiliyorum
- ✅ CI içinde registry login ve push yapabiliyorum
- ✅ Deploy/rollback için sürüm bazlı yaklaşım kullanabiliyorum
- ✅ Secret’ları CI platformu üzerinden güvenli yönetebiliyorum
