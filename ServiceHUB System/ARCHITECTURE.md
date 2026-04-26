# ServiceHub System - Architecture & Connection Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SERVICEHUB SYSTEM ARCHITECTURE                   │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐                   ┌──────────────────────────┐
│   FRONTEND (Next.js)     │                   │   BACKEND (Spring Boot)  │
│  localhost:3000          │                   │  localhost:8080/api      │
├──────────────────────────┤                   ├──────────────────────────┤
│                          │                   │                          │
│  Components:             │                   │  Controllers:            │
│  ├─ Login Page           │ HTTP Request      │  ├─ AuthController      │
│  ├─ Search Workers       │  (JSON) ────────► │  ├─ WorkerController    │
│  ├─ Booking Form         │                   │  ├─ BookingController   │
│  ├─ User Dashboard       │                   │  ├─ AdminController     │
│  └─ Reviews              │                   │  └─ [CORS Enabled]      │
│                          │                   │                          │
│  Environment:            │                   │  Services:              │
│  NEXT_PUBLIC_API_URL     │                   │  ├─ AuthService         │
│  = http://localhost:8080 │ HTTP Response     │  ├─ WorkerService       │
│    /api                  │  (JSON) ◄────────│  ├─ BookingService       │
│                          │                   │  └─ UserService         │
│  API Client:             │                   │                          │
│  ├─ Uses Fetch API       │                   │  Repositories:          │
│  ├─ Handles JWT tokens   │                   │  ├─ UserRepository      │
│  ├─ Error handling       │                   │  ├─ WorkerRepository    │
│  └─ Automatic retries    │                   │  ├─ BookingRepository   │
│                          │                   │  └─ ReviewRepository    │
│                          │                   │                          │
│  State Management:       │                   │  Security:              │
│  ├─ AuthContext          │                   │  ├─ JWT Authentication  │
│  ├─ User data            │                   │  ├─ Spring Security     │
│  └─ Booking state        │                   │  └─ CORS Configuration  │
│                          │                   │                          │
└──────────────────────────┘                   └──────────────────────────┘
         │                                                │
         │                                                │
         │        FIXED: Endpoint Mismatch ✅            │
         │        /workers (plural) matches               │
         │                                                │
         └────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────┐
│         DATABASE (MySQL) - localhost:3306                    │
│         servicehub                                            │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Flyway Migrations:                                          │
│  ├─ V1__Initial_Database_Setup.sql ✅ CREATED              │
│                                                               │
│  Tables:                                                      │
│  ├─ users (core user data)                                   │
│  ├─ workers (worker profiles)                                │
│  ├─ customers (customer profiles)                            │
│  ├─ bookings (service bookings)                              │
│  ├─ reviews (ratings & feedback)                             │
│  ├─ payments (payment records)                               │
│  ├─ verification_documents (worker docs)                     │
│  └─ flyway_schema_history (migration tracking)              │
│                                                               │
│  Features:                                                    │
│  ├─ Foreign Key Relationships                                │
│  ├─ Cascading Deletes                                        │
│  ├─ Performance Indexes                                      │
│  ├─ UTF-8 Unicode Support                                    │
│  ├─ InnoDB Transaction Support                              │
│  └─ Status Enums (ENUM types)                               │
│                                                               │
└──────────────────────────────────────────────────────────────┘
         ▲
         │
         │ FIXED: Flyway Enabled ✅
         │ Automatic schema creation on startup
         │
         └─ Spring Boot application connects and runs migrations
```

---

## 📊 API Request/Response Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    API REQUEST/RESPONSE FLOW                              │
└──────────────────────────────────────────────────────────────────────────┘


FRONTEND REQUEST:
═════════════════════════════════════════════════════════════════════════

  1. User Action (e.g., "Search Plumbing Workers")
         │
         ▼
  2. Frontend calls API:
     fetch(`${API_BASE_URL}/workers/category/Plumbing`, {
       method: 'GET',
       headers: { 'Authorization': 'Bearer JWT_TOKEN' }
     })
         │
         ▼
  3. Resolved URL:
     http://localhost:8080/api/workers/category/Plumbing
     
     BEFORE FIX: ❌ /worker (singular) - NOT FOUND (404)
     AFTER FIX:  ✅ /workers (plural) - FOUND (200)
         │
         ▼
  4. HTTP GET Request sent across network
         │
         ▼

BACKEND PROCESSING:
═════════════════════════════════════════════════════════════════════════

  5. Spring Boot receives request at port 8080/api
         │
         ▼
  6. DispatcherServlet routes to WorkerController
     @RequestMapping("/workers") ✅ MATCHES NOW
         │
         ▼
  7. Method invoked:
     @GetMapping("/category/{category}")
     public getWorkersByCategory(@PathVariable String category)
         │
         ▼
  8. Service layer called:
     workerService.findWorkersByCategory("Plumbing")
         │
         ▼
  9. Repository executes SQL:
     SELECT * FROM workers WHERE service_category = 'Plumbing'
         │
         ▼
  10. Database returns results
         │
         ▼
  11. Response marshalled to JSON:
      [
        {
          "id": 1,
          "name": "John Plumber",
          "category": "Plumbing",
          "rating": 4.8,
          "hourlyRate": 45.00
        },
        ...
      ]
         │
         ▼

FRONTEND RESPONSE:
═════════════════════════════════════════════════════════════════════════

  12. HTTP 200 Response received
         │
         ▼
  13. JSON parsed by JavaScript
         │
         ▼
  14. React component re-renders with data
         │
         ▼
  15. UI displays workers list ✅ SUCCESS
```

---

## 🔌 Technology Stack

```
┌─────────────────────────────────────────────────────────────────────┐
│                      TECHNOLOGY STACK                                │
├─────────────────────────────────────────────────────────────────────┤

FRONTEND
────────
├─ Next.js 14+          (React framework)
├─ TypeScript           (Type safety)
├─ Tailwind CSS         (Styling)
├─ Fetch API            (HTTP requests)
├─ Context API          (State management)
└─ Environment Variables (Configuration)

BACKEND
────────
├─ Spring Boot 4.0.5    (Java framework)
├─ Spring Security      (Authentication)
├─ Spring Data JPA      (ORM)
├─ Hibernate            (JPA implementation)
├─ Flyway              (Database migrations) ✅
├─ JWT (jjwt)          (Token-based auth)
├─ Lombok              (Code generation)
└─ Jackson             (JSON processing)

DATABASE
────────
├─ MySQL 5.7+          (Relational DB)
├─ InnoDB              (Transaction support)
├─ UTF-8 Charset       (Unicode)
└─ Flyway Tracking     (Schema versioning)

DEPLOYMENT
──────────
├─ Maven               (Build tool)
├─ localhost:3000      (Frontend dev server)
└─ localhost:8080/api  (Backend dev server)
```

---

## 🔄 Database Migration Flow (Flyway)

```
┌──────────────────────────────────────────────────────────────────────┐
│                    FLYWAY MIGRATION FLOW                              │
└──────────────────────────────────────────────────────────────────────┘

APPLICATION STARTUP:
════════════════════════════════════════════════════════════════════

  1. Spring Boot starts
         │
         ▼
  2. Reads application.yaml:
     flyway:
       enabled: true ✅
       locations: classpath:db/migration
         │
         ▼
  3. Flyway initializes
         │
         ▼
  4. Scans: src/main/resources/db/migration/
         │
         ├─ Finds: V1__Initial_Database_Setup.sql ✅
         │
         └─ Pattern: V{version}__{description}.sql
                     ^           ^
                     │           └─ Underscores separate words
                     └─ Version number (V1, V2, V3, ...)
         │
         ▼
  5. Checks MySQL database for flyway_schema_history table
         │
         ├─ If FIRST RUN:
         │  ├─ Create flyway_schema_history table
         │  ├─ Execute V1__Initial_Database_Setup.sql
         │  ├─ Record: { version: 1, description: 'Initial_Database_Setup', ... }
         │  └─ Log: "Flyway successfully applied 1 migration to schema public"
         │
         └─ If SUBSEQUENT RUN:
            ├─ Check history for V1
            ├─ V1 already executed? Skip it.
            ├─ Any new migrations (V2, V3)? Execute them.
            └─ Continue with app startup
         │
         ▼
  6. Database schema now matches application code
         │
         ▼
  7. Spring Data JPA validates with @Entity annotations
         │
         ▼
  8. Application ready to serve requests ✅


RESULTING DATABASE STATE:
═════════════════════════════════════════════════════════════════════

mysql> USE servicehub;

mysql> SHOW TABLES;
+----------------------------+
| Tables_in_servicehub       |
+----------------------------+
| bookings                   | ✅ Created by V1
| customers                  | ✅ Created by V1
| flyway_schema_history      | ✅ Created by Flyway
| payments                   | ✅ Created by V1
| reviews                    | ✅ Created by V1
| users                      | ✅ Created by V1
| verification_documents     | ✅ Created by V1
| workers                    | ✅ Created by V1
+----------------------------+

mysql> SELECT * FROM flyway_schema_history;
+--------+-----------+----------+--------+------------------+----------+---+
| version | description | type   | script | success | ... | ... |
+--------+-----------+----------+--------+------------------+----------+---+
| 1      | Initial   | SQL    | V1__   | 1       | ... | ... |
|        | Database  |        | Init.  |         |     |     |
|        | Setup     |        | sql    |         |     |     |
+--------+-----------+----------+--------+------------------+----------+---+
```

---

## 🔐 Security & CORS

```
┌──────────────────────────────────────────────────────────────────────┐
│                  CORS & SECURITY CONFIGURATION                        │
└──────────────────────────────────────────────────────────────────────┘

FRONTEND REQUEST:
════════════════════════════════════════════════════════════════════

Browser (http://localhost:3000) makes request to:
http://localhost:8080/api/workers/category/Plumbing

     ↓

Browser sends CORS preflight (OPTIONS request):

  OPTIONS /api/workers/category/Plumbing HTTP/1.1
  Origin: http://localhost:3000
  Access-Control-Request-Method: GET
  Access-Control-Request-Headers: Authorization

     ↓

BACKEND CORS CONFIGURATION:
════════════════════════════════════════════════════════════════════

ServicehubSystemApplication.java:
┌────────────────────────────────────────────────────┐
│ @Bean                                              │
│ public WebMvcConfigurer corsConfigurer() {         │
│   return new WebMvcConfigurer() {                  │
│     @Override                                      │
│     public void addCorsMappings(CorsRegistry r) {  │
│       r.addMapping("/**")                          │
│        .allowedOrigins(                            │
│          "http://localhost:3000",  ✅             │
│          "http://localhost:3001"   ✅             │
│        )                                           │
│        .allowedMethods(                            │
│          "GET", "POST", "PUT",                    │
│          "DELETE", "PATCH", "OPTIONS"             │
│        )                                           │
│        .allowedHeaders("*")       ← All headers OK │
│        .allowCredentials(true)    ← JWT token OK  │
│        .maxAge(3600);             ← Cache 1 hour  │
│     }                                              │
│   };                                               │
│ }                                                  │
└────────────────────────────────────────────────────┘

     ↓

BACKEND CORS RESPONSE:
════════════════════════════════════════════════════════════════════

  HTTP/1.1 200 OK
  Access-Control-Allow-Origin: http://localhost:3000
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
  Access-Control-Allow-Headers: *
  Access-Control-Allow-Credentials: true
  Access-Control-Max-Age: 3600

     ↓

BROWSER VERIFICATION:
════════════════════════════════════════════════════════════════════

✅ Request origin (3000) matches allowed origin
✅ Request method (GET) is in allowed methods
✅ All headers allowed
✅ Credentials (JWT) allowed

     ↓

ACTUAL REQUEST SENT:
════════════════════════════════════════════════════════════════════

GET /api/workers/category/Plumbing HTTP/1.1
Host: localhost:8080
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Origin: http://localhost:3000

     ↓

✅ REQUEST SUCCEEDS - 200 OK
```

---

## 📋 File Structure

```
ServiceHUB System/
├── Servicehub System/                              (Backend)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/servicehub/system/
│   │   │   │   ├── Controller/
│   │   │   │   │   ├── AuthController.java        ✅ Fixed paths
│   │   │   │   │   ├── WorkerController.java      ✅ /workers (plural)
│   │   │   │   │   ├── BookingController.java     ✅ /bookings (plural)
│   │   │   │   │   └── AdminController.java
│   │   │   │   ├── Service/
│   │   │   │   │   ├── AuthService.java
│   │   │   │   │   ├── WorkerService.java
│   │   │   │   │   └── BookingService.java
│   │   │   │   ├── Repository/
│   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   ├── WorkerRepository.java
│   │   │   │   │   └── BookingRepository.java
│   │   │   │   ├── Entity/
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── Worker.java
│   │   │   │   │   └── Booking.java
│   │   │   │   ├── DTO/
│   │   │   │   │   ├── AuthRequest.java
│   │   │   │   │   ├── AuthResponse.java
│   │   │   │   │   └── WorkerProfileDTO.java
│   │   │   │   └── ServicehubSystemApplication.java ✅ CORS config
│   │   │   └── resources/
│   │   │       ├── application.yaml                ✅ Flyway enabled
│   │   │       └── db/migration/
│   │   │           └── V1__Initial_Database_Setup.sql ✅ CREATED
│   │   └── test/
│   │       └── java/servicehub/...
│   ├── pom.xml                                     ✅ Has all deps
│   ├── mvnw & mvnw.cmd
│   └── .mvn/
│
├── Frontend/                                        (Frontend)
│   ├── app/
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── dashboard/
│   │   │   ├── search/page.tsx
│   │   │   ├── bookings/page.tsx
│   │   │   └── worker/[workerId]/page.tsx
│   │   ├── lib/
│   │   │   └── api.ts                              ✅ Correct endpoints
│   │   └── page.tsx
│   ├── .env                                        ✅ API_URL configured
│   ├── next.config.mjs
│   ├── tsconfig.json
│   └── package.json
│
├── FIXES_AND_IMPROVEMENTS.md                       ✅ Detailed guide
├── QUICK_START.md                                  ✅ Fast setup
├── VERIFICATION_CHECKLIST.md                       ✅ Testing guide
├── IMPLEMENTATION_SUMMARY.md                       ✅ Summary
└── ARCHITECTURE.md                                 ✅ This file
```

---

## ✅ Verification Points

```
FRONTEND ↔ BACKEND CONNECTION
════════════════════════════════════════════════════════════════════

[✅] API Base URL configured
     NEXT_PUBLIC_API_URL = http://localhost:8080/api

[✅] Endpoint paths correct
     GET /api/workers/category/{category}     (plural)
     GET /api/bookings/customer/{id}          (plural)

[✅] CORS enabled
     Frontend origin (http://localhost:3000) allowed
     All HTTP methods allowed
     JWT credentials allowed

[✅] HTTP methods supported
     GET ✓   POST ✓   PUT ✓   DELETE ✓   PATCH ✓   OPTIONS ✓

[✅] Response format
     JSON returned from all endpoints
     Proper HTTP status codes (200, 404, 401, 500)


DATABASE CONFIGURATION
════════════════════════════════════════════════════════════════════

[✅] Flyway enabled
     spring.flyway.enabled = true

[✅] Migration location configured
     locations: classpath:db/migration

[✅] Migration file present
     V1__Initial_Database_Setup.sql (129 lines)

[✅] MySQL driver available
     com.mysql.cj.jdbc.Driver

[✅] Database connection
     URL: jdbc:mysql://localhost:3306/servicehub
     Username: root
     Password: ••••••••••

[✅] JPA/Hibernate configured
     ddl-auto: validate (don't recreate, use Flyway)
```

---

**Architecture Overview Complete! 🏗️**

All components properly connected and documented.
