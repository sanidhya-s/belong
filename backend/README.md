# 🏠 Belong Backend — Spring Boot + PostgreSQL

REST API backend for the [Belong](https://github.com/sanidhya-s/belong) community management React Native app.

---

## 🧱 Tech Stack

| Layer        | Technology                    |
|--------------|-------------------------------|
| Framework    | Spring Boot 3.2               |
| Language     | Java 17                       |
| Database     | PostgreSQL 16                 |
| Auth         | JWT (jjwt 0.12)               |
| QR Codes     | Google ZXing                  |
| Cache (OTP)  | Caffeine (in-memory, 10 min)  |
| Build        | Maven                         |

---

## 📦 Project Structure

```
src/main/java/com/belong/
├── BelongApplication.java
├── config/           # Security, CORS, Cache, CurrentUserResolver
├── controller/       # REST endpoints
├── dto/
│   ├── request/      # Incoming payloads
│   └── response/     # Outgoing responses
├── entity/           # JPA entities
├── exception/        # GlobalExceptionHandler, AppException
├── repository/       # Spring Data JPA repos
├── security/         # JWT filter, UserDetailsService
└── service/          # Business logic
```

---

## 🚀 Running Locally

### Option 1 — Docker Compose (recommended)

```bash
docker-compose up --build
```

App → http://localhost:8080  
Postgres → localhost:5432

### Option 2 — Run standalone

1. Start PostgreSQL and create a database:
```sql
CREATE DATABASE belong_db;
CREATE USER belong_user WITH PASSWORD 'belong_pass';
GRANT ALL PRIVILEGES ON DATABASE belong_db TO belong_user;
```

2. Run the app:
```bash
mvn spring-boot:run
```

---

## 🔐 Authentication — OTP Flow

All endpoints (except `/api/auth/**`) require a Bearer JWT token.

```
POST /api/auth/send-otp      { "phone": "9876543210" }
POST /api/auth/verify-otp    { "phone": "9876543210", "otp": "1234" }
  → returns { token, userId, phone, name, role, newUser }
```

> **Note**: In development the OTP is logged to console. Integrate with [MSG91](https://msg91.com/) or [Twilio](https://www.twilio.com/) for production SMS delivery.

---

## 📡 API Reference

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/send-otp` | Send OTP to phone |
| POST | `/api/auth/verify-otp` | Verify OTP → JWT token |

### Profile
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/profile` | Get current user profile |
| PATCH | `/api/profile` | Update name/email/avatar |

### Amenities
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/societies/{id}/amenities` | List amenities |
| POST | `/api/amenities/book` | Book a slot |
| GET | `/api/amenities/my-bookings` | My bookings |
| DELETE | `/api/amenities/bookings/{id}` | Cancel booking |

### Visitors
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/visitors` | Add a visitor |
| GET | `/api/visitors/my` | My visitor list |
| GET | `/api/visitors/society/{id}` | Society-wide visitors (admin/security) |
| PATCH | `/api/visitors/{id}/status` | Approve/Deny/CheckIn |

### Gate Passes
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/gate-passes/generate/{visitorId}` | Generate QR gate pass |
| GET | `/api/gate-passes/verify/{passCode}` | Verify pass code |
| GET | `/api/gate-passes/my` | My issued passes |

### Support Tickets
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/tickets` | Raise a ticket |
| GET | `/api/tickets/my` | My tickets |
| GET | `/api/tickets/society/{id}` | All society tickets |
| GET | `/api/tickets/{id}` | Single ticket detail |
| PATCH | `/api/tickets/{id}/status` | Update status |
| POST | `/api/tickets/{id}/comments` | Add comment |

### Payments
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/payments/dues` | Create due (ADMIN only) |
| POST | `/api/payments/{id}/pay` | Pay a due |
| GET | `/api/payments/my` | Transaction history |
| GET | `/api/payments/my/dues` | Pending dues |

### Notices
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/societies/{id}/notices` | Post notice |
| GET | `/api/societies/{id}/notices` | Get notices |
| DELETE | `/api/notices/{id}` | Delete notice |

### Community
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/posts` | Create post |
| GET | `/api/societies/{id}/posts` | Feed (filter by ?category=) |
| POST | `/api/posts/{id}/like` | Like a post |
| POST | `/api/posts/{id}/comments` | Comment on post |
| DELETE | `/api/posts/{id}` | Delete own post |

### Security
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/societies/{id}/security/contacts` | Guards & emergency numbers |

---

## 🔗 Connecting to the React Native Frontend

Replace mock data calls in `src/data/mockData.js` with real API calls:

```js
// src/api/client.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({ baseURL: 'http://YOUR_SERVER_IP:8080' });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/belong_db` | DB URL |
| `SPRING_DATASOURCE_USERNAME` | `belong_user` | DB user |
| `SPRING_DATASOURCE_PASSWORD` | `belong_pass` | DB password |
| `APP_JWT_SECRET` | (see properties) | Must be 256-bit in production |
| `APP_JWT_EXPIRATION_MS` | `2592000000` (30 days) | Token expiry |

---

## 🔮 Production Checklist

- [ ] Replace OTP console log with MSG91 / Twilio SMS integration
- [ ] Change `APP_JWT_SECRET` to a securely generated 256-bit key
- [ ] Integrate Razorpay webhook for payment verification
- [ ] Set `spring.jpa.hibernate.ddl-auto=validate` (use Flyway/Liquibase for migrations)
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Add rate limiting on `/api/auth/send-otp`
