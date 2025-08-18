# API Спецификация: IT Speed Dating

Версия: 1.0.0

## Базовый URL

-   `http://localhost:4090/api`

## Аутентификация

Пока не определена. В будущем — через валидацию `initData` Telegram Mini App.

---

## 1. Гостевые эндпоинты (`/guest`)

### 1.1. Регистрация пользователя

-   **Endpoint:** `POST /users/register`
-   **Описание:** Создает нового пользователя (участника).
-   **Request Body:**
    ```json
    {
      "name": "Иван Иванов",
      "gender": "male",
      "photo": "data:image/jpeg;base64,...", // (опционально)
      "description": "Fullstack-разработчик, люблю Vue и Go."
    }
    ```
-   **Response (201 Created):**
    ```json
    {
      "id": "user-xyz-123",
      "name": "Иван Иванов",
      "gender": "male",
      "photo": "url_to_photo.jpg",
      "description": "Fullstack-разработчик, люблю Vue и Go.",
      "tableId": null
    }
    ```

### 1.2. Получение информации о пользователе

-   **Endpoint:** `GET /users/:userId`
-   **Описание:** Получает данные конкретного пользователя.
-   **Response (200 OK):**
    ```json
    {
      "id": "user-xyz-123",
      "name": "Иван Иванов",
      "gender": "male",
      "photo": "url_to_photo.jpg",
      "description": "Fullstack-разработчик, люблю Vue и Go.",
      "tableId": 1
    }
    ```

---

## 2. Админские эндпоинты (`/admin`)

### 2.1. Получение списка всех участников

-   **Endpoint:** `GET /participants`
-   **Описание:** Возвращает полный список зарегистрированных участников для админ-панели.
-   **Response (200 OK):**
    ```json
    [
      {
        "id": "participant-abc-456",
        "name": "Алексей Петров",
        "gender": "male",
        "registeredAt": "2024-08-20T19:00:00.000Z",
        "paid": true,
        "ready": true
      },
      {
        "id": "participant-def-789",
        "name": "Мария Иванова",
        "gender": "female",
        "registeredAt": "2024-08-20T19:01:00.000Z",
        "paid": false,
        "ready": false
      }
    ]
    ```

### 2.2. Обновление участника

-   **Endpoint:** `PATCH /participants/:participantId`
-   **Описание:** Обновляет частичные данные участника (например, статус `ready` или `paid`).
-   **Request Body:**
    ```json
    {
      "ready": true,
      "paid": true
    }
    ```
-   **Response (200 OK):**
    ```json
    {
      "id": "participant-def-789",
      "name": "Мария Иванова",
      "gender": "female",
      "registeredAt": "2024-08-20T19:01:00.000Z",
      "paid": true,
      "ready": true
    }
    ```

### 2.3. Удаление участника

-   **Endpoint:** `DELETE /participants/:participantId`
-   **Описание:** Удаляет участника из системы.
-   **Response (204 No Content):**
    Успешный ответ не содержит тела.

---
