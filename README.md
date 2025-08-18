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

1.  **Установка зависимостей:**
    ```bash
    npm install --legacy-peer-deps
    ```
2.  **Запуск в режиме разработки:**
    ```bash
    npm run dev
    ```
3.  **Переменные окружения:**
    Создайте файл `.env.local` в корне проекта и добавьте следующие переменные:
    ```env
    # Telegram Bot Credentials
    NEXT_PUBLIC_TELEGRAM_BOT_USERNAME="your_bot_username"
    TELEGRAM_BOT_TOKEN="your_telegram_bot_token"

    # API Base URL
    NEXT_PUBLIC_API_URL="http://localhost:4090/api"

    # Database connection (for backend)
    DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"

    # Redis connection (for backend jobs/cache)
    REDIS_URL="redis://localhost:6379"
    ```

## Задачи агентов

-   **Агент #1 (Frontend):** Рефакторинг, UI/UX, интеграция с API.
-   **Агент #2 (Backend):** Проектирование и разработка API, БД, бизнес-логики.
-   **Агент #3 (DevOps):** Docker, CI/CD, настройка окружения.

Для запуска внутри Telegram WebApp используйте публичный URL (ngrok/Cloudflare Tunnel) и укажите его в настройках Mini App у бота.
