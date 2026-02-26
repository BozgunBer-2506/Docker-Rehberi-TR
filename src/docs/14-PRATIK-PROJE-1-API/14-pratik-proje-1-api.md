# Pratik Proje 1 - API (FastAPI + PostgreSQL)

## Amaç

Bu bölümde Docker Compose ile gerçek bir backend stack’ini ayağa kaldıracaksın:

- FastAPI
- PostgreSQL
- Alembic migration
- Healthcheck
- Kalıcı veri (volume)

---

## Proje Yapısı

```text
project/
├─ app/
│ ├─ main.py
│ ├─ db.py
│ ├─ models.py
│ └─ routes.py
├─ alembic/
├─ alembic.ini
├─ requirements.txt
├─ Dockerfile
└─ compose.yml
```

---

## 1) `requirements.txt`

```txt
fastapi==0.115.0
uvicorn[standard]==0.30.6
sqlalchemy==2.0.35
psycopg2-binary==2.9.9
alembic==1.13.2
python-dotenv==1.0.1
```

---

## 2) `app/db.py`

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:secret@db:5432/appdb")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```

---

## 3) `app/models.py`

```python
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from .db import Base

class Item(Base):
__tablename__ = "items"

id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
name: Mapped[str] = mapped_column(String(255), nullable=False)
```

---

## 4) `app/main.py`

```python
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from .db import SessionLocal
from .models import Item

app = FastAPI(title="Docker FastAPI Demo")

def get_db():
db = SessionLocal()
try:
yield db
finally:
db.close()

@app.get("/health")
def health(db: Session = Depends(get_db)):
db.execute(text("SELECT 1"))
return {"status": "ok"}

@app.post("/items")
def create_item(name: str, db: Session = Depends(get_db)):
item = Item(name=name)
db.add(item)
db.commit()
db.refresh(item)
return {"id": item.id, "name": item.name}

@app.get("/items")
def list_items(db: Session = Depends(get_db)):
items = db.query(Item).all()
return [{"id": i.id, "name": i.name} for i in items]
```

---

## 5) `Dockerfile`

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 6) `compose.yml`

```yaml
services:
api:
build: .
container_name: fastapi-api
ports:
- "8000:8000"
environment:
DATABASE_URL: postgresql://postgres:secret@db:5432/appdb
depends_on:
- db

db:
image: postgres:16
container_name: fastapi-db
environment:
POSTGRES_PASSWORD: secret
POSTGRES_DB: appdb
volumes:
- pgdata:/var/lib/postgresql/data
ports:
- "5432:5432"
healthcheck:
test: ["CMD-SHELL", "pg_isready -U postgres -d appdb"]
interval: 5s
timeout: 3s
retries: 10

volumes:
pgdata:
```

---

## 7) Çalıştırma

```bash
docker compose up -d --build
docker compose logs -f
```

---

## 8) Migration (Opsiyonel ama önerilir)

Alembic init sonrası migration üret:

```bash
alembic revision --autogenerate -m "create items table"
alembic upgrade head
```

Container içinde çalıştırmak istersen:

```bash
docker compose exec api alembic upgrade head
```

---

## 9) Test

Health:

```bash
curl http://localhost:8000/health
```

Item ekle:

```bash
curl -X POST "http://localhost:8000/items?name=kalem"
```

Listele:

```bash
curl http://localhost:8000/items
```

Swagger:

- http://localhost:8000/docs

---

## 10) Temizlik

```bash
docker compose down
```

Volume dahil reset:

```bash
docker compose down -v
```

---

## Sık Hatalar

### 1) API DB’ye bağlanamıyor

- `DATABASE_URL` host kısmı `db` olmalı
- DB hazır olmadan API başlamış olabilir

### 2) Migration table oluşmuyor

- Alembic path/config kontrol et
- Container içinde doğru çalışma dizininde çalıştır

### 3) Port çakışması

- 5432/8000 doluysa farklı host port kullan

---

## Özet

Bu proje ile:

- API + DB stack kurdun
- Volume ile veriyi kalıcı yaptın
- Healthcheck ve basic CRUD endpointlerini çalıştırdın
- Compose tabanlı backend geliştirme akışını oturttun

## Mini Kontrol Listesi

- ✅ FastAPI + Postgres compose stack’ini ayağa kaldırabiliyorum
- ✅ `DATABASE_URL` ve servis isimleriyle bağlantıyı doğru kuruyorum
- ✅ Health endpoint ile servis durumunu doğrulayabiliyorum
- ✅ Basit CRUD endpointlerini test edebiliyorum
- ✅ Volume ile DB verisini kalıcı tutabiliyorum
