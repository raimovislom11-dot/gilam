# Spring Boot REST API Contract — Gilam

Base URL: `http://localhost:8080`

All protected endpoints require: `Authorization: Bearer <JWT_TOKEN>`

---

## Auth

### POST `/api/auth/login`
**Public** — no token required

**Request body:**
```json
{ "login": "admin", "password": "admin" }
```

**Response `200 OK`:**
```json
{
  "token": "eyJhbGc...",
  "role": "ADMIN",
  "userId": 1,
  "login": "admin"
}
```

**Roles:** `ADMIN` | `OPERATOR` | `ISHCHI`

**Error `401`** when credentials are wrong.

---

## Orders

### GET `/api/orders`
**Protected** — requires Bearer token

**Query params (all optional):**
| Param | Type | Example | Description |
|---|---|---|---|
| `status` | string | `YANGI` | Filter by order status |
| `chiqarganOperatorId` | number | `2` | Filter sent orders by operator ID |

**Status values:** `YANGI` → `TAHRIRLANDI` → `ISHDA` → `TAYYOR` → `YUBORILDI`

**Response `200 OK`:** `Order[]`

```json
[
  {
    "id": 4000,
    "mijozIsmi": "Alisher Karimov",
    "manzil": "Yunusobod 12-uy",
    "telefon": "+998901234567",
    "izohOperator": "Tez kerak",
    "status": "YANGI",
    "gilamSoni": null,
    "adyolSoni": null,
    "pardaOgirligi": null,
    "korpaSoni": null,
    "umumiyHajm": null,
    "summa": null,
    "izohAdmin": null,
    "qarzHolati": "TOLANMAGAN",
    "tolanganSumma": 0,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "yaratganOperatorLogin": "Operator",
    "yaratganOperatorId": 2,
    "tahrirlaganAdminLogin": null,
    "bajarganIshchiLogin": null,
    "chiqarganOperatorLogin": null,
    "chiqarganOperatorId": null
  }
]
```

---

### POST `/api/orders`
**Protected** — OPERATOR role only (extracted from JWT)

**Request body:**
```json
{
  "mijozIsmi": "Alisher Karimov",
  "manzil": "Yunusobod 12-uy",
  "telefon": "+998901234567",
  "izohOperator": "Tez kerak"
}
```

**Notes:**
- `status` is automatically set to `YANGI`
- `yaratganOperatorId` is extracted from the JWT token
- `id` auto-increments starting from **4000**

**Response `201 Created`:** the created `Order` object

---

### PATCH `/api/orders/{id}`
**Protected** — role determines which fields can be updated

**Admin** (status `ISHDA`): fills technical details
```json
{
  "status": "ISHDA",
  "gilamSoni": 5,
  "adyolSoni": 2,
  "pardaOgirligi": 3.5,
  "korpaSoni": 1,
  "umumiyHajm": 42.0,
  "summa": 840000,
  "izohAdmin": "Ehtiyotkorlik bilan"
}
```

**Ishchi** (status `TAYYOR`):
```json
{ "status": "TAYYOR" }
```

**Operator** (status `YUBORILDI`):
```json
{ "status": "YUBORILDI" }
```

**Admin** (debt update):
```json
{ "tolanganSumma": 500000, "qarzHolati": "QISMAN" }
```

**Response `200 OK`:** the updated `Order` object (or `204 No Content`)

---

## Debt Summary

### GET `/api/orders/debt-summary`
**Protected** — ADMIN role only

Returns orders where `qarzHolati != TOLANGAN` along with total outstanding amount.

**Response `200 OK`:**
```json
{
  "orders": [ ...Order[] ],
  "totalDebt": 4500000
}
```

---

## Analytics (optional — frontend falls back to raw orders if unavailable)

### GET `/api/analytics`
**Protected** — ADMIN role only

**Response `200 OK`:**
```json
{
  "chartData": [
    { "label": "24.06", "summa": 1500000, "hajm": 45.5, "count": 3 },
    { "label": "01.07", "summa": 2100000, "hajm": 62.0, "count": 5 }
  ],
  "totals": {
    "summa": 25000000,
    "hajm": 340.5,
    "adyolKorpa": 47,
    "count": 28
  }
}
```

> **Note:** If this endpoint returns 404, the frontend automatically falls back to fetching raw `YUBORILDI` orders and aggregating client-side.

---

## Users (Seed Data)

Spring Boot must seed these 3 users on startup:

| Login | Password | Role |
|---|---|---|
| `admin` | `admin` | `ADMIN` |
| `Operator` | `Operator` | `OPERATOR` |
| `Ishchi` | `Ishchi` | `ISHCHI` |

Passwords must be stored as **BCrypt hashes**.

---

## ID Generation

Order IDs must start at **4000** and auto-increment:
- In PostgreSQL: `ALTER SEQUENCE orders_id_seq RESTART WITH 4000;`
- In MySQL: `AUTO_INCREMENT = 4000` on table creation

---

## CORS Configuration

Allow the Next.js frontend origin (add to Spring Boot):
```java
@CrossOrigin(origins = "http://localhost:3000")
// or configure via WebMvcConfigurer
```

---

## JWT Token

- Algorithm: **HS256**
- Expiry: **7 days** (frontend session cookie matches this)
- Required claims: `sub` (userId), `role`, `login`
- The frontend stores the token in its own signed session cookie and forwards it as `Authorization: Bearer <token>` on every API call
