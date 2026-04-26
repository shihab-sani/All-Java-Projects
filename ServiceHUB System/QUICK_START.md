# ServiceHub System - Quick Start Guide

## 🚀 What Was Fixed

1. **API Endpoint Mismatch** ✅
   - Changed `/worker` → `/workers` (plural)
   - Changed `/booking` → `/bookings` (plural)
   
2. **Flyway Migrations** ✅
   - Enabled Flyway in `application.yaml`
   - Created comprehensive database schema migration
   
3. **MySQL Database** ✅
   - Added automated schema creation via Flyway
   - No manual SQL needed!

---

## 🔧 Required Setup (One-Time)

### Create MySQL Database
```bash
# Connect to MySQL
mysql -u root -p

# Run this command:
CREATE DATABASE IF NOT EXISTS servicehub;
EXIT;
```

---

## ▶️ Run the Application

### Terminal 1: Start Backend
```bash
cd "ServiceHUB System/Servicehub System"
./mvnw spring-boot:run
```

**Expected Output:**
```
Started ServicehubSystemApplication in 5.432 seconds
2024-XX-XX Flyway is enabled and will execute schema migrations automatically
```

The backend will:
- Create all database tables automatically (Flyway)
- Listen on `http://localhost:8080/api`
- Enable CORS for frontend requests

### Terminal 2: Start Frontend
```bash
cd "ServiceHUB System/Servicehub System/Frontend"
npm install
npm run dev
```

**Opens:** `http://localhost:3000`

---

## ✅ Test the Connection

### Option 1: Browser Console
```javascript
// Test if API is accessible
fetch('http://localhost:8080/api/workers/category/Plumbing')
  .then(r => r.json())
  .then(data => console.log('Success!', data))
  .catch(err => console.log('Error:', err))
```

### Option 2: curl Command
```bash
curl -X GET "http://localhost:8080/api/workers/category/Plumbing"
```

### Option 3: Use Frontend UI
1. Go to http://localhost:3000
2. Try to search for workers
3. Check DevTools → Network tab to see API calls succeeding

---

## 📝 API Endpoints (Now Working)

```
GET    /api/workers/category/{category}
GET    /api/workers/city/{city}
GET    /api/workers/nearby?serviceCategory=X&city=Y
GET    /api/workers/{workerId}
GET    /api/workers/verified

POST   /api/bookings
GET    /api/bookings/{bookingId}
GET    /api/bookings/customer/{customerId}
GET    /api/bookings/worker/{workerId}
PUT    /api/bookings/{bookingId}/accept
PUT    /api/bookings/{bookingId}/complete?actualHours=8
PUT    /api/bookings/{bookingId}/cancel

POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/validate
```

---

## 📊 Database Tables (Auto-Created)

- `users` - User accounts
- `workers` - Worker profiles
- `customers` - Customer profiles
- `bookings` - Service bookings
- `reviews` - Ratings and reviews
- `payments` - Payment records
- `verification_documents` - Worker documents

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| 404 errors on API calls | Use plural endpoints: `/workers`, `/bookings` |
| "Table doesn't exist" | Wait for Flyway migration or check MySQL database created |
| CORS errors | Backend is configured, check browser console for details |
| No API response | Make sure backend is running on port 8080 |

---

## 📦 Dependencies Status

✅ All required dependencies are in `pom.xml`:
- Spring Boot 4.0.5
- Spring Data JPA
- Spring Security
- Flyway
- MySQL Connector
- JWT
- Jackson
- Lombok

**No installation needed!**

---

## 🔐 Configuration Files

- **Backend config:** `src/main/resources/application.yaml`
- **Frontend config:** `Frontend/.env`
- **Database migration:** `src/main/resources/db/migration/V1__Initial_Database_Setup.sql`
- **CORS:** `ServicehubSystemApplication.java` + Controller `@CrossOrigin`

---

## 📞 Testing Credentials

After running Flyway migration, create test data using API:

```bash
# Register a worker
curl -X POST "http://localhost:8080/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "worker@example.com",
    "password": "password123",
    "fullName": "John Doe",
    "userType": "WORKER"
  }'

# Login
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "worker@example.com",
    "password": "password123"
  }'
```

---

## ✨ What's Next

1. Add test data to database
2. Update JWT secret for production
3. Configure email notifications
4. Add payment gateway integration
5. Deploy to production

---

**All fixes are complete! Your frontend and backend should now communicate properly.** 🎉
