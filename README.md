# IT Speed Dating - Telegram Mini App

Полнофункциональное мини-приложение для IT Speed Dating в Telegram.

## Роли и пользовательский поток
- Гость: регистрация → ожидание старта → дейтинг → оценка встречи
- Админ: настройки события → управление участниками → запуск события

## Ключевые экраны и файлы
- Приветственный чат: `components/anna-welcome-chat.tsx`
- Welcome и роутер состояний: `app/page.tsx`
- Регистрация: `components/registration-form.tsx`
- Ожидание: `components/waiting-room.tsx`
- Дейтинг: `components/speed-dating-room.tsx`
- Админ-панель: `components/admin-panel.tsx`

## Дизайн
- Сине-фиолетовый градиент Pro IT FEST, стеклянные карточки, анимации.
- Контраст и читаемость: светлые карточки на темном градиенте, белая типографика.
- Глобальные стили и эффекты: `app/globals.css`.

## Интеграция Telegram Mini App
- Хук: `hooks/useTelegram.ts` (инициализация WebApp, expand, отслеживание темы).
- Провайдер: `components/TelegramProvider.tsx` (установка цветов заголовка/фона при поддержке).
- Подключение в макете с темами и тостерами: `app/layout.tsx`.

## Связка настроек события
- Источник настроек: `app/page.tsx` хранит `eventDate`, `eventTimeStr`, `roundDurationMin` и вычисляет `eventStartTime`.
- `AdminPanel` меняет настройки через `onEventSettingsChange` и отдает их вверх.
- `WaitingRoom` показывает обратный отсчет и динамическую метку старта.
- `SpeedDatingRoom` принимает `roundDurationMin` и использует его в таймере и прогрессе.

## Оценка и матчинг
- После раунда: "Хочу встретиться" или "Приятное знакомство".
- Отправка контактов через 24 часа пока заглушка (требуется сервер/джоб-шедулер).

## Запуск
1. Установка: `pnpm i` или `npm i`.
2. Dev: `pnpm dev` или `npm run dev`.
3. Prod: `pnpm build && pnpm start` или `npm run build && npm start`.

Для Telegram WebApp используйте публичный URL (ngrok/Cloudflare Tunnel) в настройках Mini App бота.
