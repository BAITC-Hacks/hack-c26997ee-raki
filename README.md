# Аким на 5 часов (Abeke)

Городской симулятор с React + TypeScript интерфейсом и Python backend. Официальные наборы данных находятся в `data/`: `districts.json`, `measures.json` и `scoring.json`.

## Frontend

Требуется Node.js с npm. Установите зависимости и запустите Vite:

```powershell
npm.cmd install
npm.cmd run dev
```

Откройте адрес Vite (обычно `http://localhost:5173`). Основной интерфейс симулятора реализован в `src/main.tsx`, `src/App.tsx` и `src/pages/SimulatorPage.tsx`. Проверки: `npm.cmd run typecheck` и `npm.cmd run build`.

Для входа через Supabase скопируйте `.env.example` в `.env.local` и заполните `VITE_SUPABASE_URL` и `VITE_SUPABASE_PUBLISHABLE_KEY`. Без этих переменных симулятор доступен локально без авторизации. Публичный ключ используется только в браузере; секретный ключ туда не помещайте.

## Backend API

Требуется Python 3.11+ и проект Supabase. Установите зависимости в виртуальном окружении:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

Скопируйте `backend/.env.example` в `backend/.env` и заполните `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `FRONTEND_URL`. Для AI-функций можно задать `OPENAI_API_KEY` и `OPENAI_MODEL` по образцу корневого `.env.example`. Примените `supabase/schema.sql` в проекте Supabase и загрузите данные из официальных JSON согласно схеме. Затем запустите API из корня репозитория:

```powershell
uvicorn backend.main:app --reload --port 8000
```

`GET /health` проверяет доступность сервера. `GET /api/me`, `/api/districts`, `/api/measures`, `/api/scenarios` и `POST /api/scenarios` требуют заголовок `Authorization: Bearer <Supabase access token>`. Документация FastAPI доступна по адресу `http://localhost:8000/docs`.

Локальный движок расчёта сценариев находится в `services/`; код AI-сервисов — в `app/ai/`. Данные в `data/` являются источником истины для расчётов и интерфейса.
