# Cinema API — ДЗ 1 (NestJS)

REST API кінотеатру: адміністратор створює фільми й зали та планує сеанси, відвідувач
переглядає розклад на день, бачить схему залу з вільними й зайнятими місцями та бронює
одне або кілька місць.

Бази даних немає: усі дані зберігаються в масивах усередині сервісів і зникають після
перезапуску застосунку.

## Вимоги

- Node.js 22 LTS (22.13+) або новіший, npm
- (за бажанням) VS Code з розширенням [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) для `requests.http`

## Встановлення

```bash
npm install
```

(або `npm ci` — точне встановлення версій із `package-lock.json`).

## Змінні оточення

Створіть файл `.env` у корені проєкту за зразком `.env.example`:

```bash
cp .env.example .env
```

| Змінна | Опис | Допустимі значення | Приклад | За замовчуванням |
| --- | --- | --- | --- | --- |
| `PORT` | Порт HTTP-сервера | ціле число 1–65535 | `3000` | `3000` |
| `NODE_ENV` | Режим запуску | `development`, `production`, `test` | `development` | `development` |

Приклад `.env` (такий самий вміст має `.env.example`):

```dotenv
PORT=3000
NODE_ENV=development
```

`.env` завантажує `@nestjs/config` (`ConfigModule.forRoot({ isGlobal: true, validate })`).
Змінні перевіряються класом `EnvironmentVariables` (`src/config/environment-variables.ts`):
з неправильним значенням (наприклад `NODE_ENV=staging`) застосунок не стартує й пише, яка змінна
некоректна. `main.ts` читає порт через `ConfigService`. Змінні, задані в оболонці, мають пріоритет над `.env`.

## Запуск

```bash
# режим розробки (перезапуск при змінах)
npm run start:dev

# звичайний запуск
npm run start

# production-збірка
npm run build
npm run start:prod
```

Після запуску:

- API: http://localhost:3000
- Swagger UI: http://localhost:3000/docs
- OpenAPI JSON: http://localhost:3000/docs-json

## Перевірка запитами

Файл [`requests.http`](requests.http) містить запити до кожного маршруту (фільми → зали →
сеанси → бронювання) і до кожного описаного в завданні випадку помилки. Запустіть сервер і
виконуйте запити по черзі зверху вниз: ідентифікатори підставляються з відповідей попередніх
запитів (`# @name` + `{{createFilm.response.body.$.id}}`), біля кожного запиту вказано очікуваний статус.

## Тести та якість коду

```bash
npm run lint      # ESLint + Prettier
npm test          # unit-тести
npm run test:e2e  # e2e-тест основного сценарію
```

## Огляд API

| Метод | Маршрут | Опис | Коди |
| --- | --- | --- | --- |
| POST | `/films` | Створити фільм (`title`, `durationMinutes`, `releaseYear`) | 201, 400 |
| GET | `/films` | Список фільмів | 200 |
| GET | `/films/:id` | Фільм за id | 200, 400, 404 |
| PATCH | `/films/:id` | Оновити будь-яку підмножину полів | 200, 400, 404 |
| DELETE | `/films/:id` | Видалити фільм | 204, 400, 404, 409 |
| POST | `/halls` | Створити зал (`name`, `rows`, `seatsPerRow`) | 201, 400, 409 |
| GET | `/halls` | Список залів | 200 |
| GET | `/halls/:id` | Зал + масив `seats` (`rows × seatsPerRow` місць) | 200, 400, 404 |
| DELETE | `/halls/:id` | Видалити зал | 204, 400, 404, 409 |
| POST | `/showings` | Запланувати сеанс (`filmId`, `hallId`, `startsAt`, `price`) | 201, 400 |
| GET | `/showings?filmId=&date=` | Розклад із фільтрами | 200, 400 |
| GET | `/showings/:id` | Сеанс за id | 200, 400, 404 |
| GET | `/showings/:id/seats` | Усі місця залу з ознакою `isBooked` | 200, 400, 404 |
| GET | `/bookings` | Усі бронювання | 200 |
| POST | `/showings/:id/bookings` | Забронювати місця (`seats: [{ row, seat }]`) | 201, 400, 404, 409 |
| GET | `/showings/:id/bookings` | Бронювання сеансу | 200, 400, 404 |
| DELETE | `/bookings/:id` | Скасувати бронювання (місця звільняються) | 204, 400, 404 |

### Правила

- Ідентифікатори — UUID (`randomUUID()` з `node:crypto`). Неіснуючий id → **404**,
  рядок, що не є UUID, → **400** (`ParseUUIDPipe`).
- Ціни — цілі числа в копійках (125 грн = `12500`), `totalPrice = price × кількість місць`.
- Назва залу унікальна (без урахування регістру й пробілів по краях) → інакше **409**.
- Обмеження, яких немає в завданні, але які захищають від абсурдних даних: зал — не більше
  1000 рядів і 1000 місць у ряду; `releaseYear` — ціле число від 1888 до поточного року + 10;
  `title` — до 200 символів, `name` залу — до 100.
- Фільм або зал, на який посилається хоча б один сеанс, видалити не можна → **409**.
- `POST /showings`: неіснуючий `filmId` або `hallId` → **400** з причиною в `message`;
  `startsAt` — дата й час ISO 8601 у майбутньому, `price` — ціле додатне число.
- Бронювання атомарне: якщо хоча б одне місце зайняте → **409**, і не бронюється жодне.
  Повтор місця в масиві → **400**, місце поза залом → **400**.
- Поля, яких немає в DTO (зокрема зайві query-параметри), відхиляються з **400**
  (`whitelist` + `forbidNonWhitelisted`).
- `PATCH /films/:id` приймає будь-яку підмножину полів (`UpdateFilmDto = PartialType(CreateFilmDto)`);
  поля зі значенням `null` ігноруються.

### Час і фільтр за датою

- `startsAt` приймається у форматі ISO 8601 з датою і часом, наприклад `2030-01-15T18:00:00Z`
  або `2030-01-15T21:00:00+03:00`. Якщо зсув часового поясу не вказано, час вважається **UTC**.
- Сервер зберігає й повертає `startsAt` у UTC (`2030-01-15T18:00:00.000Z`).
- `GET /showings?date=YYYY-MM-DD` повертає сеанси, що починаються цього дня **за UTC**
  (дата береться з `startsAt` у UTC). Неправильний формат або неіснуючий день (`2030-02-30`) → **400**.
- Розклад відсортований за `startsAt` за зростанням, при однаковому часі — за `id`.
- У відповідях сеансів замість `filmId`/`hallId` повертаються `filmTitle` і `hallName`.

### Формат помилок

Усі помилки мають єдиний формат (глобальний `HttpExceptionFilter`, `src/common/filters/http-exception.filter.ts`):

```json
{
  "statusCode": 400,
  "timestamp": "2026-10-22T11:46:23.776Z",
  "path": "/showings",
  "message": ["price має бути додатним числом"],
  "error": "Bad Request"
}
```

`message` — рядок або масив рядків (для помилок валідації DTO) українською мовою і завжди називає
причину: яке поле не пройшло перевірку (для вкладених — повний шлях, як-от `seats.0.row`) або який
запис не знайдено. Кожна помилка логується через `Logger` (рівень `warn` для 4xx, `error` для 5xx).

## Структура

```
src/
├── main.ts                       # ValidationPipe → HttpExceptionFilter → Swagger (/docs) → listen
├── app.module.ts                 # ConfigModule + доменні модулі (лише збирає модулі)
├── config/environment-variables.ts
├── common/
│   ├── dto/error-response.dto.ts # схема помилки для Swagger
│   ├── filters/http-exception.filter.ts
│   ├── pipes/parse-uuid.pipe.ts  # ParseUUIDPipe з українським повідомленням
│   ├── utils/date.utils.ts
│   ├── validation/validation-exception.factory.ts
│   └── validators/               # власні валідатори: дата в майбутньому, календарна дата, унікальні місця
├── films/                        # FilmsModule: фільми
├── halls/                        # HallsModule: зали та обчислення списку місць
├── showings/                     # ShowingsCoreModule (сховище) + ShowingsModule (сеанси, розклад)
└── bookings/                     # BookingsModule: бронювання та схема місць сеансу
```

Кожен доменний модуль має контролер (приймає запит, викликає сервіс, повертає результат) і сервіс
(бізнес-правила та приватний масив даних). Модулі спілкуються лише через експортовані провайдери.

### Залежності між модулями (без циклів і без `forwardRef`)

```
ShowingsCoreModule (ShowingsStore)      ← не залежить ні від кого
   ↑            ↑            ↑
FilmsModule  HallsModule     │
   ↑            ↑            │
   └──── ShowingsModule ─────┘          (ShowingsService)
              ↑      HallsModule
              └──── BookingsModule      (BookingsService)
```

- Сеансам потрібні фільми й зали (перевірка існування, назви у відповідях), а видаленню фільму
  чи залу потрібні сеанси (заборона з 409). Щоб не було циклу `Films ↔ Showings`, спільну
  частину винесено в окремий модуль: `ShowingsCoreModule` експортує `ShowingsStore` — сервіс,
  що володіє приватним масивом сеансів і відповідає на `hasShowingsForFilm` / `hasShowingsForHall`.
- `FilmsModule` і `HallsModule` імпортують лише `ShowingsCoreModule`.
- `ShowingsModule` імпортує `ShowingsCoreModule`, `FilmsModule`, `HallsModule`; `ShowingsService`
  перевіряє існування фільму й залу та зберігає сеанси через `ShowingsStore`.
- `BookingsModule` імпортує `ShowingsModule` і `HallsModule`. Маршрути `/showings/:id/bookings` і
  `/showings/:id/seats` обслуговує `BookingsController`, бо вони залежать від стану бронювань.
