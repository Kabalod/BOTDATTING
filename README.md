# IT Speed Dating - Telegram Mini App

Полнофункциональное мини-приложение для IT Speed Dating в Telegram, построенное на Next.js.

## Архитектура (Feature-Sliced Design)

Проект реструктурирован для лучшей модульности и масштабируемости.

-   `app/` - Маршруты и корневые макеты.
-   `providers/` - Глобальные провайдеры (темы, Telegram API).
-   `features/` - Функциональные модули (фичи).
    -   `welcome/` - Приветственный чат.
    -   `guest/` - Пользовательский флоу (регистрация, ожидание, дейтинг).
    -   `admin/` - Панель администратора.
-   `shared/` - Переиспользуемый код.
    -   `ui/` - UI-компоненты (shadcn/ui).
    -   `hooks/` - Кастомные хуки.
    -   `lib/` - Вспомогательные утилиты.

## Запуск и переменные окружения

1.  **Запуск через Docker (рекомендовано для системного теста):**
    - Порты по умолчанию:
      - Web (Next.js): `http://localhost:3090`
      - API (NestJS): `http://localhost:4090/api`
    - Команды:
      ```bash
      docker-compose build --no-cache
      docker-compose up -d
      docker-compose ps
      ```
    - Остановка:
      ```bash
      docker-compose down
      ```
    - Переменные окружения, проброшенные в web:
      - `NEXT_PUBLIC_API_URL` (по умолчанию в `docker-compose.yml`: `http://localhost:4090/api`)

    Примечания:
    - API слушает `0.0.0.0` и использует глобальный префикс `/api`.
    - Если порты 3090/4090 заняты, отредактируйте маппинг в `docker-compose.yml` (например, `3190:3000` и `4190:3001`).

2.  **Локальная разработка (без Docker):**
    ```bash
    npm install --legacy-peer-deps
    npm run dev
    ```
    Приложение по умолчанию доступно на `http://localhost:3000`.

3.  **Переменные окружения:**
    Скопируйте пример конфигурации и настройте переменные:
    ```bash
    cp env.example .env.local
    ```

    Основные переменные:
    ```env
    # API Configuration
    NEXT_PUBLIC_API_URL="http://localhost:3001/api"

    # Telegram Bot Configuration (получить у @BotFather)
    NEXT_PUBLIC_TELEGRAM_BOT_USERNAME="your_bot_username"
    TELEGRAM_BOT_TOKEN="your_telegram_bot_token"

    # Database Configuration
    DB_HOST="localhost"
    DB_PORT="5432"
    DB_USERNAME="postgres"
    DB_PASSWORD="password"
    DB_DATABASE="botdatting"

    # Redis Configuration
    REDIS_HOST="localhost"
    REDIS_PORT="6379"
    ```

    **Настройка Telegram Bot:**
    1. Перейдите к [@BotFather](https://t.me/botfather) в Telegram
    2. Создайте нового бота командой `/newbot`
    3. Получите токен и username бота
    4. Установите webhook (для продакшена): `https://yourdomain.com/api/telegram/webhook`

## Известные примечания

- В Docker-образах используется `pnpm`. На этапе сборки возможны предупреждения вида `Ignored build scripts`; это ожидаемо и не мешает запуску.
- Контекст сборки оптимизирован с помощью `.dockerignore`/`api/.dockerignore` (исключены `node_modules`, билд-артефакты и пр.).
- В `docker-compose.yml` убран устаревший ключ `version` и не переопределяется `command` для web-образа.

## Задачи агентов

-   **Агент #1 (Frontend):** Рефакторинг, UI/UX, интеграция с API.
-   **Агент #2 (Backend):** Проектирование и разработка API, БД, бизнес-логики.
-   **Агент #3 (DevOps):** Docker, CI/CD, настройка окружения.

Для запуска внутри Telegram WebApp используйте публичный URL (ngrok/Cloudflare Tunnel) и укажите его в настройках Mini App у бота.
