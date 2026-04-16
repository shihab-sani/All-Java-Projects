# ServiceHUB System - Critical Issues Report

## 🔴 CRITICAL SECURITY ISSUES

### 1. Hardcoded Database Credentials
**File**: `src/main/resources/application.yaml`
**Severity**: CRITICAL
**Issue**: Username `root` and password `Shihab14032001` exposed

```yaml
# ❌ BEFORE (INSECURE)
datasource:
  url: jdbc:mysql://localhost:3306/servicehub
  username: root
  password: Shihab14032001
```

**Fix**: Use environment variables
```yaml
# ✅ AFTER
datasource:
  url: ${DB_URL:jdbc:mysql://localhost:3306/servicehub}
  username: ${DB_USERNAME:root}
  password: ${DB_PASSWORD:}
```

---

### 2. Weak/Hardcoded JWT Secret
**File**: `src/main/resources/application.yaml`
**Severity**: CRITICAL
**Issue**: JWT secret is a placeholder string, anyone can forge tokens

```yaml
# ❌ INSECURE
app:
  jwtSecret: "your-secret-key-change-in-production-min-32-characters-long"
```

**Fix**: Generate a strong secret and use environment variable
```yaml
# ✅ SECURE
app:
  jwtSecret: ${JWT_SECRET:}  # Must be 32+ chars in production
```

---

### 3. Missing Authentication on Protected Endpoints
**Files**: 
- `BookingController.java`
- `WorkerController.java`
- `AdminController.java`

**Severity**: CRITICAL
**Issue**: These endpoints lack authentication enforcement

**Fix in SecurityConfig**:
```java
.authorizeHttpRequests(authz -> authz
    .requestMatchers("/api/auth/**").permitAll()
    .requestMatchers("/api/admin/**").hasRole("ADMIN")
    .requestMatchers("/api/booking/**").authenticated()
    .requestMatchers("/api/worker/**").authenticated()
    .anyRequest().authenticated()
)
```

---

## 🟠 HIGH PRIORITY ISSUES

### 4. Inconsistent Endpoint Paths
**Issue**: Path inconsistency causes CORS and routing issues

| Controller | Current Path | Expected Path |
|-----------|-------------|--------------|
| AuthController | `/auth` | `/api/auth` |
| BookingController | `/booking` | `/api/booking` |
| WorkerController | `/worker` | `/api/worker` |
| AdminController | `/api/admin` | `/api/admin` ✓ |

**Fix Required**: Update `@RequestMapping` annotations:
```java
// BookingController
@RequestMapping("/api/booking")  // ← Add /api prefix

// WorkerController
@RequestMapping("/api/worker")   // ← Add /api prefix

// AuthController
@RequestMapping("/api/auth")     // ← Add /api prefix
```

---

### 5. Poor Error Handling & Information Disclosure
**Issue**: Generic errors expose internal details

**Current Code**:
```java
catch (Exception e) {
    return ResponseEntity.badRequest().build();  // No error info
}
```

**Better Approach**:
```java
catch (InvalidCredentialsException e) {
    return ResponseEntity.status(401).body(Map.of(
        "error", "Invalid email or password"
    ));
}
catch (Exception e) {
    return ResponseEntity.status(500).body(Map.of(
        "error", "An unexpected error occurred"
    ));
}
```

---

### 6. Missing Input Validation
**Issue**: No validation on request parameters/body

**Example - BookingController**:
```java
// ❌ No validation
@PostMapping
public ResponseEntity<Booking> createBooking(
    @RequestParam Long customerId,
    @RequestParam Long workerId,
    @RequestParam BigDecimal hourlyRate,  // Could be negative!
    @RequestParam LocalDateTime scheduledDate)  // Could be past date!
```

**Fix**: Add validation
```java
// ✅ With validation
@PostMapping
public ResponseEntity<Booking> createBooking(
    @RequestParam @NotNull Long customerId,
    @RequestParam @NotNull Long workerId,
    @RequestParam @NotNull @Positive BigDecimal hourlyRate,
    @RequestParam @NotNull @FutureOrPresent LocalDateTime scheduledDate)
```

---

### 7. Flyway Migrations Disabled
**File**: `application.yaml`
**Issue**: `flyway.enabled: false` but dependency exists

**Problem**: Database schema may not be created automatically
**Solution**: Enable Flyway and create migration scripts:
```
src/main/resources/db/migration/
├── V1__Create_users_table.sql
├── V2__Create_bookings_table.sql
├── V3__Create_vouchers_table.sql
└── V4__Create_reviews_table.sql
```

---

## 🟡 MEDIUM PRIORITY ISSUES

### 8. Duplicate CORS Configuration
**Issue**: CORS is configured in 3 places:
1. SecurityConfig.java (now active)
2. application.yaml (redundant)
3. @CrossOrigin annotations on each controller (redundant)

**Cleanup**: Remove from `application.yaml` and controller annotations

### 9. Missing Exception Handling
**Services may lack try-catch blocks** for database operations
**Fix**: Add proper exception handling and logging

### 10. No Rate Limiting
**Risk**: API endpoints can be abused
**Solution**: Add Spring Security Rate Limiting or API Gateway rules

---

## ✅ ACTION ITEMS (Priority Order)

1. **IMMEDIATE**: Remove hardcoded credentials from `application.yaml`
2. **IMMEDIATE**: Change JWT secret to a strong random key
3. **HIGH**: Fix endpoint path inconsistencies (add `/api` prefix)
4. **HIGH**: Add `@PreAuthorize` annotations for admin/protected endpoints
5. **MEDIUM**: Enable Flyway and create database migration scripts
6. **MEDIUM**: Add input validation to all controllers
7. **LOW**: Improve error handling and remove information disclosure
8. **LOW**: Clean up redundant CORS configuration

---

## 📋 Environment Variables Needed

Create a `.env` file (never commit this):
```
DB_URL=jdbc:mysql://localhost:3306/servicehub
DB_USERNAME=root
DB_PASSWORD=your_secure_password
JWT_SECRET=your-min-32-character-random-secret-key-here
```

Update `application.yaml` to use these variables as shown above.
