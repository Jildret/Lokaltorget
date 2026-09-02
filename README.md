# Lokaltorget

En digital plattform för att koppla ihop fastighetsägare med lediga kommersiella lokaler och företag som söker lokal.

## Teknisk stack

- **Backend:** Python + FastAPI + SQLAlchemy + Alembic
- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Databas:** PostgreSQL
- **Utvecklingsmiljö:** Docker + Docker Compose

## Kom igång

### Förutsättningar

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installerat och igång
- Node.js (för lokal frontend-utveckling utanför Docker, valfritt)
- Python 3.13+ (för lokal backend-utveckling utanför Docker, valfritt)

### 1. Klona/hämta projektet

```powershell
cd lokaltorget
```

### 2. Skapa miljövariabler

Kopiera exempelfilen och fyll i dina egna värden:

```powershell
cd backend
copy .env.example .env
```

Öppna `.env` och sätt en egen `SECRET_KEY` (generera en säker en med):

```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```

### 3. Starta hela appen

I roten av projektet:

```powershell
docker compose up --build
```

Detta startar:
- PostgreSQL-databasen på port `5432`
- Backend (FastAPI) på port `8000`
- Frontend (React/Vite) på port `5173`

### 4. Kör databasmigrationer

I en ny terminal:

```powershell
docker compose exec backend alembic upgrade head
```

### 5. Öppna appen

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API-dokumentation: [http://localhost:8000/docs](http://localhost:8000/docs)

## Projektstruktur

```
lokaltorget/
├── backend/          # FastAPI-backend
│   ├── app/
│   │   ├── api/      # API-endpoints
│   │   ├── models/   # Databasmodeller
│   │   ├── schemas/  # Pydantic-scheman
│   │   ├── auth/     # Autentisering
│   │   └── database.py
│   └── alembic/      # Databasmigrationer
├── frontend/         # React-frontend
│   └── src/
│       ├── pages/
│       ├── components/
│       └── auth/
└── docker-compose.yml
```

## Funktioner (MVP)

- Registrering och inloggning
- Lägga upp, redigera och ta bort lokalannonser
- Sökning och filtrering av lokaler
- "Jag söker lokal"-formulär
- Intresseanmälningar (leads)
- Adminpanel med manuell matchning mellan lokaler och sökande

## Framtida funktioner

- AI-baserad matchning (arkitekturen är förberedd för detta via `Match`-modellen)
- Betalningar/premiumtjänster
- Digital bokning av visningar