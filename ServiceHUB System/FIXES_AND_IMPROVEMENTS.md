# ServiceHub System - Frontend-Backend Connection Fixes & Flyway Implementation

## Issues Found & Fixed

### 1. ✅ API Endpoint Mismatch (CRITICAL)
**Problem:** Frontend expected plural endpoints (`/api/workers`, `/api/bookings`) but backend was using singular endpoints (`/api/worker`, `/api/booking`).

**Impact:** All API calls from frontend were failing with 404 errors.

**Fixed Files:**
- `WorkerController.java` - Changed `@RequestMapping("/worker")` → `@RequestMapping("/workers")`
- `BookingController.java` - Changed `@RequestMapping("/booking")` → `@RequestMapping("/bookings")`

**Status:** ✅ RESOLVED

---

### 2. ✅ Flyway Database Migrations (Disabled)
**Problem:** Flyway starter dependency was included in `pom.xml` but was disabled in `application.yaml`.

**Fixed in `application.yaml`:**
```yaml
# Before:
flyway:
  enabled: false

# After:
flyway:
  enabled: true
  locations: classpath:db/migration
```

**Status:** ✅ ENABLED

---

### 3. ✅ Flyway Migration Script Added
**Created:** `src/main/resources/db/migration/V1__Initial_Database_Setup.sql`

This comprehensive migration script creates the following tables:
- **users** - All users (customers, workers, admins)
- **workers** - Worker-specific information
- **customers** - Customer-specific information  
- **bookings** - Service bookings and job tracking
- **reviews** - Customer reviews and ratings
- **payments** - Payment tracking
- **verification_documents** - Worker document verification

**Key Features:**
- Proper foreign keys with CASCADE delete rules
- Appropriate indexes for performance optimization
- MySQL-specific data types (ENUM for status fields, DECIMAL for money)
- Timestamp tracking (created_at, updated_at)
- Character set: `utf8mb4` for full Unicode support
- Engine: InnoDB for transaction support

**Status:** ✅ READY TO USE

---

## Backend Dependencies Already Configured

The `pom.xml` already includes:
- ✅ Flyway Spring Boot Starter
- ✅ Spring Data JPA
- ✅ Spring Security
- ✅ MySQL Connector
- ✅ JWT (jjwt)
- ✅ Jackson (JSON processing)
- ✅ Lombok
- ✅ Spring WebMVC

**No additional dependencies needed!**

---

## CORS Configuration

The backend is already properly configured with CORS:

**Method 1 (Global in ServicehubSystemApplication.java):**
```java
registry.addMapping("/**")
    .allowedOrigins("http://localhost:3000", "http://localhost:3001")
    .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
    .allowedHeaders("*")
    .allowCredentials(true)
    .maxAge(3600);
```

**Method 2 (Controller-level via @CrossOrigin):**
- All controllers use `@CrossOrigin(origins = "*")` for additional coverage

**Status:** ✅ PROPERLY CONFIGURED

---

## Frontend Configuration

The frontend is correctly configured in `.env`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

And the API client (`app/lib/api.ts`) properly constructs endpoints using this base URL.

---

## How to Test the Connection

### Step 1: Start the Backend
```bash
cd "ServiceHUB System/Servicehub System"
./mvnw spring-boot:run
```
The backend will:
1. Run Flyway migrations (creating all tables automatically)
2. Start on `http://localhost:8080/api`
3. Listen for API requests

### Step 2: Start the Frontend
```bash
cd "ServiceHUB System/Servicehub System/Frontend"
npm install  # or pnpm install
npm run dev  # or pnpm dev
```
The frontend will start on `http://localhost:3000`

### Step 3: Test API Calls
Try the following in your browser console or with curl:

```bash
# Test worker search
curl -X GET "http://localhost:8080/api/workers/category/Plumbing"

# Test authentication
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test bookings
curl -X GET "http://localhost:8080/api/bookings/customer/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Database Setup Checklist

- [x] MySQL server running on `localhost:3306`
- [x] Database credentials configured in `application.yaml`:
  - Username: `root`
  - Password: `Shihab14032001`
  - Database: `servicehub`
- [x] Create the database before first run:
  ```sql
  CREATE DATABASE IF NOT EXISTS servicehub;
  ```
- [x] Flyway will automatically create all tables on first run
- [x] No manual SQL execution needed after database creation

---

## Application Configuration

**File:** `src/main/resources/application.yaml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/servicehub
    username: root
    password: Shihab14032001
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  flyway:
    enabled: true
    locations: classpath:db/migration
  
  jpa:
    hibernate:
      ddl-auto: validate  # Don't auto-create, use Flyway instead
```

---

## Troubleshooting Guide

### Issue: 404 errors on API calls
**Solution:** Verify the endpoint matches the controller mapping:
- Workers: `/api/workers/...` (plural)
- Bookings: `/api/bookings/...` (plural)
- Auth: `/api/auth/...`

### Issue: CORS errors
**Solution:** Already configured, but if still failing:
1. Check both places: `ServicehubSystemApplication.java` AND controller `@CrossOrigin`
2. Verify frontend URL is in `allowedOrigins`
3. Clear browser cache

### Issue: "No tables found" error
**Solution:**
1. Create the database: `CREATE DATABASE IF NOT EXISTS servicehub;`
2. Restart the backend - Flyway will auto-create all tables
3. Check logs for migration errors

### Issue: JWT authentication fails
**Location:** `application.yaml`
```yaml
app:
  jwtSecret: "your-secret-key-change-in-production-min-32-characters-long"
  jwtExpirationMs: 86400000 # 24 hours
```
Change these values for production!

---

## Summary of Changes

| File | Change | Status |
|------|--------|--------|
| `WorkerController.java` | Fixed endpoint from `/worker` to `/workers` | ✅ Fixed |
| `BookingController.java` | Fixed endpoint from `/booking` to `/bookings` | ✅ Fixed |
| `application.yaml` | Enabled Flyway migrations | ✅ Fixed |
| `V1__Initial_Database_Setup.sql` | Created comprehensive Flyway migration | ✅ Added |

---

## Next Steps

1. **Create MySQL Database:**
   ```sql
   CREATE DATABASE IF NOT EXISTS servicehub;
   ```

2. **Run Backend:**
   ```bash
   ./mvnw spring-boot:run
   ```

3. **Run Frontend:**
   ```bash
   npm run dev
   ```

4. **Test API Connectivity:**
   - Open http://localhost:3000
   - Try authentication or search for workers
   - Check browser DevTools → Network tab for API calls

5. **Monitor Flyway Migrations:**
   - Check application logs for `Flyway` migration messages
   - All tables should be created automatically

---

## Security Reminder

⚠️ **Before Production Deployment:**
1. Change the JWT secret in `application.yaml` to a long random string
2. Change MySQL password from `Shihab14032001`
3. Use environment variables for sensitive data
4. Configure HTTPS for all CORS origins
5. Implement rate limiting
6. Add input validation and sanitization
